import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createPostSchema = z.object({
    title: z.string().min(10).max(200),
    content: z.string().min(50).max(5000),
    hubId: z.string().optional(),
    tags: z.array(z.string()).max(5).optional(),
});

const commentSchema = z.object({
    content: z.string().min(1).max(1000),
});

// Get all posts with filters
router.get('/', async (_req, res) => {
    try {
        const { filter = 'trending', hubId, search, page = '1', limit = '10' } = _req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = { status: 'published' };

        if (hubId) {
            where.hubId = hubId;
        }

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { content: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = {};
        if (filter === 'trending') {
            orderBy = { upvoteCount: 'desc' };
        } else if (filter === 'new') {
            orderBy = { createdAt: 'desc' };
        }

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy,
                skip,
                take: parseInt(limit as string),
                include: {
                    author: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            }),
            prisma.post.count({ where }),
        ]);

        res.json({
            posts: posts.map(post => ({
                id: post.id,
                title: post.title,
                content: post.content,
                excerpt: post.excerpt || post.content.substring(0, 200) + '...',
                tags: post.tags,
                upvotes: post.upvoteCount,
                comments: post.commentCount,
                author: {
                    id: post.author.id,
                    name: post.author.fullName,
                    role: post.author.role,
                },
                hubId: post.hubId,
                hubLabel: post.hubId || 'General',
                createdAt: post.createdAt,
                isUpvoted: false, // TODO: Check if current user upvoted
                isBookmarked: false, // TODO: Check if current user bookmarked
            })),
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                pages: Math.ceil(total / parseInt(limit as string)),
            },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get single post
router.get('/:id', async (_req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: _req.params.id },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                fullName: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Create post (authenticated)
router.post('/', authenticate, async (req, res) => {
    try {
        const validated = createPostSchema.parse(req.body);
        const userId = (req as any).user.userId;

        const post = await prisma.post.create({
            data: {
                title: validated.title,
                content: validated.content,
                excerpt: validated.content.substring(0, 200) + '...',
                hubId: validated.hubId,
                userId: userId,
                tags: validated.tags || [],
                status: 'published',
                publishedAt: new Date(),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        res.status(201).json(post);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Upvote post (authenticated)
router.post('/:id/upvote', authenticate, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = (req as any).user.userId;

        // Check if already upvoted
        const existingUpvote = await prisma.postLike.findUnique({
            where: {
                postId_userId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingUpvote) {
            // Remove upvote
            await prisma.postLike.delete({
                where: {
                    postId_userId: {
                        userId,
                        postId,
                    },
                },
            });

            await prisma.post.update({
                where: { id: postId },
                data: { upvoteCount: { decrement: 1 } },
            });

            return res.json({ upvoted: false });
        } else {
            // Add upvote
            await prisma.postLike.create({
                data: {
                    userId,
                    postId,
                },
            });

            await prisma.post.update({
                where: { id: postId },
                data: { upvoteCount: { increment: 1 } },
            });

            return res.json({ upvoted: true });
        }
    } catch (error) {
        console.error('Error toggling upvote:', error);
        res.status(500).json({ error: 'Failed to toggle upvote' });
    }
});

// Add comment (authenticated)
router.post('/:id/comments', authenticate, async (req, res) => {
    try {
        const validated = commentSchema.parse(req.body);
        const userId = (req as any).user.userId;
        const postId = req.params.id;

        const comment = await prisma.comment.create({
            data: {
                content: validated.content,
                userId: userId,
                postId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true,
                    },
                },
            },
        });

        // Increment comment count
        await prisma.post.update({
            where: { id: postId },
            data: { commentCount: { increment: 1 } },
        });

        res.status(201).json(comment);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

// Bookmark post (authenticated)
router.post('/:id/bookmark', authenticate, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = (req as any).user.userId;

        const existingBookmark = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingBookmark) {
            await prisma.savedPost.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });
            return res.json({ bookmarked: false });
        } else {
            await prisma.savedPost.create({
                data: {
                    userId,
                    postId,
                },
            });
            return res.json({ bookmarked: true });
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        res.status(500).json({ error: 'Failed to toggle bookmark' });
    }
});

export default router;
