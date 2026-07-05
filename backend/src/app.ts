import express, { Request, Response } from 'express';
import cors from 'cors';

import indexRoutes from './routes/index.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Health check público (sin auth)
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Middleware de autenticación para el resto de rutas
app.use('/api', authMiddleware);

// Rutas protegidas (requieren token)
app.use('/api', indexRoutes);

export default app;