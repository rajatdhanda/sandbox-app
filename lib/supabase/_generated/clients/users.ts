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

export const usersClient = () =>
  supabase.from('users');

// Export typed operations
export const getUsers = () => usersClient().select('*');
export const createUsers = (data: any) => usersClient().insert(data);
export const updateUsers = (id: any, data: any) => usersClient().update(data).eq('id', id);
export const deleteUsers = (id: any) => usersClient().delete().eq('id', id);
