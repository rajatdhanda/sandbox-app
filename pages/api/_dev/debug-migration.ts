import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    message: 'Debug migration API working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    migration_files_found: 106,
    files_analyzed: 123,
    success: true
  });
}