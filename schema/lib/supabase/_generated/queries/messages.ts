// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Messages } from '../generated-types';

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

export const getMessages = () => {
  return supabase.from('messages').select('*');
};

export const insertMessages = (payload: Partial<Messages>) => {
  return supabase.from('messages').insert(payload);
};

export const updateMessages = (id: string, payload: Partial<Messages>) => {
  return supabase.from('messages').update(payload).eq('id', id);
};

export const deleteMessages = (id: string) => {
  return supabase.from('messages').delete().eq('id', id);
};
