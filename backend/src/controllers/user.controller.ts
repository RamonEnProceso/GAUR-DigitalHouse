import { Request, Response } from 'express';
import UserModel, { UserCreatePayload, UserUpdatePayload } from '../models/user.model.js';

const userModel = new UserModel();
const HARD_CODED_USER_ID = 'user-123';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const users = await userModel.getAllByUserId(HARD_CODED_USER_ID);
  res.status(200).json(users);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await userModel.getById(HARD_CODED_USER_ID, id);

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }

  res.status(200).json(user);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as UserCreatePayload;
  const newUser = await userModel.create(HARD_CODED_USER_ID, payload);
  res.status(201).json(newUser);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const payload = req.body as UserUpdatePayload;

  const updatedUser = await userModel.update(HARD_CODED_USER_ID, id, payload);
  if (!updatedUser) {
    res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
    return;
  }

  res.status(200).json(updatedUser);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const deleted = await userModel.remove(HARD_CODED_USER_ID, id);

  if (!deleted) {
    res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
    return;
  }

  res.status(204).send();
};
