// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Attendance } from '../generated-types';

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

export const getAttendance = () => {
  return supabase.from('attendance').select('*');
};

export const insertAttendance = (payload: Partial<Attendance>) => {
  return supabase.from('attendance').insert(payload);
};

export const updateAttendance = (id: string, payload: Partial<Attendance>) => {
  return supabase.from('attendance').update(payload).eq('id', id);
};

export const deleteAttendance = (id: string) => {
  return supabase.from('attendance').delete().eq('id', id);
};
