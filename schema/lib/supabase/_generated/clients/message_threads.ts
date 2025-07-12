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

export const message_threadsClient = () =>
  supabase.from('message_threads');

// Export typed operations
export const getMessageThreads = () => message_threadsClient().select('*');
export const createMessageThreads = (data: any) => message_threadsClient().insert(data);
export const updateMessageThreads = (id: any, data: any) => message_threadsClient().update(data).eq('id', id);
export const deleteMessageThreads = (id: any) => message_threadsClient().delete().eq('id', id);
