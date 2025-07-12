// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { CurriculumTemplates } from '../generated-types';

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

export const getCurriculumTemplates = () => {
  return supabase.from('curriculum_templates').select('*');
};

export const insertCurriculumTemplates = (payload: Partial<CurriculumTemplates>) => {
  return supabase.from('curriculum_templates').insert(payload);
};

export const updateCurriculumTemplates = (id: string, payload: Partial<CurriculumTemplates>) => {
  return supabase.from('curriculum_templates').update(payload).eq('id', id);
};

export const deleteCurriculumTemplates = (id: string) => {
  return supabase.from('curriculum_templates').delete().eq('id', id);
};
