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

export const student_progressClient = () =>
  supabase.from('student_progress');

// Export typed operations
export const getStudentProgress = () => student_progressClient().select('*');
export const createStudentProgress = (data: any) => student_progressClient().insert(data);
export const updateStudentProgress = (id: any, data: any) => student_progressClient().update(data).eq('id', id);
export const deleteStudentProgress = (id: any) => student_progressClient().delete().eq('id', id);
