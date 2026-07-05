import { Request, Response } from 'express';
import { checkInactivity } from '../services/inactivity.service.js';

function getUserId(req: Request): string {
  return (req as any).userId || '00000000-0000-0000-0000-000000000001';
}

export const check = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = await checkInactivity(getUserId(req));
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar inactividad', error });
  }
};
