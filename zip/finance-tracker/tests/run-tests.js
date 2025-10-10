#!/usr/bin/env node

/**
 * Test Runner Script
 * 
 * This script runs the test suite for the Finance Tracker API
 * It handles database setup and cleanup for testing
 */

const mongoose = require('mongoose');

// Test configuration
const TEST_DB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/finance_tracker_test';

async function runTests() {
  try {
    console.log('🚀 Starting Finance Tracker API Tests...\n');
    
    // Set test environment
    process.env.NODE_ENV = 'test';
    
    // Connect to test database to verify it's available
    console.log('📦 Connecting to test database...');
    await mongoose.connect(TEST_DB_URI);
    console.log('✅ Test database connected successfully\n');
    
    // Close connection (tests will create their own)
    await mongoose.connection.close();
    
    console.log('🧪 Running test suite...\n');
    
    // Run Jest
    const { spawn } = require('child_process');
    const jest = spawn('npx', ['jest'], {
      stdio: 'inherit',
      shell: true
    });
    
    jest.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ All tests passed!');
      } else {
        console.log('\n❌ Some tests failed. Check the output above for details.');
        process.exit(code);
      }
    });
    
  } catch (error) {
    console.error('❌ Error setting up tests:', error.message);
    console.error('\nMake sure MongoDB is running and accessible at:', TEST_DB_URI);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏸️  Test execution interrupted');
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

runTests();