const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
  const filePath = path.join(__dirname, '../dist', req.url === '/' ? 'index.html' : req.url);
  
  // Check if the file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    // Serve the file
    const fileContent = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    
    // Set appropriate content type
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    
    res.setHeader('Content-Type', contentType);
    res.status(200).send(fileContent);
  } else {
    // Try to serve index.html for client-side routing
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath);
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(indexContent);
    } else {
      res.status(404).send('File not found');
    }
  }
};