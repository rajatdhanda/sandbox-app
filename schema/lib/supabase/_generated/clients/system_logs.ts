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

export const system_logsClient = () =>
  supabase.from('system_logs');

// Export typed operations
export const getSystemLogs = () => system_logsClient().select('*');
export const createSystemLogs = (data: any) => system_logsClient().insert(data);
export const updateSystemLogs = (id: any, data: any) => system_logsClient().update(data).eq('id', id);
export const deleteSystemLogs = (id: any) => system_logsClient().delete().eq('id', id);
