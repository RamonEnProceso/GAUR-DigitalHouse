import { Router } from 'express';
import { check } from '../controllers/inactivity.controller.js';

const router = Router();

router.get('/check', check);

export default router;
