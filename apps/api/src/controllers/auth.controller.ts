import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/db';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(2),
    role: z.enum(['government', 'citizen', 'expert']),
    // Optional profile fields
    bio: z.string().optional(),
    expertiseTags: z.array(z.string()).optional(),
    locationRegion: z.string().optional(),
    occupationCategory: z.string().optional(),
    policyInterestTags: z.array(z.string()).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, role } = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Email already registered',
                    details: { field: 'email', reason: 'unique_constraint' }
                }
            });
        }

        // Create user with role
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                role,
                // Create role-specific profile
                ...(role === 'citizen' && {
                    citizenProfile: {
                        create: {
                            locationRegion: req.body.locationRegion,
                            occupationCategory: req.body.occupationCategory,
                            policyInterestTags: req.body.policyInterestTags || [],
                        }
                    }
                }),
                ...(role === 'expert' && {
                    expertProfile: {
                        create: {
                            bio: req.body.bio,
                            expertiseTags: req.body.expertiseTags || [],
                            verificationStatus: false // Default to unverified
                        }
                    }
                })
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true
            }
        });

        // Generate token with role
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        logger.info(`New user registered: ${user.email} (${user.role})`);

        res.status(201).json({
            user,
            token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid input',
                    details: error.errors
                }
            });
        }

        logger.error('Registration error:', error);
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Registration failed'
            }
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                error: {
                    code: 'AUTHENTICATION_FAILED',
                    message: 'Invalid email or password'
                }
            });
        }

        // Check account status
        if (user.accountStatus !== 'active') {
            return res.status(403).json({
                error: {
                    code: 'ACCOUNT_SUSPENDED',
                    message: 'Account is not active'
                }
            });
        }

        // Verify password
        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({
                error: {
                    code: 'AUTHENTICATION_FAILED',
                    message: 'Invalid email or password'
                }
            });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        // Generate token with role
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        logger.info(`User logged in: ${user.email} (${user.role})`);

        res.json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            },
            token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid input',
                    details: error.errors
                }
            });
        }

        logger.error('Login error:', error);
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Login failed'
            }
        });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    code: 'AUTHENTICATION_REQUIRED',
                    message: 'Not authenticated'
                }
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                accountStatus: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        res.json({ user });
    } catch (error) {
        logger.error('Get user error:', error);
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to get user'
            }
        });
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    // For JWT, logout is handled client-side by removing the token
    // This endpoint exists for consistency and future enhancements (e.g., token blacklisting)
    res.json({ message: 'Logged out successfully' });
};
