export default function handler(req, res) {
  console.log(">>> /api/hello route hit");
  res.status(200).json({ message: 'API is working on Vercel' });
}