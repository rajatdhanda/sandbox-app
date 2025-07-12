// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { TimeSlots } from '../generated-types';

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

export const getTimeSlots = () => {
  return supabase.from('time_slots').select('*');
};

export const insertTimeSlots = (payload: Partial<TimeSlots>) => {
  return supabase.from('time_slots').insert(payload);
};

export const updateTimeSlots = (id: string, payload: Partial<TimeSlots>) => {
  return supabase.from('time_slots').update(payload).eq('id', id);
};

export const deleteTimeSlots = (id: string) => {
  return supabase.from('time_slots').delete().eq('id', id);
};
