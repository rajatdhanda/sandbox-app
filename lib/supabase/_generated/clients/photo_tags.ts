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

export const photo_tagsClient = () =>
  supabase.from('photo_tags');

// Export typed operations
export const getPhotoTags = () => photo_tagsClient().select('*');
export const createPhotoTags = (data: any) => photo_tagsClient().insert(data);
export const updatePhotoTags = (id: any, data: any) => photo_tagsClient().update(data).eq('id', id);
export const deletePhotoTags = (id: any) => photo_tagsClient().delete().eq('id', id);
