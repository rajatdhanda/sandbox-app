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

export const milestonesClient = () =>
  supabase.from('milestones');

// Export typed operations
export const getMilestones = () => milestonesClient().select('*');
export const createMilestones = (data: any) => milestonesClient().insert(data);
export const updateMilestones = (id: any, data: any) => milestonesClient().update(data).eq('id', id);
export const deleteMilestones = (id: any) => milestonesClient().delete().eq('id', id);
