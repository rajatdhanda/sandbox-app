// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Reports } from '../generated-types';

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

export const getReports = () => {
  return supabase.from('reports').select('*');
};

export const insertReports = (payload: Partial<Reports>) => {
  return supabase.from('reports').insert(payload);
};

export const updateReports = (id: string, payload: Partial<Reports>) => {
  return supabase.from('reports').update(payload).eq('id', id);
};

export const deleteReports = (id: string) => {
  return supabase.from('reports').delete().eq('id', id);
};
