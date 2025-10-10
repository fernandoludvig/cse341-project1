const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Budget = require('../src/models/Budget');
const Category = require('../src/models/Category');
const User = require('../src/models/User');

// Test database connection
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/finance_tracker_test';

describe('Budget GET Routes', () => {
  let server;
  let testUser;
  let testUser2;
  let testCategories;
  let testBudgets;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    
    // Clear existing test data
    await Budget.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
  });

  beforeEach(async () => {
    // Create test users
    testUser = await User.create({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });

    testUser2 = await User.create({
      email: 'test2@example.com',
      firstName: 'Test2',
      lastName: 'User2'
    });

    // Create test categories
    testCategories = await Category.insertMany([
      {
        userId: testUser._id,
        name: 'Alimentação',
        type: 'expense',
        color: '#FF5733'
      },
      {
        userId: testUser._id,
        name: 'Transporte',
        type: 'expense',
        color: '#3357FF'
      }
    ]);

    // Create test budgets
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    testBudgets = await Budget.insertMany([
      {
        userId: testUser._id,
        month: currentMonth,
        year: currentYear,
        totalBudget: 2000,
        totalSpent: 1500,
        categories: [
          {
            categoryId: testCategories[0]._id,
            budgetedAmount: 500,
            spentAmount: 400
          }
        ],
        notes: 'Current month budget'
      },
      {
        userId: testUser._id,
        month: currentMonth - 1 > 0 ? currentMonth - 1 : 12,
        year: currentMonth - 1 > 0 ? currentYear : currentYear - 1,
        totalBudget: 1800,
        totalSpent: 1600,
        categories: [
          {
            categoryId: testCategories[1]._id,
            budgetedAmount: 300,
            spentAmount: 280
          }
        ],
        notes: 'Previous month budget'
      },
      {
        userId: testUser2._id,
        month: currentMonth,
        year: currentYear,
        totalBudget: 2500,
        totalSpent: 2000,
        categories: [],
        notes: 'Different user budget'
      }
    ]);
  });

  afterEach(async () => {
    // Clean up test data after each test
    await Budget.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('GET /api/budgets', () => {
    test('should return all budgets', async () => {
      const response = await request(app)
        .get('/api/budgets')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('month');
      expect(response.body.data[0]).toHaveProperty('year');
      expect(response.body.data[0]).toHaveProperty('totalBudget');
    });

    test('should filter budgets by userId', async () => {
      const response = await request(app)
        .get(`/api/budgets?userId=${testUser._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(budget => budget.userId._id === testUser._id.toString())).toBe(true);
    });

    test('should filter budgets by year', async () => {
      const currentYear = new Date().getFullYear();
      
      const response = await request(app)
        .get(`/api/budgets?year=${currentYear}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(budget => budget.year === currentYear)).toBe(true);
    });

    test('should filter budgets by month', async () => {
      const currentMonth = new Date().getMonth() + 1;
      
      const response = await request(app)
        .get(`/api/budgets?month=${currentMonth}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(budget => budget.month === currentMonth)).toBe(true);
    });

    test('should filter budgets by userId, year, and month', async () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const response = await request(app)
        .get(`/api/budgets?userId=${testUser._id}&year=${currentYear}&month=${currentMonth}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].userId._id).toBe(testUser._id.toString());
      expect(response.body.data[0].year).toBe(currentYear);
      expect(response.body.data[0].month).toBe(currentMonth);
    });

    test('should return 400 for invalid userId', async () => {
      const response = await request(app)
        .get('/api/budgets?userId=invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('userId deve ser um ID válido');
    });

    test('should return empty array when no budgets exist', async () => {
      await Budget.deleteMany({});
      
      const response = await request(app)
        .get('/api/budgets')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    test('should populate user and category information', async () => {
      const response = await request(app)
        .get('/api/budgets')
        .expect(200);

      expect(response.body.data[0].userId).toHaveProperty('firstName');
      expect(response.body.data[0].userId).toHaveProperty('email');
      
      if (response.body.data[0].categories.length > 0) {
        expect(response.body.data[0].categories[0].categoryId).toHaveProperty('name');
        expect(response.body.data[0].categories[0].categoryId).toHaveProperty('color');
      }
    });

    test('should include virtual fields', async () => {
      const response = await request(app)
        .get('/api/budgets')
        .expect(200);

      const budget = response.body.data.find(b => b.totalBudget && b.totalSpent);
      if (budget) {
        expect(budget).toHaveProperty('remainingBudget');
        expect(budget).toHaveProperty('utilizationPercentage');
        expect(budget.remainingBudget).toBe(budget.totalBudget - budget.totalSpent);
      }
    });
  });

  describe('GET /api/budgets/:id', () => {
    test('should return a specific budget by ID', async () => {
      const budgetId = testBudgets[0]._id;
      
      const response = await request(app)
        .get(`/api/budgets/${budgetId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(budgetId.toString());
      expect(response.body.data.totalBudget).toBe(2000);
      expect(response.body.data.totalSpent).toBe(1500);
      expect(response.body.data.notes).toBe('Current month budget');
    });

    test('should return 400 for invalid budget ID format', async () => {
      const response = await request(app)
        .get('/api/budgets/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('ID do orçamento deve ser válido');
    });

    test('should return 404 for non-existent budget ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/budgets/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Orçamento não encontrado');
    });

    test('should populate user and category information', async () => {
      const budgetId = testBudgets[0]._id;
      
      const response = await request(app)
        .get(`/api/budgets/${budgetId}`)
        .expect(200);

      expect(response.body.data.userId).toHaveProperty('firstName', 'Test');
      expect(response.body.data.userId).toHaveProperty('email', 'test@example.com');
      expect(response.body.data.categories[0].categoryId).toHaveProperty('name', 'Alimentação');
    });

    test('should include virtual fields', async () => {
      const budgetId = testBudgets[0]._id;
      
      const response = await request(app)
        .get(`/api/budgets/${budgetId}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('remainingBudget', 500);
      expect(response.body.data).toHaveProperty('utilizationPercentage', 75);
    });
  });

  describe('GET /api/budgets/current', () => {
    test('should return current month budget for user', async () => {
      const response = await request(app)
        .get(`/api/budgets/current?userId=${testUser._id}`)
        .expect(200);

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId._id).toBe(testUser._id.toString());
      expect(response.body.data.month).toBe(currentMonth);
      expect(response.body.data.year).toBe(currentYear);
    });

    test('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .get('/api/budgets/current')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('userId válido é obrigatório');
    });

    test('should return 400 for invalid userId format', async () => {
      const response = await request(app)
        .get('/api/budgets/current?userId=invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('userId válido é obrigatório');
    });

    test('should return 404 when no current month budget exists', async () => {
      await Budget.deleteMany({}); // Remove all budgets
      
      const response = await request(app)
        .get(`/api/budgets/current?userId=${testUser._id}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Nenhum orçamento encontrado para');
    });

    test('should populate user and category information', async () => {
      const response = await request(app)
        .get(`/api/budgets/current?userId=${testUser._id}`)
        .expect(200);

      expect(response.body.data.userId).toHaveProperty('firstName', 'Test');
      expect(response.body.data.userId).toHaveProperty('email', 'test@example.com');
      
      if (response.body.data.categories.length > 0) {
        expect(response.body.data.categories[0].categoryId).toHaveProperty('name');
      }
    });
  });

  describe('GET /api/budgets/summary/:userId', () => {
    test('should return budget summary for user', async () => {
      const currentYear = new Date().getFullYear();
      
      const response = await request(app)
        .get(`/api/budgets/summary/${testUser._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('year', currentYear);
      expect(response.body.data).toHaveProperty('totalBudgets');
      expect(response.body.data).toHaveProperty('totalBudgetedAmount');
      expect(response.body.data).toHaveProperty('totalSpentAmount');
      expect(response.body.data).toHaveProperty('overallUtilizationPercentage');
      expect(response.body.data).toHaveProperty('monthlyBreakdown');
    });

    test('should filter summary by specific year', async () => {
      const specificYear = 2024;
      
      const response = await request(app)
        .get(`/api/budgets/summary/${testUser._id}?year=${specificYear}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.year).toBe(specificYear);
      expect(response.body.data.totalBudgets).toBe(0); // No budgets for 2024
    });

    test('should return 400 for invalid userId format', async () => {
      const response = await request(app)
        .get('/api/budgets/summary/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('userId deve ser um ID válido');
    });

    test('should calculate correct summary statistics', async () => {
      const currentYear = new Date().getFullYear();
      
      const response = await request(app)
        .get(`/api/budgets/summary/${testUser._id}?year=${currentYear}`)
        .expect(200);

      const summary = response.body.data;
      expect(summary.monthlyBreakdown).toBeInstanceOf(Array);
      
      if (summary.monthlyBreakdown.length > 0) {
        const monthlyData = summary.monthlyBreakdown[0];
        expect(monthlyData).toHaveProperty('month');
        expect(monthlyData).toHaveProperty('budgeted');
        expect(monthlyData).toHaveProperty('spent');
        expect(monthlyData).toHaveProperty('remaining');
        expect(monthlyData).toHaveProperty('utilizationPercentage');
        expect(monthlyData.remaining).toBe(monthlyData.budgeted - monthlyData.spent);
      }
    });

    test('should return empty summary for user with no budgets', async () => {
      const emptyUser = await User.create({
        email: 'empty@example.com',
        firstName: 'Empty',
        lastName: 'User'
      });

      const response = await request(app)
        .get(`/api/budgets/summary/${emptyUser._id}`)
        .expect(200);

      expect(response.body.data.totalBudgets).toBe(0);
      expect(response.body.data.totalBudgetedAmount).toBe(0);
      expect(response.body.data.totalSpentAmount).toBe(0);
      expect(response.body.data.monthlyBreakdown).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors gracefully', async () => {
      // Mock Budget to throw an error
      const originalFind = Budget.find;
      Budget.find = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/budgets')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');

      // Restore original function
      Budget.find = originalFind;
    });

    test('should handle malformed requests', async () => {
      const response = await request(app)
        .get('/api/budgets?year=invalid')
        .expect(200); // This should still work as year filter is optional

      expect(response.body.success).toBe(true);
    });

    test('should handle edge cases in current budget endpoint', async () => {
      const response = await request(app)
        .get('/api/budgets/current?userId=')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Data Validation and Edge Cases', () => {
    test('should handle budgets with empty categories array', async () => {
      const budgetWithNoCategories = testBudgets.find(b => b.categories.length === 0);
      if (budgetWithNoCategories) {
        const response = await request(app)
          .get(`/api/budgets/${budgetWithNoCategories._id}`)
          .expect(200);

        expect(response.body.data.categories).toHaveLength(0);
      }
    });

    test('should return budgets sorted by year and month descending', async () => {
      const response = await request(app)
        .get('/api/budgets')
        .expect(200);

      const budgets = response.body.data;
      for (let i = 0; i < budgets.length - 1; i++) {
        const current = budgets[i];
        const next = budgets[i + 1];
        
        if (current.year === next.year) {
          expect(current.month).toBeGreaterThanOrEqual(next.month);
        } else {
          expect(current.year).toBeGreaterThanOrEqual(next.year);
        }
      }
    });

    test('should handle year and month filters correctly', async () => {
      const response = await request(app)
        .get('/api/budgets?year=9999&month=13') // Invalid values but should not crash
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0); // No budgets should match
    });
  });
});