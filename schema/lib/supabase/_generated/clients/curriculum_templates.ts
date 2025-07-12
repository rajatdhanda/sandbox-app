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

export const curriculum_templatesClient = () =>
  supabase.from('curriculum_templates');

// Export typed operations
export const getCurriculumTemplates = () => curriculum_templatesClient().select('*');
export const createCurriculumTemplates = (data: any) => curriculum_templatesClient().insert(data);
export const updateCurriculumTemplates = (id: any, data: any) => curriculum_templatesClient().update(data).eq('id', id);
export const deleteCurriculumTemplates = (id: any) => curriculum_templatesClient().delete().eq('id', id);
