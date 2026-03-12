import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all hubs
router.get('/', async (req, res) => {
    try {
        const hubs = await prisma.hub.findMany({
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
            orderBy: {
                posts: {
                    _count: 'desc',
                },
            },
        });

        res.json(
            hubs.map(hub => ({
                ...hub,
                memberCount: hub._count.posts * 10, // Approximate members
            }))
        );
    } catch (error) {
        console.error('Error fetching hubs:', error);
        res.status(500).json({ error: 'Failed to fetch hubs' });
    }
});

// Get single hub
router.get('/:id', async (req, res) => {
    try {
        const hub = await prisma.hub.findUnique({
            where: { id: req.params.id },
            include: {
                posts: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        if (!hub) {
            return res.status(404).json({ error: 'Hub not found' });
        }

        res.json(hub);
    } catch (error) {
        console.error('Error fetching hub:', error);
        res.status(500).json({ error: 'Failed to fetch hub' });
    }
});

export default router;
