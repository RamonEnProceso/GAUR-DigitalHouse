import { supabase } from '../db/supabase.js';

export interface User {
  id: string;
  nombre: string;
  edad: number | null;
  cumpleaños: string | null;
  altura: number | null;
  peso_actual: number | null;
  descripcion: string | null;
  futuro_ideal: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserUpdatePayload {
  nombre?: string;
  edad?: number;
  cumpleaños?: string;
  altura?: number;
  peso_actual?: number;
  descripcion?: string;
  futuro_ideal?: string;
}

const TABLE = 'users';

const userModel = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async update(id: string, payload: UserUpdatePayload): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Crea un usuario o actualiza si ya existe (upsert por id).
   * Útil para auto-registro desde Google Auth.
   */
  async upsert(id: string, payload: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(
        { id, ...payload, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export default userModel;
