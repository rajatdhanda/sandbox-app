import { announcementsClient } from '@/lib/supabase/compatibility';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // First, let's test importing the generated client
    const { announcementsClient } = await import('../../lib/supabase/_generated/clients/announcements');
    
    // Test using the generated client
    const client = announcementsClient();
    const { data, error } = await client.select('*').limit(3);

    if (error) {
      console.error('Generated client error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Generated client is working!',
      data: data || [],
      timestamp: new Date().toISOString(),
    });
  } catch (importError: unknown) {
    console.error('Import error:', importError);
    const errorMessage = importError instanceof Error ? importError.message : 'Unknown import error';
    return res.status(500).json({ 
      error: 'Failed to import generated client',
      details: errorMessage 
    });
  }
}