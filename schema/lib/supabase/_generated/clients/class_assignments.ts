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

export const class_assignmentsClient = () =>
  supabase.from('class_assignments');

// Export typed operations
export const getClassAssignments = () => class_assignmentsClient().select('*');
export const createClassAssignments = (data: any) => class_assignmentsClient().insert(data);
export const updateClassAssignments = (id: any, data: any) => class_assignmentsClient().update(data).eq('id', id);
export const deleteClassAssignments = (id: any) => class_assignmentsClient().delete().eq('id', id);
