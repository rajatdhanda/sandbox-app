// pages/api/test-auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json({ status: 'authenticated', user: data.user });
}