import { Router } from 'express';
import { getAll, getLatest, create, remove } from '../controllers/measurement.controller.js';

const router = Router();

router.get('/', getAll);
router.get('/latest', getLatest);
router.post('/', create);
router.delete('/:id', remove);

export default router;
