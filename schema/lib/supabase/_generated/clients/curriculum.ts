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

export const curriculumClient = () =>
  supabase.from('curriculum');

// Export typed operations
export const getCurriculum = () => curriculumClient().select('*');
export const createCurriculum = (data: any) => curriculumClient().insert(data);
export const updateCurriculum = (id: any, data: any) => curriculumClient().update(data).eq('id', id);
export const deleteCurriculum = (id: any) => curriculumClient().delete().eq('id', id);
