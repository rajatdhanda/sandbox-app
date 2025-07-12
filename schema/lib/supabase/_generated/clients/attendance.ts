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

export const attendanceClient = () =>
  supabase.from('attendance');

// Export typed operations
export const getAttendance = () => attendanceClient().select('*');
export const createAttendance = (data: any) => attendanceClient().insert(data);
export const updateAttendance = (id: any, data: any) => attendanceClient().update(data).eq('id', id);
export const deleteAttendance = (id: any) => attendanceClient().delete().eq('id', id);
