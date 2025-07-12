// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // or anon if preferred
);