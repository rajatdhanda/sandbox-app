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

export const eventsClient = () =>
  supabase.from('events');

// Export typed operations
export const getEvents = () => eventsClient().select('*');
export const createEvents = (data: any) => eventsClient().insert(data);
export const updateEvents = (id: any, data: any) => eventsClient().update(data).eq('id', id);
export const deleteEvents = (id: any) => eventsClient().delete().eq('id', id);
