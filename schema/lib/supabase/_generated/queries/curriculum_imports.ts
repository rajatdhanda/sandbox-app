// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { CurriculumImports } from '../generated-types';

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

export const getCurriculumImports = () => {
  return supabase.from('curriculum_imports').select('*');
};

export const insertCurriculumImports = (payload: Partial<CurriculumImports>) => {
  return supabase.from('curriculum_imports').insert(payload);
};

export const updateCurriculumImports = (id: string, payload: Partial<CurriculumImports>) => {
  return supabase.from('curriculum_imports').update(payload).eq('id', id);
};

export const deleteCurriculumImports = (id: string) => {
  return supabase.from('curriculum_imports').delete().eq('id', id);
};
