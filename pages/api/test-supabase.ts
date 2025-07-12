import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await usersClient().select('*').limit(1);

    if (error) {
      console.error('Supabase test error:', error);
      return res.status(500).json({ error: 'Supabase connection failed' });
    }

    return res.status(200).json({ message: 'Supabase connected', sample: data });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: err.message });
  }
}