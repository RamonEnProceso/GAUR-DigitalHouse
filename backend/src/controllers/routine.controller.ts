import { Request, Response } from 'express';
import routineModel from '../models/routine.model.js';
import { generateRoutine, AiGenerateRequest } from '../services/ai-routine.service.js';

function getUserId(req: Request): string {
  return (req as any).userId || '00000000-0000-0000-0000-000000000001';
}

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const routines = await routineModel.getAll(getUserId(req));
    res.status(200).json(routines);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rutinas', error });
  }
};

export const getActive = async (req: Request, res: Response): Promise<void> => {
  try {
    const routine = await routineModel.getActive(getUserId(req));

    if (!routine) {
      res.status(200).json(null);
      return;
    }

    const exercises = await routineModel.getExercises(routine.id);
    res.status(200).json({ ...routine, exercises });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rutina activa', error });
  }
};

export const generate = async (req: Request, res: Response): Promise<void> => {
  try {
    const request: AiGenerateRequest = {
      goals: req.body.goals,
      equipment: req.body.equipment,
      days_per_week: req.body.days_per_week,
      focus: req.body.focus,
    };

    const routine = await generateRoutine(getUserId(req), request);
    res.status(201).json(routine);
  } catch (error: any) {
    const message = error.message || 'Error al generar rutina con IA';

    if (message.includes('No hay configuración de IA')) {
      res.status(400).json({ message });
      return;
    }

    if (message.includes('JSON válido')) {
      res.status(502).json({ message });
      return;
    }

    res.status(500).json({ message: 'Error al generar rutina', error: message });
  }
};

export const activate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const success = await routineModel.activate(id, getUserId(req));

    if (!success) {
      res.status(404).json({ message: 'Rutina no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Rutina activada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al activar rutina', error });
  }
};

export const getExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const exercises = await routineModel.getExercises(id);
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ejercicios de la rutina', error });
  }
};
