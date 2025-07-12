// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Events } from '../generated-types';

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

export const getEvents = () => {
  return supabase.from('events').select('*');
};

export const insertEvents = (payload: Partial<Events>) => {
  return supabase.from('events').insert(payload);
};

export const updateEvents = (id: string, payload: Partial<Events>) => {
  return supabase.from('events').update(payload).eq('id', id);
};

export const deleteEvents = (id: string) => {
  return supabase.from('events').delete().eq('id', id);
};
