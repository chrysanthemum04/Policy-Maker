import { Router } from 'express';

const router = Router();

// TODO: Implement hub routes
router.get('/', (req, res) => res.json({ message: 'Hub routes - Coming soon' }));

export default router;
