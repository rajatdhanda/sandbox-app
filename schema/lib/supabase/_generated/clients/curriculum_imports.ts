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

export const curriculum_importsClient = () =>
  supabase.from('curriculum_imports');

// Export typed operations
export const getCurriculumImports = () => curriculum_importsClient().select('*');
export const createCurriculumImports = (data: any) => curriculum_importsClient().insert(data);
export const updateCurriculumImports = (id: any, data: any) => curriculum_importsClient().update(data).eq('id', id);
export const deleteCurriculumImports = (id: any) => curriculum_importsClient().delete().eq('id', id);
