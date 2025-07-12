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

export const curriculum_itemsClient = () =>
  supabase.from('curriculum_items');

// Export typed operations
export const getCurriculumItems = () => curriculum_itemsClient().select('*');
export const createCurriculumItems = (data: any) => curriculum_itemsClient().insert(data);
export const updateCurriculumItems = (id: any, data: any) => curriculum_itemsClient().update(data).eq('id', id);
export const deleteCurriculumItems = (id: any) => curriculum_itemsClient().delete().eq('id', id);
