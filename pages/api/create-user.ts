import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email, full_name, role, phone, address, emergency_contact, emergency_phone } = req.body;

  if (!email || !full_name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'sandbox123',
      email_confirm: true,
      user_metadata: { full_name, role },
    });

    if (authError || !authData.user) throw authError;

    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name,
      role,
      phone,
      address,
      emergency_contact,
      emergency_phone,
    });

    if (profileError) throw profileError;

    return res.status(200).json({ message: 'User created', userId: authData.user.id });
  } catch (err: any) {
    console.error('CreateUser Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
