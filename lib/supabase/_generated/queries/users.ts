// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Users } from '../generated-types';

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

export const getUsers = () => {
  return supabase.from('users').select('*');
};

export const insertUsers = (payload: Partial<Users>) => {
  return supabase.from('users').insert(payload);
};

export const updateUsers = (id: string, payload: Partial<Users>) => {
  return supabase.from('users').update(payload).eq('id', id);
};

export const deleteUsers = (id: string) => {
  return supabase.from('users').delete().eq('id', id);
};
