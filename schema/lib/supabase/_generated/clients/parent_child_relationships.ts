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

export const parent_child_relationshipsClient = () =>
  supabase.from('parent_child_relationships');

// Export typed operations
export const getParentChildRelationships = () => parent_child_relationshipsClient().select('*');
export const createParentChildRelationships = (data: any) => parent_child_relationshipsClient().insert(data);
export const updateParentChildRelationships = (id: any, data: any) => parent_child_relationshipsClient().update(data).eq('id', id);
export const deleteParentChildRelationships = (id: any) => parent_child_relationshipsClient().delete().eq('id', id);
