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

export const messagesClient = () =>
  supabase.from('messages');

// Export typed operations
export const getMessages = () => messagesClient().select('*');
export const createMessages = (data: any) => messagesClient().insert(data);
export const updateMessages = (id: any, data: any) => messagesClient().update(data).eq('id', id);
export const deleteMessages = (id: any) => messagesClient().delete().eq('id', id);
