// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { ClassAssignments } from '../generated-types';

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

export const getClassAssignments = () => {
  return supabase.from('class_assignments').select('*');
};

export const insertClassAssignments = (payload: Partial<ClassAssignments>) => {
  return supabase.from('class_assignments').insert(payload);
};

export const updateClassAssignments = (id: string, payload: Partial<ClassAssignments>) => {
  return supabase.from('class_assignments').update(payload).eq('id', id);
};

export const deleteClassAssignments = (id: string) => {
  return supabase.from('class_assignments').delete().eq('id', id);
};
