const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Also accessible via your IP address on port ${PORT}`);
});
