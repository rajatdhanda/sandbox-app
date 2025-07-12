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

export const attendance_recordsClient = () =>
  supabase.from('attendance_records');

// Export typed operations
export const getAttendanceRecords = () => attendance_recordsClient().select('*');
export const createAttendanceRecords = (data: any) => attendance_recordsClient().insert(data);
export const updateAttendanceRecords = (id: any, data: any) => attendance_recordsClient().update(data).eq('id', id);
export const deleteAttendanceRecords = (id: any) => attendance_recordsClient().delete().eq('id', id);
