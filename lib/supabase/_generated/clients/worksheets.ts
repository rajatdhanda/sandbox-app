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

export const worksheetsClient = () =>
  supabase.from('worksheets');

// Export typed operations
export const getWorksheets = () => worksheetsClient().select('*');
export const createWorksheets = (data: any) => worksheetsClient().insert(data);
export const updateWorksheets = (id: any, data: any) => worksheetsClient().update(data).eq('id', id);
export const deleteWorksheets = (id: any) => worksheetsClient().delete().eq('id', id);
