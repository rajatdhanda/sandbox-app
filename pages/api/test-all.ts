// pages/api/test-all.ts
import { NextApiRequest, NextApiResponse } from 'next';

const testEndpoints = [
  '/api/test-health',
  '/api/test-db',
  '/api/test-admin-data',
  '/api/test-cache',
  // Auth can be skipped or added later with a token
];

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const results: Record<string, any> = {};

  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      const json = await response.json();
      results[endpoint] = {
        status: response.status,
        ok: response.ok,
        body: json,
      };
    } catch (err) {
      results[endpoint] = {
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    results,
  });
}