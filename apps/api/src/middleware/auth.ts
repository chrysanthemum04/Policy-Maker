import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: {
                    code: 'AUTHENTICATION_REQUIRED',
                    message: 'No token provided'
                }
            });
        }

        const token = authHeader.substring(7);
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            logger.error('JWT_SECRET not configured');
            return res.status(500).json({
                error: {
                    code: 'SERVER_ERROR',
                    message: 'Authentication not configured'
                }
            });
        }

        const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid or expired token'
                }
            });
        }

        logger.error('Authentication error:', error);
        return res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Authentication failed'
            }
        });
    }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const secret = process.env.JWT_SECRET;

            if (secret) {
                const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
                req.user = decoded;
            }
        }

        next();
    } catch (error) {
        // Silently fail for optional auth
        next();
    }
};
