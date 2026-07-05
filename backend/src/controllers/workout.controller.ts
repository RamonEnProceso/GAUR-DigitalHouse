import { Request, Response } from 'express';
import workoutModel from '../models/workout.model.js';

function getUserId(req: Request): string {
  return (req as any).userId || '00000000-0000-0000-0000-000000000001';
}

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await workoutModel.getAll(getUserId(req));
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sesiones', error });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const session = await workoutModel.getById(id);

    if (!session) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    const sets = await workoutModel.getSets(id as string);
    res.status(200).json({ ...session, sets });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sesión', error });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;

    if (!payload.sets || !Array.isArray(payload.sets) || payload.sets.length === 0) {
      res.status(400).json({ message: 'La sesión debe incluir al menos una serie' });
      return;
    }

    const result = await workoutModel.create(getUserId(req), payload);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear sesión', error });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { notes, duration_minutes } = req.body;

    const updatedSession = await workoutModel.update(id, { notes, duration_minutes });
    if (!updatedSession) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar sesión', error });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const deleted = await workoutModel.remove(id);

    if (!deleted) {
      res.status(404).json({ message: 'Sesión no encontrada' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar sesión', error });
  }
};

export const getStreak = async (req: Request, res: Response): Promise<void> => {
  try {
    const streak = await workoutModel.getStreak(getUserId(req));
    res.status(200).json(streak);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener racha', error });
  }
};
