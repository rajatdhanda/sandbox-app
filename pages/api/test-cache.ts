// pages/api/test-cache.ts
const cache: Record<string, any> = {};

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    cache[req.body.key] = req.body.value;
    return res.status(200).json({ message: 'Cached!' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(cache);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}