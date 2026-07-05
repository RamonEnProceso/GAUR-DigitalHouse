import { api } from './client';
import type { User, UserUpdatePayload } from '../types';

export const getProfile = () => api.get<User>('/users');
export const updateProfile = (payload: UserUpdatePayload) => api.put<User>('/users', payload);
