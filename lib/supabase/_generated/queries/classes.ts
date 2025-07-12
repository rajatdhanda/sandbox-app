// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Classes } from '../generated-types';

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

export const getClasses = () => {
  return supabase.from('classes').select('*');
};

export const insertClasses = (payload: Partial<Classes>) => {
  return supabase.from('classes').insert(payload);
};

export const updateClasses = (id: string, payload: Partial<Classes>) => {
  return supabase.from('classes').update(payload).eq('id', id);
};

export const deleteClasses = (id: string) => {
  return supabase.from('classes').delete().eq('id', id);
};
