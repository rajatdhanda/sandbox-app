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

export const photosClient = () =>
  supabase.from('photos');

// Export typed operations
export const getPhotos = () => photosClient().select('*');
export const createPhotos = (data: any) => photosClient().insert(data);
export const updatePhotos = (id: any, data: any) => photosClient().update(data).eq('id', id);
export const deletePhotos = (id: any) => photosClient().delete().eq('id', id);
