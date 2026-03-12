/**
 * Role-Based Access Control Middleware
 * Enforces role-based permissions on API endpoints
 */

import { Request, Response, NextFunction } from 'express';

export enum UserRole {
    GOVERNMENT = 'government',
    CITIZEN = 'citizen',
    EXPERT = 'expert',
}

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: UserRole;
    };
}

/**
 * Middleware to require specific roles
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: allowedRoles,
                current: req.user.role,
            });
        }

        next();
    };
};

/**
 * Middleware to require government role
 */
export const requireGovernment = requireRole(UserRole.GOVERNMENT);

/**
 * Middleware to require expert role
 */
export const requireExpert = requireRole(UserRole.EXPERT);

/**
 * Middleware to require citizen role
 */
export const requireCitizen = requireRole(UserRole.CITIZEN);

/**
 * Middleware to allow any authenticated user
 */
export const requireAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};
