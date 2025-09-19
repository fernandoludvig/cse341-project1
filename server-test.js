const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Simple test route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Server is working!',
    mongodb_url_exists: !!process.env.MONGODB_URL,
    mongodb_url_length: process.env.MONGODB_URL ? process.env.MONGODB_URL.length : 0
  });
});

// Test users route without database
app.get('/users', (req, res) => {
  res.status(200).json({ 
    message: 'Users route working',
    test: true
  });
});

// Test products route without database
app.get('/products', (req, res) => {
  res.status(200).json({ 
    message: 'Products route working',
    test: true
  });
});

app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
    console.log(`MONGODB_URL exists: ${!!process.env.MONGODB_URL}`);
    console.log(`MONGODB_URL length: ${process.env.MONGODB_URL ? process.env.MONGODB_URL.length : 0}`);
});
