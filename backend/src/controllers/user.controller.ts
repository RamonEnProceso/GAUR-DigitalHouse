import { Request, Response } from 'express';
import userModel from '../models/user.model.js';

function getUserId(req: Request): string {
  return (req as any).userId || '00000000-0000-0000-0000-000000000001';
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    let user = await userModel.getById(userId);
    if (!user) {
      // Auto-crear si no existe (primer ingreso después de auth)
      user = await userModel.upsert(userId, { nombre: 'Usuario' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const payload = req.body;
    let updatedUser = await userModel.update(userId, payload);
    if (!updatedUser) {
      // Si no existe, crearlo automáticamente con los datos recibidos
      updatedUser = await userModel.upsert(userId, payload);
    }
    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('❌ Error al actualizar perfil:', error?.message || error);
    res.status(500).json({ message: `Error al actualizar perfil: ${error?.message || String(error)}`, error: error?.message || String(error) });
  }
};
