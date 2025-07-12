// AUTO-GENERATED — DO NOT EDIT
import { supabase } from '@/lib/supabase/clients';
import { Database } from '@/lib/supabase/types';

export const testNotificationsClient = () =>
  supabase.from<Database['public']['Tables']['notifications']['Row']>('notifications');