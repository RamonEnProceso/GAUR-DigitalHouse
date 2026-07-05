import { api } from './client';
import type { WorkoutSession, CreateWorkoutPayload, StreakInfo } from '../types';

export const getWorkouts = () => api.get<WorkoutSession[]>('/workouts');
export const getWorkoutById = (id: string) => api.get<WorkoutSession>(`/workouts/${id}`);
export const createWorkout = (payload: CreateWorkoutPayload) =>
  api.post<{ session: WorkoutSession; sets: any[] }>('/workouts', payload);
export const updateWorkout = (id: string, payload: { notes?: string; duration_minutes?: number }) =>
  api.put<WorkoutSession>(`/workouts/${id}`, payload);
export const deleteWorkout = (id: string) => api.delete<void>(`/workouts/${id}`);
export const getStreak = () => api.get<StreakInfo>('/workouts/streak');
