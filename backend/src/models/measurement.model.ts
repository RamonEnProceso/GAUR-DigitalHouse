import { supabase } from '../db/supabase.js';

export interface BodyMeasurement {
  id: string;
  user_id: string;
  weight: number | null;
  waist: number | null;
  chest: number | null;
  left_arm: number | null;
  right_arm: number | null;
  left_thigh: number | null;
  right_thigh: number | null;
  neck: number | null;
  photo_url: string | null;
  notes: string | null;
  measured_at: string;
  created_at: string;
}

export interface CreateMeasurementPayload {
  weight?: number;
  waist?: number;
  chest?: number;
  left_arm?: number;
  right_arm?: number;
  left_thigh?: number;
  right_thigh?: number;
  neck?: number;
  photo_url?: string;
  notes?: string;
  measured_at?: string;
}

const TABLE = 'body_measurements';

const measurementModel = {
  async getAll(userId: string): Promise<BodyMeasurement[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('measured_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getLatest(userId: string): Promise<BodyMeasurement | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('measured_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return (data && data.length > 0) ? data[0] : null;
  },

  async create(userId: string, payload: CreateMeasurementPayload): Promise<BodyMeasurement> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        user_id: userId,
        ...payload,
        measured_at: payload.measured_at || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) return false;
    return true;
  },
};

export default measurementModel;
