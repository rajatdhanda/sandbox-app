// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Photos } from '../generated-types';

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

export const getPhotos = () => {
  return supabase.from('photos').select('*');
};

export const insertPhotos = (payload: Partial<Photos>) => {
  return supabase.from('photos').insert(payload);
};

export const updatePhotos = (id: string, payload: Partial<Photos>) => {
  return supabase.from('photos').update(payload).eq('id', id);
};

export const deletePhotos = (id: string) => {
  return supabase.from('photos').delete().eq('id', id);
};
