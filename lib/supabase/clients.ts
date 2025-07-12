// lib/supabase/clients.ts - Browser client for auth and client-side operations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables for browser client');
}

// Export the browser client for auth operations and client-side database calls
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Re-export for convenience
export default supabase;