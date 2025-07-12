// pages/api/test-db.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { usersClient } from '@/lib/supabase/compatibility';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const start = Date.now();
  console.log('🔍 [test-db] Starting database health check...');

  try {
    const { data, error } = await usersClient() // existing table
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ [test-db] Supabase error:', error.message);
      return res.status(500).json({
        status: 'error',
        message: error.message,
        elapsedMs: Date.now() - start,
      });
    }

    console.log('✅ [test-db] DB connection successful. Sample user:', data?.[0]?.id);
    return res.status(200).json({
      status: 'ok',
      userSample: data,
      elapsedMs: Date.now() - start,
    });
  } catch (err) {
    console.error('💥 [test-db] Unexpected error:', err);
    return res.status(500).json({
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
      elapsedMs: Date.now() - start,
    });
  }
}