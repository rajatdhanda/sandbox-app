// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { AttendanceRecords } from '../generated-types';

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

export const getAttendanceRecords = () => {
  return supabase.from('attendance_records').select('*');
};

export const insertAttendanceRecords = (payload: Partial<AttendanceRecords>) => {
  return supabase.from('attendance_records').insert(payload);
};

export const updateAttendanceRecords = (id: string, payload: Partial<AttendanceRecords>) => {
  return supabase.from('attendance_records').update(payload).eq('id', id);
};

export const deleteAttendanceRecords = (id: string) => {
  return supabase.from('attendance_records').delete().eq('id', id);
};
