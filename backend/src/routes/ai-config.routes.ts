import { Router } from 'express';
import { getConfig, saveConfig, removeConfig } from '../controllers/ai-config.controller.js';

const router = Router();

router.get('/', getConfig);
router.put('/', saveConfig);
router.delete('/', removeConfig);

export default router;
