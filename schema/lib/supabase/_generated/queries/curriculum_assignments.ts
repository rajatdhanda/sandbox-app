// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { CurriculumAssignments } from '../generated-types';

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

export const getCurriculumAssignments = () => {
  return supabase.from('curriculum_assignments').select('*');
};

export const insertCurriculumAssignments = (payload: Partial<CurriculumAssignments>) => {
  return supabase.from('curriculum_assignments').insert(payload);
};

export const updateCurriculumAssignments = (id: string, payload: Partial<CurriculumAssignments>) => {
  return supabase.from('curriculum_assignments').update(payload).eq('id', id);
};

export const deleteCurriculumAssignments = (id: string) => {
  return supabase.from('curriculum_assignments').delete().eq('id', id);
};
