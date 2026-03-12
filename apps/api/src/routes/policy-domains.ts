/**
 * Policy Domain API Routes
 * Handles policy domain/category management
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/policy-domains
 * List all policy domains
 */
router.get('/', async (_req, res) => {
    try {
        const domains = await prisma.policyDomain.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                _count: {
                    select: {
                        simulations: true,
                    },
                },
            },
        });

        res.json({
            domains: domains.map(d => ({
                id: d.id,
                name: d.name,
                slug: d.slug,
                description: d.description,
                simulationCount: d._count.simulations,
            })),
        });
    } catch (error) {
        console.error('Error fetching policy domains:', error);
        res.status(500).json({ error: 'Failed to fetch policy domains' });
    }
});

/**
 * GET /api/policy-domains/:slug
 * Get single policy domain
 */
router.get('/:slug', async (req, res) => {
    try {
        const domain = await prisma.policyDomain.findUnique({
            where: { slug: req.params.slug },
            include: {
                discussionThread: {
                    include: {
                        posts: {
                            take: 10,
                            orderBy: { createdAt: 'desc' },
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        role: true,
                                    },
                                },
                                _count: {
                                    select: {
                                        comments: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!domain) {
            return res.status(404).json({ error: 'Policy domain not found' });
        }

        res.json({
            id: domain.id,
            name: domain.name,
            slug: domain.slug,
            description: domain.description,
            discussionThread: domain.discussionThread ? {
                id: domain.discussionThread.id,
                recentPosts: domain.discussionThread.posts.map(p => ({
                    id: p.id,
                    title: p.title,
                    author: p.author,
                    commentCount: p._count.comments,
                    createdAt: p.createdAt,
                })),
            } : null,
        });
    } catch (error) {
        console.error('Error fetching policy domain:', error);
        res.status(500).json({ error: 'Failed to fetch policy domain' });
    }
});

/**
 * GET /api/policy-domains/:slug/thread
 * Get discussion thread for policy domain
 */
router.get('/:slug/thread', async (req, res) => {
    try {
        const { limit = '20', offset = '0' } = req.query;

        const domain = await prisma.policyDomain.findUnique({
            where: { slug: req.params.slug },
            include: {
                discussionThread: true,
            },
        });

        if (!domain || !domain.discussionThread) {
            return res.status(404).json({ error: 'Discussion thread not found' });
        }

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { threadId: domain.discussionThread.id },
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit as string),
                skip: parseInt(offset as string),
                include: {
                    author: {
                        select: {
                            id: true,
                            fullName: true,
                            role: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
            }),
            prisma.post.count({ where: { threadId: domain.discussionThread.id } }),
        ]);

        res.json({
            posts: posts.map(p => ({
                id: p.id,
                title: p.title,
                content: p.content,
                author: p.author,
                commentCount: p._count.comments,
                createdAt: p.createdAt,
            })),
            pagination: {
                total,
                limit: parseInt(limit as string),
                offset: parseInt(offset as string),
            },
        });
    } catch (error) {
        console.error('Error fetching discussion thread:', error);
        res.status(500).json({ error: 'Failed to fetch discussion thread' });
    }
});

export default router;
