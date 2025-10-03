const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

console.log('Starting server...');
console.log('Port:', port);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Simple test route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.status(200).json({ 
    message: 'Server is working!',
    port: port,
    timestamp: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.status(200).json({ 
    message: 'Test route working',
    success: true
  });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Test server running on port ${port}`);
    console.log(`Server started at: ${new Date().toISOString()}`);
});
