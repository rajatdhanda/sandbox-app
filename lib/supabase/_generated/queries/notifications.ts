// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Notifications } from '../generated-types';

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

export const getNotifications = () => {
  return supabase.from('notifications').select('*');
};

export const insertNotifications = (payload: Partial<Notifications>) => {
  return supabase.from('notifications').insert(payload);
};

export const updateNotifications = (id: string, payload: Partial<Notifications>) => {
  return supabase.from('notifications').update(payload).eq('id', id);
};

export const deleteNotifications = (id: string) => {
  return supabase.from('notifications').delete().eq('id', id);
};
