import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseKey) {
  console.warn('⚠️  SUPABASE_KEY no configurada. Usando modo mock/local.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
