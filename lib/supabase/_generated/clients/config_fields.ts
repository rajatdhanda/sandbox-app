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

export const config_fieldsClient = () =>
  supabase.from('config_fields');

// Export typed operations
export const getConfigFields = () => config_fieldsClient().select('*');
export const createConfigFields = (data: any) => config_fieldsClient().insert(data);
export const updateConfigFields = (id: any, data: any) => config_fieldsClient().update(data).eq('id', id);
export const deleteConfigFields = (id: any) => config_fieldsClient().delete().eq('id', id);
