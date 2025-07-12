// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { PhotoAlbums } from '../generated-types';

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

export const getPhotoAlbums = () => {
  return supabase.from('photo_albums').select('*');
};

export const insertPhotoAlbums = (payload: Partial<PhotoAlbums>) => {
  return supabase.from('photo_albums').insert(payload);
};

export const updatePhotoAlbums = (id: string, payload: Partial<PhotoAlbums>) => {
  return supabase.from('photo_albums').update(payload).eq('id', id);
};

export const deletePhotoAlbums = (id: string) => {
  return supabase.from('photo_albums').delete().eq('id', id);
};
