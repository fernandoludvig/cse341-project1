const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Category = require('../src/models/Category');
const User = require('../src/models/User');

// Test database connection
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/finance_tracker_test';

describe('Category GET Routes', () => {
  let server;
  let testUser;
  let testCategories;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    
    // Clear existing test data
    await Category.deleteMany({});
    await User.deleteMany({});
  });

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });

    // Create test categories
    testCategories = await Category.insertMany([
      {
        userId: testUser._id,
        name: 'Alimentação',
        type: 'expense',
        budgetLimit: 500,
        color: '#FF5733',
        isDefault: false
      },
      {
        userId: testUser._id,
        name: 'Salário',
        type: 'income',
        budgetLimit: null,
        color: '#33FF57',
        isDefault: true
      },
      {
        userId: testUser._id,
        name: 'Transporte',
        type: 'expense',
        budgetLimit: 200,
        color: '#3357FF',
        isDefault: false
      }
    ]);
  });

  afterEach(async () => {
    // Clean up test data after each test
    await Category.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('GET /api/categories', () => {
    test('should return all categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('type');
      expect(response.body.data[0]).toHaveProperty('color');
    });

    test('should filter categories by userId', async () => {
      const response = await request(app)
        .get(`/api/categories?userId=${testUser._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data.every(cat => cat.userId._id === testUser._id.toString())).toBe(true);
    });

    test('should filter categories by type (expense)', async () => {
      const response = await request(app)
        .get('/api/categories?type=expense')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(cat => cat.type === 'expense')).toBe(true);
    });

    test('should filter categories by type (income)', async () => {
      const response = await request(app)
        .get('/api/categories?type=income')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data.every(cat => cat.type === 'income')).toBe(true);
    });

    test('should filter categories by userId and type', async () => {
      const response = await request(app)
        .get(`/api/categories?userId=${testUser._id}&type=expense`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(cat => 
        cat.userId._id === testUser._id.toString() && cat.type === 'expense'
      )).toBe(true);
    });

    test('should return 400 for invalid userId', async () => {
      const response = await request(app)
        .get('/api/categories?userId=invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('userId deve ser um ID válido');
    });

    test('should return 400 for invalid type', async () => {
      const response = await request(app)
        .get('/api/categories?type=invalid-type')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Tipo deve ser "income" ou "expense"');
    });

    test('should return empty array when no categories exist', async () => {
      await Category.deleteMany({});
      
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/categories/:id', () => {
    test('should return a specific category by ID', async () => {
      const categoryId = testCategories[0]._id;
      
      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(categoryId.toString());
      expect(response.body.data.name).toBe('Alimentação');
      expect(response.body.data.type).toBe('expense');
      expect(response.body.data.color).toBe('#FF5733');
      expect(response.body.data.budgetLimit).toBe(500);
    });

    test('should return 400 for invalid category ID format', async () => {
      const response = await request(app)
        .get('/api/categories/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('ID da categoria deve ser válido');
    });

    test('should return 404 for non-existent category ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/categories/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Categoria não encontrada');
    });

    test('should populate user information', async () => {
      const categoryId = testCategories[0]._id;
      
      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .expect(200);

      expect(response.body.data.userId).toHaveProperty('firstName', 'Test');
      expect(response.body.data.userId).toHaveProperty('lastName', 'User');
      expect(response.body.data.userId).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('GET /api/categories/user/:userId', () => {
    test('should return all categories for a specific user', async () => {
      const response = await request(app)
        .get(`/api/categories/user/${testUser._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data.every(cat => cat.userId.toString() === testUser._id.toString())).toBe(true);
    });

    test('should filter user categories by type', async () => {
      const response = await request(app)
        .get(`/api/categories/user/${testUser._id}?type=expense`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(cat => cat.type === 'expense')).toBe(true);
    });

    test('should sort categories with default categories first', async () => {
      const response = await request(app)
        .get(`/api/categories/user/${testUser._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].isDefault).toBe(true);
      expect(response.body.data[0].name).toBe('Salário');
    });

    test('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/categories/user/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('userId deve ser um ID válido');
    });

    test('should return empty array for user with no categories', async () => {
      const newUser = await User.create({
        email: 'empty@example.com',
        firstName: 'Empty',
        lastName: 'User'
      });

      const response = await request(app)
        .get(`/api/categories/user/${newUser._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    test('should ignore invalid type filter silently', async () => {
      const response = await request(app)
        .get(`/api/categories/user/${testUser._id}?type=invalid`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3); // Should return all categories
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // Mock mongoose to throw an error
      const originalFind = Category.find;
      Category.find = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/categories')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');

      // Restore original function
      Category.find = originalFind;
    });

    test('should handle malformed requests', async () => {
      const response = await request(app)
        .get('/api/categories?userId=')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});