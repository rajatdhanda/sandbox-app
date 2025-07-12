// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { CurriculumItems } from '../generated-types';

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

export const getCurriculumItems = () => {
  return supabase.from('curriculum_items').select('*');
};

export const insertCurriculumItems = (payload: Partial<CurriculumItems>) => {
  return supabase.from('curriculum_items').insert(payload);
};

export const updateCurriculumItems = (id: string, payload: Partial<CurriculumItems>) => {
  return supabase.from('curriculum_items').update(payload).eq('id', id);
};

export const deleteCurriculumItems = (id: string) => {
  return supabase.from('curriculum_items').delete().eq('id', id);
};
