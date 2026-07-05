import { api } from './client';
import type { Exercise, ExerciseFilters } from '../types';

export const getExercises = (filters?: ExerciseFilters) => {
  const params = new URLSearchParams();
  if (filters?.type) params.set('type', filters.type);
  if (filters?.difficulty) params.set('difficulty', filters.difficulty);
  if (filters?.muscle) params.set('muscle', filters.muscle);
  if (filters?.search) params.set('search', filters.search);
  const query = params.toString();
  return api.get<Exercise[]>(`/exercises${query ? `?${query}` : ''}`);
};

export const getExerciseById = (id: string) => api.get<Exercise>(`/exercises/${id}`);
