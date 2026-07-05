// ===== Usuario =====
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

// ===== Ejercicios =====
export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  type: 'calisthenics' | 'dumbbell' | 'bar' | 'bands';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  target_muscles: string[];
  instructions: string | null;
  image_url: string | null;
  created_at: string;
}

export interface ExerciseFilters {
  type?: string;
  difficulty?: string;
  muscle?: string;
  search?: string;
}

// ===== Sesiones de entrenamiento =====
export interface WorkoutSession {
  id: string;
  user_id: string;
  notes: string | null;
  performed_at: string;
  duration_minutes: number | null;
  created_at: string;
  sets?: WorkoutSet[];
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

export interface StreakInfo {
  currentStreak: number;
  lastWorkoutDate: string | null;
}

// ===== Medidas corporales =====
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

// ===== Rutinas =====
export interface Routine {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  days_per_week: number;
  is_active: boolean;
  generated_at: string;
  exercises?: RoutineExercise[];
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
  exercise_name?: string;
  exercise_type?: string;
}

// ===== AI Config =====
export interface AiConfig {
  id: string;
  user_id: string;
  provider: string;
  model: string;
  has_key: boolean;
  created_at: string;
  updated_at: string;
}

export interface AiConfigPayload {
  provider?: string;
  api_key: string;
  model?: string;
}

// ===== Inactividad =====
export interface InactivityStatus {
  inactive: boolean;
  daysSinceLastWorkout: number;
  lastWorkoutDate: string | null;
}

// ===== Rutina IA (request) =====
export interface AiGenerateRequest {
  goals?: string;
  equipment?: string[];
  days_per_week?: number;
  focus?: string;
}
