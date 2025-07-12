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

export const childrenClient = () =>
  supabase.from('children');

// Export typed operations
export const getChildren = () => childrenClient().select('*');
export const createChildren = (data: any) => childrenClient().insert(data);
export const updateChildren = (id: any, data: any) => childrenClient().update(data).eq('id', id);
export const deleteChildren = (id: any) => childrenClient().delete().eq('id', id);
