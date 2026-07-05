import { Request, Response } from 'express';
import measurementModel from '../models/measurement.model.js';

function getUserId(req: Request): string {
  return (req as any).userId || '00000000-0000-0000-0000-000000000001';
}

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const measurements = await measurementModel.getAll(getUserId(req));
    res.status(200).json(measurements);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener medidas', error });
  }
};

export const getLatest = async (req: Request, res: Response): Promise<void> => {
  try {
    const measurement = await measurementModel.getLatest(getUserId(req));

    if (!measurement) {
      res.status(404).json({ message: 'No hay mediciones registradas' });
      return;
    }

    res.status(200).json(measurement);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener última medición', error });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const measurement = await measurementModel.create(getUserId(req), payload);
    res.status(201).json(measurement);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar medición', error });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const deleted = await measurementModel.remove(id);

    if (!deleted) {
      res.status(404).json({ message: 'Medición no encontrada' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar medición', error });
  }
};
