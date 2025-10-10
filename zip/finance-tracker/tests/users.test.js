const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// Test database connection
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/finance_tracker_test';

describe('User GET Routes', () => {
  let server;
  let testUsers;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    
    // Clear existing test data
    await User.deleteMany({});
  });

  beforeEach(async () => {
    // Create test users with various scenarios
    testUsers = await User.insertMany([
      {
        googleId: '123456789012345678901',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://example.com/john.jpg',
        dateOfBirth: new Date('1990-05-15'),
        phoneNumber: '+5511999887766'
      },
      {
        email: 'maria.silva@example.com',
        firstName: 'Maria',
        lastName: 'Silva',
        profilePicture: null,
        dateOfBirth: new Date('1985-03-20'),
        phoneNumber: '+5511888776655'
      },
      {
        googleId: '987654321098765432109',
        email: 'carlos.santos@example.com',
        firstName: 'Carlos',
        lastName: 'Santos',
        profilePicture: 'https://example.com/carlos.jpg',
        dateOfBirth: null,
        phoneNumber: null
      },
      {
        email: 'ana.costa@example.com',
        firstName: 'Ana',
        lastName: 'Costa',
        profilePicture: null,
        dateOfBirth: new Date('1995-12-10'),
        phoneNumber: '+5511777665544'
      }
    ]);
  });

  afterEach(async () => {
    // Clean up test data after each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('GET /api/users', () => {
    test('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(4);
      expect(response.body.data).toHaveLength(4);
      
      // Verify response structure
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('email');
      expect(response.body.data[0]).toHaveProperty('firstName');
      expect(response.body.data[0]).toHaveProperty('lastName');
      expect(response.body.data[0]).toHaveProperty('createdAt');
      
      // Verify __v field is excluded
      expect(response.body.data[0]).not.toHaveProperty('__v');
    });

    test('should return users with all field types', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      const users = response.body.data;
      
      // Find user with Google ID
      const googleUser = users.find(u => u.googleId);
      expect(googleUser).toBeDefined();
      expect(googleUser.googleId).toBe('123456789012345678901');
      
      // Find user without Google ID
      const regularUser = users.find(u => !u.googleId);
      expect(regularUser).toBeDefined();
      
      // Find user with profile picture
      const userWithPhoto = users.find(u => u.profilePicture);
      expect(userWithPhoto).toBeDefined();
      expect(userWithPhoto.profilePicture).toContain('https://');
      
      // Find user without phone
      const userWithoutPhone = users.find(u => !u.phoneNumber);
      expect(userWithoutPhone).toBeDefined();
    });

    test('should return empty array when no users exist', async () => {
      await User.deleteMany({});
      
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    test('should return users with proper data types', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      const user = response.body.data[0];
      
      expect(typeof user._id).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.firstName).toBe('string');
      expect(typeof user.lastName).toBe('string');
      expect(typeof user.createdAt).toBe('string');
      
      // Optional fields should be correct type when present
      if (user.googleId) {
        expect(typeof user.googleId).toBe('string');
      }
      if (user.profilePicture) {
        expect(typeof user.profilePicture).toBe('string');
      }
      if (user.phoneNumber) {
        expect(typeof user.phoneNumber).toBe('string');
      }
      if (user.dateOfBirth) {
        expect(typeof user.dateOfBirth).toBe('string');
        expect(new Date(user.dateOfBirth)).toBeInstanceOf(Date);
      }
    });

    test('should include updatedAt field', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.data[0]).toHaveProperty('updatedAt');
      expect(typeof response.body.data[0].updatedAt).toBe('string');
    });

    test('should handle large number of users efficiently', async () => {
      // Clean existing users
      await User.deleteMany({});
      
      // Create many users
      const manyUsers = Array.from({ length: 100 }, (_, i) => ({
        email: `user${i}@example.com`,
        firstName: `User${i}`,
        lastName: `Test${i}`
      }));
      
      await User.insertMany(manyUsers);
      
      const startTime = Date.now();
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      const endTime = Date.now();
      
      expect(response.body.count).toBe(100);
      expect(endTime - startTime).toBeLessThan(2000); // Should complete in less than 2 seconds
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return a specific user by ID', async () => {
      const userId = testUsers[0]._id;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(userId.toString());
      expect(response.body.data.email).toBe('john.doe@example.com');
      expect(response.body.data.firstName).toBe('John');
      expect(response.body.data.lastName).toBe('Doe');
      expect(response.body.data.googleId).toBe('123456789012345678901');
      expect(response.body.data.profilePicture).toBe('https://example.com/john.jpg');
    });

    test('should return user with complete profile information', async () => {
      const userId = testUsers[0]._id;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      const user = response.body.data;
      
      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('googleId');
      expect(user).toHaveProperty('profilePicture');
      expect(user).toHaveProperty('dateOfBirth');
      expect(user).toHaveProperty('phoneNumber');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
      
      // Verify __v field is excluded
      expect(user).not.toHaveProperty('__v');
    });

    test('should return user with null/undefined optional fields', async () => {
      const userWithNulls = testUsers.find(u => !u.googleId);
      const userId = userWithNulls._id;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      const user = response.body.data;
      
      expect(user.googleId).toBeUndefined();
      expect(user.profilePicture).toBeNull();
    });

    test('should return 404 for non-existent user ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuário não encontrado');
    });

    test('should return 500 for invalid user ID format', async () => {
      const response = await request(app)
        .get('/api/users/invalid-id-format')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');
    });

    test('should handle ObjectId string format correctly', async () => {
      const userId = testUsers[1]._id;
      
      const response = await request(app)
        .get(`/api/users/${userId.toString()}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(userId.toString());
    });

    test('should return proper date format for dateOfBirth', async () => {
      const userWithBirthdate = testUsers.find(u => u.dateOfBirth);
      const userId = userWithBirthdate._id;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      const user = response.body.data;
      expect(user.dateOfBirth).toBeDefined();
      expect(new Date(user.dateOfBirth)).toBeInstanceOf(Date);
      expect(new Date(user.dateOfBirth).getFullYear()).toBeGreaterThan(1900);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // Mock User to throw an error
      const originalFind = User.find;
      User.find = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/users')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');
      expect(response.body.error).toBe('Database connection failed');

      // Restore original function
      User.find = originalFind;
    });

    test('should handle findById errors gracefully', async () => {
      // Mock User.findById to throw an error
      const originalFindById = User.findById;
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database query failed'))
      });

      const userId = testUsers[0]._id;
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');

      // Restore original function
      User.findById = originalFindById;
    });

    test('should handle malformed ObjectId gracefully', async () => {
      const response = await request(app)
        .get('/api/users/123') // Too short for ObjectId
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    test('should handle empty string ID', async () => {
      const response = await request(app)
        .get('/api/users/')
        .expect(404); // Should hit 404 route not found, not our handler
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 10 }, () =>
        request(app).get('/api/users').expect(200)
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(4);
      });
    });

    test('should maintain data consistency across requests', async () => {
      const firstResponse = await request(app)
        .get('/api/users')
        .expect(200);

      const secondResponse = await request(app)
        .get('/api/users')
        .expect(200);

      expect(firstResponse.body.count).toBe(secondResponse.body.count);
      expect(firstResponse.body.data.length).toBe(secondResponse.body.data.length);
    });

    test('should handle special characters in names', async () => {
      const specialUser = await User.create({
        email: 'special@example.com',
        firstName: 'José María',
        lastName: 'Ñoño-González'
      });

      const response = await request(app)
        .get(`/api/users/${specialUser._id}`)
        .expect(200);

      expect(response.body.data.firstName).toBe('José María');
      expect(response.body.data.lastName).toBe('Ñoño-González');
    });

    test('should handle very long names', async () => {
      const longUser = await User.create({
        email: 'longname@example.com',
        firstName: 'A'.repeat(100),
        lastName: 'B'.repeat(100)
      });

      const response = await request(app)
        .get(`/api/users/${longUser._id}`)
        .expect(200);

      expect(response.body.data.firstName).toHaveLength(100);
      expect(response.body.data.lastName).toHaveLength(100);
    });

    test('should handle future dates correctly', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const futureUser = await User.create({
        email: 'future@example.com',
        firstName: 'Future',
        lastName: 'User',
        dateOfBirth: futureDate
      });

      const response = await request(app)
        .get(`/api/users/${futureUser._id}`)
        .expect(200);

      expect(new Date(response.body.data.dateOfBirth).getTime()).toBe(futureDate.getTime());
    });
  });

  describe('Data Validation and Integrity', () => {
    test('should ensure email uniqueness is maintained in responses', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      const emails = response.body.data.map(user => user.email);
      const uniqueEmails = new Set(emails);
      
      expect(emails.length).toBe(uniqueEmails.size); // No duplicate emails
    });

    test('should return consistent user data structure', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      const users = response.body.data;
      const requiredFields = ['_id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'];
      
      users.forEach(user => {
        requiredFields.forEach(field => {
          expect(user).toHaveProperty(field);
        });
      });
    });

    test('should handle users with minimum required fields', async () => {
      await User.deleteMany({});
      
      const minimalUser = await User.create({
        email: 'minimal@example.com',
        firstName: 'Min',
        lastName: 'User'
      });

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].email).toBe('minimal@example.com');
      expect(response.body.data[0].googleId).toBeUndefined();
      expect(response.body.data[0].profilePicture).toBeNull();
    });
  });
});