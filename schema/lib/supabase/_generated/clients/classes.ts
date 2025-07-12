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

export const classesClient = () =>
  supabase.from('classes');

// Export typed operations
export const getClasses = () => classesClient().select('*');
export const createClasses = (data: any) => classesClient().insert(data);
export const updateClasses = (id: any, data: any) => classesClient().update(data).eq('id', id);
export const deleteClasses = (id: any) => classesClient().delete().eq('id', id);
