// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Announcements } from '../generated-types';

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

export const getAnnouncements = () => {
  return supabase.from('announcements').select('*');
};

export const insertAnnouncements = (payload: Partial<Announcements>) => {
  return supabase.from('announcements').insert(payload);
};

export const updateAnnouncements = (id: string, payload: Partial<Announcements>) => {
  return supabase.from('announcements').update(payload).eq('id', id);
};

export const deleteAnnouncements = (id: string) => {
  return supabase.from('announcements').delete().eq('id', id);
};
