import { Router, Request, Response } from 'express';

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

export default router;