
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Fetching posts...');
        const posts = await prisma.post.findMany({
            take: 10,
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
            orderBy: {
                upvoteCount: 'desc', // Check if this field works
            },
        });
        console.log('Posts fetched:', posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
