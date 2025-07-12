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

export const reportsClient = () =>
  supabase.from('reports');

// Export typed operations
export const getReports = () => reportsClient().select('*');
export const createReports = (data: any) => reportsClient().insert(data);
export const updateReports = (id: any, data: any) => reportsClient().update(data).eq('id', id);
export const deleteReports = (id: any) => reportsClient().delete().eq('id', id);
