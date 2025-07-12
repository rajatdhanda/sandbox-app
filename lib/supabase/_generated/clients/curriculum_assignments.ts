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

export const curriculum_assignmentsClient = () =>
  supabase.from('curriculum_assignments');

// Export typed operations
export const getCurriculumAssignments = () => curriculum_assignmentsClient().select('*');
export const createCurriculumAssignments = (data: any) => curriculum_assignmentsClient().insert(data);
export const updateCurriculumAssignments = (id: any, data: any) => curriculum_assignmentsClient().update(data).eq('id', id);
export const deleteCurriculumAssignments = (id: any) => curriculum_assignmentsClient().delete().eq('id', id);
