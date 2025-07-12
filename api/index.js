const path = require('path');
const express = require('express');

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

module.exports = app;