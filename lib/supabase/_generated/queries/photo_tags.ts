// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { PhotoTags } from '../generated-types';

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

export const getPhotoTags = () => {
  return supabase.from('photo_tags').select('*');
};

export const insertPhotoTags = (payload: Partial<PhotoTags>) => {
  return supabase.from('photo_tags').insert(payload);
};

export const updatePhotoTags = (id: string, payload: Partial<PhotoTags>) => {
  return supabase.from('photo_tags').update(payload).eq('id', id);
};

export const deletePhotoTags = (id: string) => {
  return supabase.from('photo_tags').delete().eq('id', id);
};
