
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all experts
router.get('/', async (req, res) => {
    try {
        const { search, tag } = req.query;

        const where: any = {
            role: 'expert',
            accountStatus: 'active',
        };

        if (search) {
            where.fullName = {
                contains: search as string,
                mode: 'insensitive',
            };
        }

        if (tag) {
            where.expertProfile = {
                expertiseTags: {
                    has: tag as string,
                },
            };
        }

        const experts = await prisma.user.findMany({
            where,
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                expertProfile: {
                    select: {
                        bio: true,
                        expertiseTags: true,
                        verificationStatus: true,
                    },
                },
            },
        });

        const formattedExperts = experts.map(expert => ({
            id: expert.id,
            name: expert.fullName,
            email: expert.email,
            role: expert.role,
            bio: expert.expertProfile?.bio || '',
            tags: expert.expertProfile?.expertiseTags || [],
            isVerified: expert.expertProfile?.verificationStatus || false,
        }));

        res.json(formattedExperts);
    } catch (error) {
        console.error('Error fetching experts:', error);
        res.status(500).json({ error: 'Failed to fetch experts' });
    }
});

export default router;
