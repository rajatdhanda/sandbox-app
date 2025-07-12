const { createClient } = require('@supabase/supabase-js');

// Create Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, full_name, role, phone } = req.body;

    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });

    if (authError) throw authError;

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name,
      role,
      phone: phone || null,
    });

    if (profileError) throw profileError;

    res.status(200).json({ 
      success: true, 
      message: 'User created successfully',
      userId: authData.user.id 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Failed to create user', 
      details: error.message 
    });
  }
};