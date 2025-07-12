// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Children } from '../generated-types';

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

export const getChildren = () => {
  return supabase.from('children').select('*');
};

export const insertChildren = (payload: Partial<Children>) => {
  return supabase.from('children').insert(payload);
};

export const updateChildren = (id: string, payload: Partial<Children>) => {
  return supabase.from('children').update(payload).eq('id', id);
};

export const deleteChildren = (id: string) => {
  return supabase.from('children').delete().eq('id', id);
};
