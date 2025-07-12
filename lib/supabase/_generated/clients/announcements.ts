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

export const announcementsClient = () =>
  supabase.from('announcements');

// Export typed operations
export const getAnnouncements = () => announcementsClient().select('*');
export const createAnnouncements = (data: any) => announcementsClient().insert(data);
export const updateAnnouncements = (id: any, data: any) => announcementsClient().update(data).eq('id', id);
export const deleteAnnouncements = (id: any) => announcementsClient().delete().eq('id', id);
