// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { StudentProgress } from '../generated-types';

// Create server client directly
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const getStudentProgress = () => {
  return supabase.from('student_progress').select('*');
};

export const insertStudentProgress = (payload: Partial<StudentProgress>) => {
  return supabase.from('student_progress').insert(payload);
};

export const updateStudentProgress = (id: string, payload: Partial<StudentProgress>) => {
  return supabase.from('student_progress').update(payload).eq('id', id);
};

export const deleteStudentProgress = (id: string) => {
  return supabase.from('student_progress').delete().eq('id', id);
};
