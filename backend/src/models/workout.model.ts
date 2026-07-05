import { supabase } from '../db/supabase.js';

export interface WorkoutSession {
  id: string;
  user_id: string;
  notes: string | null;
  performed_at: string;
  duration_minutes: number | null;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  reps: number;
  weight: number | null;
  rpe: number | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  // Joineado opcionalmente
  exercise_name?: string;
  exercise_type?: string;
}

export interface CreateWorkoutPayload {
  notes?: string;
  performed_at?: string;
  duration_minutes?: number;
  sets: {
    exercise_id: string;
    reps: number;
    weight?: number;
    rpe?: number;
    notes?: string;
    sort_order: number;
  }[];
}

const SESSIONS_TABLE = 'workout_sessions';
const SETS_TABLE = 'workout_sets';

const workoutModel = {
  async getAll(userId: string): Promise<WorkoutSession[]> {
    const { data, error } = await supabase
      .from(SESSIONS_TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('performed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<WorkoutSession | null> {
    const { data, error } = await supabase
      .from(SESSIONS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async create(userId: string, payload: CreateWorkoutPayload): Promise<{ session: WorkoutSession; sets: WorkoutSet[] }> {
    // 1. Crear la sesión
    const { data: session, error: sessionError } = await supabase
      .from(SESSIONS_TABLE)
      .insert({
        user_id: userId,
        notes: payload.notes || null,
        performed_at: payload.performed_at || new Date().toISOString().split('T')[0],
        duration_minutes: payload.duration_minutes || null,
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 2. Crear las series
    const setsWithSession = payload.sets.map((set) => ({
      session_id: session.id,
      exercise_id: set.exercise_id,
      reps: set.reps,
      weight: set.weight || null,
      rpe: set.rpe || null,
      notes: set.notes || null,
      sort_order: set.sort_order,
    }));

    const { data: sets, error: setsError } = await supabase
      .from(SETS_TABLE)
      .insert(setsWithSession)
      .select('*');

    if (setsError) throw setsError;

    return { session, sets: sets || [] };
  },

  async update(id: string, payload: { notes?: string; duration_minutes?: number }): Promise<WorkoutSession | null> {
    const { data, error } = await supabase
      .from(SESSIONS_TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(SESSIONS_TABLE)
      .delete()
      .eq('id', id);

    if (error) return false;
    return true;
  },

  async getSets(sessionId: string): Promise<WorkoutSet[]> {
    const { data, error } = await supabase
      .from(SETS_TABLE)
      .select(`
        *,
        exercise_name:exercises(name),
        exercise_type:exercises(type)
      `)
      .eq('session_id', sessionId)
      .order('sort_order');

    if (error) throw error;
    return (data || []).map((set: any) => ({
      ...set,
      exercise_name: set.exercise_name || undefined,
      exercise_type: set.exercise_type || undefined,
    }));
  },

  /**
   * Calcula la racha actual de entrenamiento (días consecutivos desde la última sesión hacia atrás)
   */
  async getStreak(userId: string): Promise<{ currentStreak: number; lastWorkoutDate: string | null }> {
    const { data, error } = await supabase
      .from(SESSIONS_TABLE)
      .select('performed_at')
      .eq('user_id', userId)
      .order('performed_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    if (!data || data.length === 0) {
      return { currentStreak: 0, lastWorkoutDate: null };
    }

    // Extraer fechas únicas ordenadas descendente
    const dates = [...new Set(data.map((s) => s.performed_at))].sort().reverse();

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    const lastDate = dates[0];
    const today = new Date().toISOString().split('T')[0];
    const diffToday = Math.round((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));

    // Si la última sesión no fue hoy ni ayer, la racha es 0
    if (diffToday > 1) {
      return { currentStreak: 0, lastWorkoutDate: lastDate };
    }

    return { currentStreak: streak, lastWorkoutDate: lastDate };
  },
};

export default workoutModel;
