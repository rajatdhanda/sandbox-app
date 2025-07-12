// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Curriculum } from '../generated-types';

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

export const getCurriculum = () => {
  return supabase.from('curriculum').select('*');
};

export const insertCurriculum = (payload: Partial<Curriculum>) => {
  return supabase.from('curriculum').insert(payload);
};

export const updateCurriculum = (id: string, payload: Partial<Curriculum>) => {
  return supabase.from('curriculum').update(payload).eq('id', id);
};

export const deleteCurriculum = (id: string) => {
  return supabase.from('curriculum').delete().eq('id', id);
};
