import { Router } from 'express';
import { getAll, getActive, generate, activate, getExercises } from '../controllers/routine.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/active', getActive);
router.post('/generate', generate);
router.patch('/:id/activate', activate);
router.get('/:id/exercises', getExercises);

export default router;
