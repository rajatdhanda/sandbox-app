// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { SystemLogs } from '../generated-types';

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

export const getSystemLogs = () => {
  return supabase.from('system_logs').select('*');
};

export const insertSystemLogs = (payload: Partial<SystemLogs>) => {
  return supabase.from('system_logs').insert(payload);
};

export const updateSystemLogs = (id: string, payload: Partial<SystemLogs>) => {
  return supabase.from('system_logs').update(payload).eq('id', id);
};

export const deleteSystemLogs = (id: string) => {
  return supabase.from('system_logs').delete().eq('id', id);
};
