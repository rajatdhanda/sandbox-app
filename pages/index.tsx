import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Server</h1>
      <p>Your API endpoints are available at:</p>
      <ul>
        <li><a href="/api/hello">/api/hello</a></li>
        <li><a href="/api/test-supabase">/api/test-supabase</a></li>
        <li>/api/create-user (POST only)</li>
      </ul>
    </div>
  );
}