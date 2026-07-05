import { supabase } from '../db/supabase.js';

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

const TABLE = 'exercises';

const exerciseModel = {
  async getAll(filters?: ExerciseFilters): Promise<Exercise[]> {
    let query = supabase.from(TABLE).select('*');

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters?.muscle) {
      query = query.contains('target_muscles', [filters.muscle]);
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Exercise | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },
};

export default exerciseModel;
