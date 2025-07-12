// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { ParentChildRelationships } from '../generated-types';

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

export const getParentChildRelationships = () => {
  return supabase.from('parent_child_relationships').select('*');
};

export const insertParentChildRelationships = (payload: Partial<ParentChildRelationships>) => {
  return supabase.from('parent_child_relationships').insert(payload);
};

export const updateParentChildRelationships = (id: string, payload: Partial<ParentChildRelationships>) => {
  return supabase.from('parent_child_relationships').update(payload).eq('id', id);
};

export const deleteParentChildRelationships = (id: string) => {
  return supabase.from('parent_child_relationships').delete().eq('id', id);
};
