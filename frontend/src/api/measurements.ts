import { api } from './client';
import type { BodyMeasurement, CreateMeasurementPayload } from '../types';

export const getMeasurements = () => api.get<BodyMeasurement[]>('/measurements');
export const getLatestMeasurement = () => api.get<BodyMeasurement>('/measurements/latest');
export const createMeasurement = (payload: CreateMeasurementPayload) =>
  api.post<BodyMeasurement>('/measurements', payload);
export const deleteMeasurement = (id: string) => api.delete<void>(`/measurements/${id}`);
