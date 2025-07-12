// AUTO-GENERATED — DO NOT EDIT
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error('supabaseKey is required.');
  }
  return createClient<Database>(url, key);
}

export const message_threadsClient = () =>
  getSupabaseClient().from<Database['public']['Tables']['message_threads']['Row']>('message_threads');
