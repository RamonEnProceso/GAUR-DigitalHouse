import { api } from './client';
import type { Routine, AiGenerateRequest } from '../types';

export const getRoutines = () => api.get<Routine[]>('/routines');
export const getActiveRoutine = () => api.get<Routine | null>('/routines/active');
export const generateRoutine = (payload: AiGenerateRequest) =>
  api.post<Routine>('/routines/generate', payload);
export const activateRoutine = (id: string) =>
  api.patch<void>(`/routines/${id}/activate`);
