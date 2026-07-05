import { Request, Response } from 'express';
import aiConfigModel from '../models/ai-config.model.js';

function getUserId(req: Request): string {
  return (req as any).userId || '00000000-0000-0000-0000-000000000001';
}

export const getConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = await aiConfigModel.getPublic(getUserId(req));

    if (!config) {
      res.status(200).json({ has_key: false });
      return;
    }

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener configuración de IA', error });
  }
};

export const saveConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider, api_key, model } = req.body;

    if (!api_key) {
      res.status(400).json({ message: 'api_key es requerida' });
      return;
    }

    const config = await aiConfigModel.upsert(getUserId(req), {
      provider: provider || 'openai',
      api_key,
      model: model || 'gpt-4o-mini',
    });

    res.status(200).json({
      id: config.id,
      user_id: config.user_id,
      provider: config.provider,
      model: config.model,
      has_key: true,
      updated_at: config.updated_at,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar configuración de IA', error });
  }
};

export const removeConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await aiConfigModel.remove(getUserId(req));

    if (!deleted) {
      res.status(404).json({ message: 'No hay configuración para eliminar' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar configuración de IA', error });
  }
};
