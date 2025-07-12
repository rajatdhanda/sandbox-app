// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { CurriculumExecutions } from '../generated-types';

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

export const getCurriculumExecutions = () => {
  return supabase.from('curriculum_executions').select('*');
};

export const insertCurriculumExecutions = (payload: Partial<CurriculumExecutions>) => {
  return supabase.from('curriculum_executions').insert(payload);
};

export const updateCurriculumExecutions = (id: string, payload: Partial<CurriculumExecutions>) => {
  return supabase.from('curriculum_executions').update(payload).eq('id', id);
};

export const deleteCurriculumExecutions = (id: string) => {
  return supabase.from('curriculum_executions').delete().eq('id', id);
};
