import { Request, Response } from 'express';
import exerciseModel from '../models/exercise.model.js';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, difficulty, muscle, search } = req.query;
    const filters = {
      ...(type && { type: type as string }),
      ...(difficulty && { difficulty: difficulty as string }),
      ...(muscle && { muscle: muscle as string }),
      ...(search && { search: search as string }),
    };

    const exercises = await exerciseModel.getAll(
      Object.keys(filters).length > 0 ? filters : undefined
    );
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ejercicios', error });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const exercise = await exerciseModel.getById(id);

    if (!exercise) {
      res.status(404).json({ message: 'Ejercicio no encontrado' });
      return;
    }

    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ejercicio', error });
  }
};
