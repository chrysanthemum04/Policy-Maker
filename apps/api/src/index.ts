import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from './utils/logger';

// New route imports
import authRoutes from './routes/auth.routes';
import simulationRoutes from './routes/simulations';
import policyDomainRoutes from './routes/policy-domains';
import webinarRoutes from './routes/webinars';
import postRoutes from './routes/posts';
import userRoutes from './routes/user.routes';
import expertRoutes from './routes/experts';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (Refactored)
app.use('/api/auth', authRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/policy-domains', policyDomainRoutes);
app.use('/api/webinars', webinarRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/experts', expertRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        error: {
            code: 'SERVER_ERROR',
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
        }
    });
});

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Policywave API running on port ${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔒 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export default app;
