import { api } from './client';
import type { InactivityStatus } from '../types';

export const checkInactivity = () => api.get<InactivityStatus>('/inactivity/check');
