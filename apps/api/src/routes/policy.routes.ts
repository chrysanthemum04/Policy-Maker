import { Router } from 'express';

const router = Router();

// TODO: Implement policy routes
router.get('/', (req, res) => res.json({ message: 'Policy routes - Coming soon' }));

export default router;
