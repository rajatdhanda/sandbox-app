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

export const curriculum_executionsClient = () =>
  supabase.from('curriculum_executions');

// Export typed operations
export const getCurriculumExecutions = () => curriculum_executionsClient().select('*');
export const createCurriculumExecutions = (data: any) => curriculum_executionsClient().insert(data);
export const updateCurriculumExecutions = (id: any, data: any) => curriculum_executionsClient().update(data).eq('id', id);
export const deleteCurriculumExecutions = (id: any) => curriculum_executionsClient().delete().eq('id', id);
