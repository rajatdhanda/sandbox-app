// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Worksheets } from '../generated-types';

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

export const getWorksheets = () => {
  return supabase.from('worksheets').select('*');
};

export const insertWorksheets = (payload: Partial<Worksheets>) => {
  return supabase.from('worksheets').insert(payload);
};

export const updateWorksheets = (id: string, payload: Partial<Worksheets>) => {
  return supabase.from('worksheets').update(payload).eq('id', id);
};

export const deleteWorksheets = (id: string) => {
  return supabase.from('worksheets').delete().eq('id', id);
};
