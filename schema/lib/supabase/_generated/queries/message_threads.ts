// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { MessageThreads } from '../generated-types';

// Create server client directly
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

export const getMessageThreads = () => {
  return supabase.from('message_threads').select('*');
};

export const insertMessageThreads = (payload: Partial<MessageThreads>) => {
  return supabase.from('message_threads').insert(payload);
};

export const updateMessageThreads = (id: string, payload: Partial<MessageThreads>) => {
  return supabase.from('message_threads').update(payload).eq('id', id);
};

export const deleteMessageThreads = (id: string) => {
  return supabase.from('message_threads').delete().eq('id', id);
};
