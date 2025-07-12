// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { ConfigFields } from '../generated-types';

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

export const getConfigFields = () => {
  return supabase.from('config_fields').select('*');
};

export const insertConfigFields = (payload: Partial<ConfigFields>) => {
  return supabase.from('config_fields').insert(payload);
};

export const updateConfigFields = (id: string, payload: Partial<ConfigFields>) => {
  return supabase.from('config_fields').update(payload).eq('id', id);
};

export const deleteConfigFields = (id: string) => {
  return supabase.from('config_fields').delete().eq('id', id);
};
