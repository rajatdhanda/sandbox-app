// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';

// Create the client directly here to avoid import issues
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

export const photo_albumsClient = () =>
  supabase.from('photo_albums');

// Export typed operations
export const getPhotoAlbums = () => photo_albumsClient().select('*');
export const createPhotoAlbums = (data: any) => photo_albumsClient().insert(data);
export const updatePhotoAlbums = (id: any, data: any) => photo_albumsClient().update(data).eq('id', id);
export const deletePhotoAlbums = (id: any) => photo_albumsClient().delete().eq('id', id);
