/**
 * Simulation API Routes
 * Handles policy simulation creation and retrieval
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuthenticated } from '../middleware/rbac';
import { authenticate } from '../middleware/auth';
import { PolicyAgent, SimulationMode, UserRole as AgentRole } from '../lib/ai/policyAgent';

const router = Router();
const prisma = new PrismaClient();
const policyAgent = new PolicyAgent();

// Validation schemas
const createSimulationSchema = z.object({
    mode: z.enum(['simulation', 'explanation']),
    policyDomainId: z.string().uuid(),
    userInput: z.string().min(10).max(2000),
    parameters: z.record(z.any()).optional(),
});

/**
 * POST /api/simulations
 * Create a new policy simulation
 */
// POST /api/simulations
router.post('/', authenticate, requireAuthenticated, async (req, res) => {
    console.log('--- Simulation Request Received ---');
    try {
        const user = (req as any).user;
        console.log('User:', user);

        const validated = createSimulationSchema.parse(req.body);
        console.log('Validated Input:', validated);

        // Get policy domain
        const policyDomain = await prisma.policyDomain.findUnique({
            where: { id: validated.policyDomainId },
        });

        if (!policyDomain) {
            console.error('Policy domain not found:', validated.policyDomainId);
            return res.status(404).json({ error: 'Policy domain not found' });
        }

        // Map user role to agent role
        const roleMap: Record<string, AgentRole> = {
            government: AgentRole.GOVERNMENT,
            citizen: AgentRole.CITIZEN,
            expert: AgentRole.EXPERT,
        };

        // Run AI simulation
        console.log('Running AI Simulation...');
        const aiOutput = await policyAgent.runSimulation({
            mode: validated.mode as SimulationMode,
            userRole: roleMap[user.role],
            policyDomain: policyDomain.name,
            userInput: validated.userInput,
            userId: user.id,
            parameters: validated.parameters,
        });
        console.log('AI Output received');

        // Store simulation immutably
        // CRITICAL FIX: user.userId was undefined. It matches token payload which has .id
        console.log('Saving to database...');
        const simulation = await prisma.simulation.create({
            data: {
                userId: user.id, // Fixed from user.userId
                roleContext: user.role,
                policyDomainId: validated.policyDomainId,
                inputParameters: {
                    mode: validated.mode,
                    userInput: validated.userInput,
                    parameters: validated.parameters || {},
                },
                assumptions: aiOutput.detailedAnalysis.assumptions,
                aiOutput: aiOutput as any, // Cast to any to satisfy Prisma Json
                confidenceLevel: aiOutput.confidenceLevel,
            },
        });
        console.log('Simulation saved:', simulation.id);

        res.status(201).json({
            id: simulation.id,
            output: aiOutput,
            createdAt: simulation.createdAt,
        });
    } catch (error: any) {
        console.error('Simulation FAILED:', error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }

        // Return explicit error message to frontend
        res.status(500).json({ error: error.message || 'Failed to create simulation' });
    }
});

/**
 * GET /api/simulations
 * Get user's simulation history
 */
router.get('/', requireAuthenticated, async (req, res) => {
    try {
        const user = (req as any).user;
        const { limit = '20', offset = '0', policyDomainId } = req.query;

        const where: any = { userId: user.userId };
        if (policyDomainId) {
            where.policyDomainId = policyDomainId as string;
        }

        const [simulations, total] = await Promise.all([
            prisma.simulation.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit as string),
                skip: parseInt(offset as string),
                include: {
                    policyDomain: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            }),
            prisma.simulation.count({ where }),
        ]);

        res.json({
            simulations: simulations.map(s => ({
                id: s.id,
                policyDomain: s.policyDomain,
                confidenceLevel: s.confidenceLevel,
                createdAt: s.createdAt,
                // Don't send full AI output in list view
                summary: (s.aiOutput as any).briefSummary,
            })),
            pagination: {
                total,
                limit: parseInt(limit as string),
                offset: parseInt(offset as string),
            },
        });
    } catch (error) {
        console.error('Error fetching simulations:', error);
        res.status(500).json({ error: 'Failed to fetch simulations' });
    }
});

/**
 * GET /api/simulations/:id
 * Get single simulation details
 */
router.get('/:id', requireAuthenticated, async (req, res) => {
    try {
        const user = (req as any).user;
        const simulation = await prisma.simulation.findUnique({
            where: { id: req.params.id },
            include: {
                policyDomain: true,
            },
        });

        if (!simulation) {
            return res.status(404).json({ error: 'Simulation not found' });
        }

        // Verify ownership (simulations are private)
        if (simulation.userId !== user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({
            id: simulation.id,
            policyDomain: simulation.policyDomain,
            inputParameters: simulation.inputParameters,
            assumptions: simulation.assumptions,
            output: simulation.aiOutput,
            confidenceLevel: simulation.confidenceLevel,
            createdAt: simulation.createdAt,
        });
    } catch (error) {
        console.error('Error fetching simulation:', error);
        res.status(500).json({ error: 'Failed to fetch simulation' });
    }
});

export default router;
