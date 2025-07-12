// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { DailyLogs } from '../generated-types';

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

export const getDailyLogs = () => {
  return supabase.from('daily_logs').select('*');
};

export const insertDailyLogs = (payload: Partial<DailyLogs>) => {
  return supabase.from('daily_logs').insert(payload);
};

export const updateDailyLogs = (id: string, payload: Partial<DailyLogs>) => {
  return supabase.from('daily_logs').update(payload).eq('id', id);
};

export const deleteDailyLogs = (id: string) => {
  return supabase.from('daily_logs').delete().eq('id', id);
};
