import { Router } from 'express';
import { getAll, getById, create, update, remove, getStreak } from '../controllers/workout.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/streak', getStreak);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
