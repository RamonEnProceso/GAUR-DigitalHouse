import { Router, Request, Response } from 'express';
import userRoutes from './user.routes.js';

const router = Router();

// Health check
router.get(
  '/health',
  async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      status: 'ok'
    });
  }
);

// User routes (userId hardcoded to 'user-123' in controller)
router.use('/users', userRoutes);

export default router;