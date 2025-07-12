import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';

// This should be a simple API route, not using NextResponse
export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Mock data - replace with your actual data fetching logic
    const announcements = [
      { id: 1, title: "System Maintenance", message: "Scheduled maintenance on Sunday" },
      { id: 2, title: "New Feature", message: "Check out our new dashboard" }
    ];
    
    const events = [
      { id: 1, name: "Team Meeting", date: "2025-07-15" },
      { id: 2, name: "Product Launch", date: "2025-07-20" }
    ];
    
    const notifications = [
      { id: "4f8e02f9-6aa1-4f4d-bef6-50641778651c", type: "info", message: "Welcome to the system" }
    ];

    return res.status(200).json({
      announcements,
      events,
      notifications,
    });
  } catch (error) {
    console.error('Error in test-admin-data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}