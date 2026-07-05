import { supabase } from '../db/supabase.js';

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  days_per_week: number;
  is_active: boolean;
  generated_at: string;
}

export interface RoutineExercise {
  id: string;
  routine_id: string;
  exercise_id: string;
  day_number: number;
  target_sets: number;
  target_reps_min: number | null;
  target_reps_max: number | null;
  sort_order: number;
  // Joineado
  exercise_name?: string;
  exercise_type?: string;
}

const ROUTINES_TABLE = 'routines';
const ROUTINE_EXERCISES_TABLE = 'routine_exercises';

const routineModel = {
  async getAll(userId: string): Promise<Routine[]> {
    const { data, error } = await supabase
      .from(ROUTINES_TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Routine | null> {
    const { data, error } = await supabase
      .from(ROUTINES_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async getActive(userId: string): Promise<Routine | null> {
    const { data, error } = await supabase
      .from(ROUTINES_TABLE)
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data;
  },

  async createRoutine(userId: string, routine: {
    name: string;
    description?: string;
    days_per_week: number;
    is_active?: boolean;
    exercises: {
      exercise_id: string;
      day_number: number;
      target_sets: number;
      target_reps_min?: number;
      target_reps_max?: number;
      sort_order: number;
    }[];
  }): Promise<Routine> {
    // 1. Insertar rutina
    const { data: newRoutine, error: routineError } = await supabase
      .from(ROUTINES_TABLE)
      .insert({
        user_id: userId,
        name: routine.name,
        description: routine.description || null,
        days_per_week: routine.days_per_week,
        is_active: routine.is_active !== undefined ? routine.is_active : true,
      })
      .select()
      .single();

    if (routineError) throw routineError;

    // 2. Insertar ejercicios de la rutina
    const exercisesToInsert = routine.exercises.map((ex) => ({
      routine_id: newRoutine.id,
      exercise_id: ex.exercise_id,
      day_number: ex.day_number,
      target_sets: ex.target_sets,
      target_reps_min: ex.target_reps_min || null,
      target_reps_max: ex.target_reps_max || null,
      sort_order: ex.sort_order,
    }));

    const { error: exercisesError } = await supabase
      .from(ROUTINE_EXERCISES_TABLE)
      .insert(exercisesToInsert);

    if (exercisesError) throw exercisesError;

    return newRoutine;
  },

  async activate(id: string, userId: string): Promise<boolean> {
    // Desactivar todas las rutinas del usuario
    await supabase
      .from(ROUTINES_TABLE)
      .update({ is_active: false })
      .eq('user_id', userId);

    // Activar la seleccionada
    const { error } = await supabase
      .from(ROUTINES_TABLE)
      .update({ is_active: true })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return false;
    return true;
  },

  async getExercises(routineId: string): Promise<RoutineExercise[]> {
    const { data, error } = await supabase
      .from(ROUTINE_EXERCISES_TABLE)
      .select(`
        *,
        exercise_name:exercises(name),
        exercise_type:exercises(type)
      `)
      .eq('routine_id', routineId)
      .order('day_number')
      .order('sort_order');

    if (error) throw error;
    return (data || []).map((ex: any) => ({
      ...ex,
      exercise_name: ex.exercise_name || undefined,
      exercise_type: ex.exercise_type || undefined,
    }));
  },
};

export default routineModel;
