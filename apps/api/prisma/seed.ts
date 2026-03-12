
/**
 * Database Seed Script
 * Populates initial policy domains, users, experts, and community content
 */

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to get random item from array
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random subset of array
const randomSubset = <T>(arr: T[], max = 3): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * max) + 1);
};

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Policy Domains
    const domains = [
        { name: 'Taxation', slug: 'taxation', description: 'Income tax, GST, corporate tax, and other taxation policies' },
        { name: 'Healthcare', slug: 'healthcare', description: 'Universal healthcare, insurance, public health initiatives' },
        { name: 'Education', slug: 'education', description: 'School funding, higher education, scholarships, and educational reforms' },
        { name: 'Agriculture', slug: 'agriculture', description: 'Farm subsidies, MSP, agricultural reforms, and rural development' },
        { name: 'Employment', slug: 'employment', description: 'Labor laws, minimum wage, unemployment benefits, and worker rights' },
        { name: 'Housing', slug: 'housing', description: 'Affordable housing, rent control, property tax, and urban development' },
        { name: 'Environment', slug: 'environment', description: 'Climate policy, renewable energy, pollution control, and conservation' },
        { name: 'Transportation', slug: 'transportation', description: 'Public transit, infrastructure, vehicle regulations, and urban mobility' },
        { name: 'Social Welfare', slug: 'social-welfare', description: 'Pension schemes, disability benefits, food security, and social safety nets' },
        { name: 'Technology', slug: 'technology', description: 'Digital infrastructure, data privacy, cybersecurity, and tech regulation' },
    ];

    const createdDomains = [];
    for (const domain of domains) {
        const created = await prisma.policyDomain.upsert({
            where: { slug: domain.slug },
            update: {},
            create: domain,
        });
        createdDomains.push(created);

        // Ensure thread exists
        await prisma.discussionThread.upsert({
            where: { policyDomainId: created.id },
            update: {},
            create: { policyDomainId: created.id },
        });
        console.log(`✅ Policy Domain: ${domain.name}`);
    }

    // 2. Create Users (Citizens & Experts)
    const userRoles: UserRole[] = ['citizen', 'citizen', 'citizen', 'expert', 'government'];
    const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anika', 'Navya', 'Myra', 'Riya', 'Aarya'];
    const lastNames = ['Patel', 'Sharma', 'Singh', 'Kumar', 'Das', 'Gupta', 'Verma', 'Rao', 'Nair', 'Reddy', 'Chopra', 'Malhotra', 'Kapoor', 'Joshi', 'Mehta', 'Agarwal', 'Iyer', 'Chatterjee', 'Sen', 'Dutta'];
    const professions = ['Software Engineer', 'Teacher', 'Doctor', 'Farmer', 'Student', 'Lawyer', 'Accountant', 'Business Owner', 'Activist', 'Researcher'];

    const users = [];
    console.log('Creating users...');

    // Create specific demo users if they don't exist
    const demoUsers = [
        { email: 'bgates@example.com', name: 'Bill Gates', role: 'expert', bio: 'Co-chair of the Bill & Melinda Gates Foundation. Focused on climate change, health, and education.' },
        { email: 'citizen@policywave.com', name: 'Riya Sharma', role: 'citizen', bio: 'A concerned citizen deeply interested in urban planning and education reform.' },
        { email: 'gov@policywave.com', name: 'Vikram Singh', role: 'government', bio: 'Senior Policy Analyst at Ministry of Finance.' },
    ];

    // Valid bcrypt hash for "password123"
    const passwordHash = '$2a$10$.3tOhNGfm6uqnqN.Kc1ck.CES5EX0ioOvh6XffZ5E0CeNGYwVD8pq';

    for (const u of demoUsers) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                passwordHash: passwordHash,
            },
            create: {
                email: u.email,
                fullName: u.name,
                passwordHash: passwordHash,
                role: u.role as UserRole,
                accountStatus: 'active',
            }
        });
        users.push(user);

        if (u.role === 'expert') {
            await prisma.expertProfile.upsert({
                where: { userId: user.id },
                update: {},
                create: {
                    userId: user.id,
                    bio: u.bio,
                    expertiseTags: ['Technology', 'Environment', 'Healthcare'],
                    verificationStatus: true,
                }
            });
        } else {
            // For citizen and govt users (Govt profile structure if adding later, currently treating as base user or citizen profile)
            // But wait, schema says govt doesn't enforce profile? Or citizen profile?
            // Controller creates expertProfile OR citizenProfile. Govt might have neither or citizen?
            // Current schema allows User without profile? Yes. 
            // Previous seed logic made citizen profile for "else". 
            // "gov" role falls into "else" here? No, check if/else below.

            if (u.role === 'citizen') {
                await prisma.citizenProfile.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: {
                        userId: user.id,
                        locationRegion: 'Mumbai',
                        occupationCategory: 'Professional',
                        policyInterestTags: ['Education', 'Housing'],
                    }
                });
            }
        }
    }


    for (let i = 0; i < 50; i++) {
        const firstName = random(firstNames);
        const lastName = random(lastNames);
        const role = random(userRoles);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

        try {
            const user = await prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    fullName: `${firstName} ${lastName}`,
                    passwordHash: passwordHash, // Use valid hash
                    role: role,
                    accountStatus: 'active',
                },
            });
            users.push(user);

            if (role === 'expert') {
                await prisma.expertProfile.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: {
                        userId: user.id,
                        bio: `Experienced ${random(professions)} with over 10 years of field work. Passionate about policy reform in ${random(domains).name}.`,
                        expertiseTags: randomSubset(domains.map(d => d.name)),
                        verificationStatus: Math.random() > 0.3, // 70% verified
                    },
                });
            } else if (role === 'citizen') {
                await prisma.citizenProfile.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: {
                        userId: user.id,
                        locationRegion: random(['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata']),
                        occupationCategory: random(professions),
                        policyInterestTags: randomSubset(domains.map(d => d.name)),
                    },
                });
            }
        } catch (e) {
            // Ignore duplicate emails or collisions
        }
    }
    console.log(`✅ Created ~${users.length} users`);

    // 3. Create Community Discussions
    const sampleTitles = [
        "Why we need better tax reforms now",
        "The state of public healthcare in 2026",
        "Education policy: Are we doing enough?",
        "Sustainable farming practices for the future",
        "Remote work and labor laws",
        "Addressing the housing crisis in metro cities",
        "Electric vehicles: Infrastructure challenges",
        "Universal Basic Income: A feasibility study",
        "Data privacy bill: What you need to know",
        "Cleaning up our rivers: A policy roadmap",
    ];

    const sampleContent = [
        "I've been analyzing the recent budget proposals and I think there's a significant gap in how we address...",
        "Looking at the data from the last 5 years, it's clear that we need to shift our focus towards...",
        "Many experts agree that the current approach is unsustainable. We need to consider alternative models such as...",
        "Recent events have highlighted the importance of robust infrastructure. My proposal focuses on...",
        "As a professional in this field, I've seen firsthand the impact of these policies. We need to change...",
    ];

    console.log('Creating posts...');
    const allPosts = [];

    for (let i = 0; i < 100; i++) {
        const author = random(users);
        const domain = random(createdDomains); // Random hub
        const title = random(sampleTitles);
        const content = random(sampleContent) + " " + random(sampleContent); // Make it a bit longer

        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                excerpt: content.substring(0, 150) + '...',
                userId: author.id,
                hubId: domain.id,
                status: 'published',
                tags: randomSubset(['policy', 'reform', 'discussion', 'analysis', 'opinion']),
                upvoteCount: Math.floor(Math.random() * 100),
                commentCount: 0, // Will update based on created comments
            },
        });
        allPosts.push(post);

        // Add some comments
        const numComments = Math.floor(Math.random() * 5);
        for (let j = 0; j < numComments; j++) {
            const commenter = random(users);
            await prisma.comment.create({
                data: {
                    content: "This is a very insightful point. I agree with the author.",
                    userId: commenter.id,
                    postId: post.id,
                }
            });
        }

        // Update comment count
        if (numComments > 0) {
            await prisma.post.update({
                where: { id: post.id },
                data: { commentCount: numComments }
            });
        }
    }
    console.log(`✅ Created ${allPosts.length} posts with comments`);

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
