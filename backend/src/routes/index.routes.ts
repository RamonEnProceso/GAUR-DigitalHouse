import { Router } from 'express';
import userRoutes from './user.routes.js';
import exerciseRoutes from './exercise.routes.js';
import workoutRoutes from './workout.routes.js';
import measurementRoutes from './measurement.routes.js';
import aiConfigRoutes from './ai-config.routes.js';
import routineRoutes from './routine.routes.js';
import inactivityRoutes from './inactivity.routes.js';

const router = Router();

// Rutas de la API (todas protegidas por authMiddleware en app.ts)
router.use('/users', userRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/workouts', workoutRoutes);
router.use('/measurements', measurementRoutes);
router.use('/ai-config', aiConfigRoutes);
router.use('/routines', routineRoutes);
router.use('/inactivity', inactivityRoutes);

export default router;
