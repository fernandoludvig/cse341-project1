const mongoose = require('mongoose');

// Setup for Jest testing
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Disable console.log during tests unless needed
  if (process.env.SILENT_TESTS !== 'false') {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  }
});

afterAll(async () => {
  // Close mongoose connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

// Increase timeout for database operations
jest.setTimeout(30000);