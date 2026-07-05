import { api } from './client';
import type { AiConfig, AiConfigPayload } from '../types';

export const getAiConfig = () => api.get<AiConfig>('/ai-config');
export const saveAiConfig = (payload: AiConfigPayload) => api.put<AiConfig>('/ai-config', payload);
export const deleteAiConfig = () => api.delete<void>('/ai-config');
