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

export const time_slotsClient = () =>
  supabase.from('time_slots');

// Export typed operations
export const getTimeSlots = () => time_slotsClient().select('*');
export const createTimeSlots = (data: any) => time_slotsClient().insert(data);
export const updateTimeSlots = (id: any, data: any) => time_slotsClient().update(data).eq('id', id);
export const deleteTimeSlots = (id: any) => time_slotsClient().delete().eq('id', id);
