/**
 * Webinar API Routes
 * Expert-hosted educational events
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuthenticated, requireExpert } from '../middleware/rbac';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createWebinarSchema = z.object({
    title: z.string().min(10).max(200),
    description: z.string().max(2000).optional(),
    scheduledAt: z.string().datetime(),
    externalLink: z.string().url().optional(),
    tags: z.array(z.string()).max(10).optional(),
});

/**
 * GET /api/webinars
 * List all webinars (public)
 */
router.get('/', async (req, res) => {
    try {
        const { upcoming = 'true', limit = '20', offset = '0', tags } = req.query;

        const where: any = {};
        if (upcoming === 'true') {
            where.scheduledAt = { gte: new Date() };
        }
        if (tags) {
            where.tags = { hasSome: (tags as string).split(',') };
        }

        const [webinars, total] = await Promise.all([
            prisma.webinar.findMany({
                where,
                orderBy: { scheduledAt: 'asc' },
                take: parseInt(limit as string),
                skip: parseInt(offset as string),
                include: {
                    expert: {
                        select: {
                            id: true,
                            fullName: true,
                            expertProfile: {
                                select: {
                                    bio: true,
                                    expertiseTags: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.webinar.count({ where }),
        ]);

        res.json({
            webinars: webinars.map(w => ({
                id: w.id,
                title: w.title,
                description: w.description,
                scheduledAt: w.scheduledAt,
                externalLink: w.externalLink,
                tags: w.tags,
                expert: {
                    id: w.expert.id,
                    name: w.expert.fullName,
                    bio: w.expert.expertProfile?.bio,
                    expertise: w.expert.expertProfile?.expertiseTags,
                },
            })),
            pagination: {
                total,
                limit: parseInt(limit as string),
                offset: parseInt(offset as string),
            },
        });
    } catch (error) {
        console.error('Error fetching webinars:', error);
        res.status(500).json({ error: 'Failed to fetch webinars' });
    }
});

/**
 * POST /api/webinars
 * Create webinar (experts only)
 */
router.post('/', requireExpert, async (req, res) => {
    try {
        const validated = createWebinarSchema.parse(req.body);
        const user = (req as any).user;

        const webinar = await prisma.webinar.create({
            data: {
                expertUserId: user.userId,
                title: validated.title,
                description: validated.description,
                scheduledAt: new Date(validated.scheduledAt),
                externalLink: validated.externalLink,
                tags: validated.tags || [],
            },
        });

        res.status(201).json(webinar);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating webinar:', error);
        res.status(500).json({ error: 'Failed to create webinar' });
    }
});

/**
 * GET /api/webinars/:id
 * Get single webinar
 */
router.get('/:id', async (req, res) => {
    try {
        const webinar = await prisma.webinar.findUnique({
            where: { id: req.params.id },
            include: {
                expert: {
                    select: {
                        id: true,
                        fullName: true,
                        expertProfile: true,
                    },
                },
            },
        });

        if (!webinar) {
            return res.status(404).json({ error: 'Webinar not found' });
        }

        res.json(webinar);
    } catch (error) {
        console.error('Error fetching webinar:', error);
        res.status(500).json({ error: 'Failed to fetch webinar' });
    }
});

/**
 * PUT /api/webinars/:id
 * Update webinar (expert owner only)
 */
router.put('/:id', requireExpert, async (req, res) => {
    try {
        const user = (req as any).user;
        const webinar = await prisma.webinar.findUnique({
            where: { id: req.params.id },
        });

        if (!webinar) {
            return res.status(404).json({ error: 'Webinar not found' });
        }

        if (webinar.expertUserId !== user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const validated = createWebinarSchema.partial().parse(req.body);
        const updated = await prisma.webinar.update({
            where: { id: req.params.id },
            data: {
                ...validated,
                scheduledAt: validated.scheduledAt ? new Date(validated.scheduledAt) : undefined,
            },
        });

        res.json(updated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error updating webinar:', error);
        res.status(500).json({ error: 'Failed to update webinar' });
    }
});

/**
 * DELETE /api/webinars/:id
 * Delete webinar (expert owner only)
 */
router.delete('/:id', requireExpert, async (req, res) => {
    try {
        const user = (req as any).user;
        const webinar = await prisma.webinar.findUnique({
            where: { id: req.params.id },
        });

        if (!webinar) {
            return res.status(404).json({ error: 'Webinar not found' });
        }

        if (webinar.expertUserId !== user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await prisma.webinar.delete({
            where: { id: req.params.id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting webinar:', error);
        res.status(500).json({ error: 'Failed to delete webinar' });
    }
});

export default router;
