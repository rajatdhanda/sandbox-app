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

export const notificationsClient = () =>
  supabase.from('notifications');

// Export typed operations
export const getNotifications = () => notificationsClient().select('*');
export const createNotifications = (data: any) => notificationsClient().insert(data);
export const updateNotifications = (id: any, data: any) => notificationsClient().update(data).eq('id', id);
export const deleteNotifications = (id: any) => notificationsClient().delete().eq('id', id);
