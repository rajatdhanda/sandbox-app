// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Milestones } from '../generated-types';

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

export const getMilestones = () => {
  return supabase.from('milestones').select('*');
};

export const insertMilestones = (payload: Partial<Milestones>) => {
  return supabase.from('milestones').insert(payload);
};

export const updateMilestones = (id: string, payload: Partial<Milestones>) => {
  return supabase.from('milestones').update(payload).eq('id', id);
};

export const deleteMilestones = (id: string) => {
  return supabase.from('milestones').delete().eq('id', id);
};
