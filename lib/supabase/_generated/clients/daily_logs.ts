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

export const daily_logsClient = () =>
  supabase.from('daily_logs');

// Export typed operations
export const getDailyLogs = () => daily_logsClient().select('*');
export const createDailyLogs = (data: any) => daily_logsClient().insert(data);
export const updateDailyLogs = (id: any, data: any) => daily_logsClient().update(data).eq('id', id);
export const deleteDailyLogs = (id: any) => daily_logsClient().delete().eq('id', id);
