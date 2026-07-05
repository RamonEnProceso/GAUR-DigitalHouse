import { supabase } from '../db/supabase.js';

export interface InactivityStatus {
  inactive: boolean;
  daysSinceLastWorkout: number;
  lastWorkoutDate: string | null;
}

const SESSIONS_TABLE = 'workout_sessions';

/**
 * Verifica si el usuario lleva 3 o más días sin registrar entrenamiento.
 * La regla de negocio: 3 días consecutivos de inactividad = alerta.
 */
export async function checkInactivity(userId: string): Promise<InactivityStatus> {
  const { data, error } = await supabase
    .from(SESSIONS_TABLE)
    .select('performed_at')
    .eq('user_id', userId)
    .order('performed_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) {
    // Usuario sin sesiones nunca registradas → no se considera inactivo
    return {
      inactive: false,
      daysSinceLastWorkout: 0,
      lastWorkoutDate: null,
    };
  }

  const lastDate = new Date(data[0].performed_at);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - lastDate.getTime();
  const daysSinceLastWorkout = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    inactive: daysSinceLastWorkout >= 3,
    daysSinceLastWorkout,
    lastWorkoutDate: data[0].performed_at,
  };
}
