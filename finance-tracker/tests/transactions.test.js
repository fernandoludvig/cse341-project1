const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Transaction = require('../src/models/Transaction');
const User = require('../src/models/User');

// Test database connection
const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/finance_tracker_test';

describe('Transaction GET Routes', () => {
  let server;
  let testUsers;
  let testTransactions;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    
    // Clear existing test data
    await Transaction.deleteMany({});
    await User.deleteMany({});
  });

  beforeEach(async () => {
    // Create test users
    testUsers = await User.insertMany([
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe'
      },
      {
        email: 'maria.silva@example.com',
        firstName: 'Maria',
        lastName: 'Silva'
      }
    ]);

    // Create test transactions with various scenarios
    testTransactions = await Transaction.insertMany([
      {
        userId: testUsers[0]._id,
        amount: 5000.00,
        description: 'Salário mensal',
        category: 'Trabalho',
        type: 'income',
        date: new Date('2025-10-01')
      },
      {
        userId: testUsers[0]._id,
        amount: 150.75,
        description: 'Compras no supermercado',
        category: 'Alimentação',
        type: 'expense',
        date: new Date('2025-10-02')
      },
      {
        userId: testUsers[0]._id,
        amount: 2500.00,
        description: 'Freelance projeto web',
        category: 'Trabalho Extra',
        type: 'income',
        date: new Date('2025-10-03')
      },
      {
        userId: testUsers[1]._id,
        amount: 300.00,
        description: 'Aluguel apartamento',
        category: 'Moradia',
        type: 'expense',
        date: new Date('2025-10-01')
      },
      {
        userId: testUsers[1]._id,
        amount: 85.90,
        description: 'Combustível carro',
        category: 'Transporte',
        type: 'expense',
        date: new Date('2025-10-04')
      },
      {
        userId: testUsers[0]._id,
        amount: 1200.00,
        description: 'Investimento ações',
        category: 'Investimentos',
        type: 'expense',
        date: new Date('2025-09-30')
      }
    ]);
  });

  afterEach(async () => {
    // Clean up test data after each test
    await Transaction.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('GET /api/transactions', () => {
    test('should return all transactions', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(6);
      expect(response.body.data).toHaveLength(6);
      
      // Verify response structure
      expect(response.body.data[0]).toHaveProperty('_id');
      expect(response.body.data[0]).toHaveProperty('userId');
      expect(response.body.data[0]).toHaveProperty('amount');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('category');
      expect(response.body.data[0]).toHaveProperty('type');
      expect(response.body.data[0]).toHaveProperty('date');
      expect(response.body.data[0]).toHaveProperty('createdAt');
    });

    test('should return transactions sorted by date descending', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      const transactions = response.body.data;
      
      // Verify sorting (most recent first)
      for (let i = 0; i < transactions.length - 1; i++) {
        const currentDate = new Date(transactions[i].date);
        const nextDate = new Date(transactions[i + 1].date);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    test('should populate user information', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      const transaction = response.body.data[0];
      
      expect(transaction.userId).toHaveProperty('firstName');
      expect(transaction.userId).toHaveProperty('lastName');
      expect(transaction.userId).toHaveProperty('email');
      expect(transaction.userId).not.toHaveProperty('__v');
    });

    test('should filter transactions by userId', async () => {
      const userId = testUsers[0]._id;
      
      const response = await request(app)
        .get(`/api/transactions?userId=${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(4); // User 0 has 4 transactions
      expect(response.body.data.every(t => t.userId._id === userId.toString())).toBe(true);
    });

    test('should filter transactions by type (income)', async () => {
      const response = await request(app)
        .get('/api/transactions?type=income')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(t => t.type === 'income')).toBe(true);
    });

    test('should filter transactions by type (expense)', async () => {
      const response = await request(app)
        .get('/api/transactions?type=expense')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(4);
      expect(response.body.data.every(t => t.type === 'expense')).toBe(true);
    });

    test('should filter transactions by category (case insensitive)', async () => {
      const response = await request(app)
        .get('/api/transactions?category=trabalho')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2); // 'Trabalho' and 'Trabalho Extra'
      expect(response.body.data.every(t => 
        t.category.toLowerCase().includes('trabalho')
      )).toBe(true);
    });

    test('should filter transactions by partial category match', async () => {
      const response = await request(app)
        .get('/api/transactions?category=trans')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1); // 'Transporte'
      expect(response.body.data[0].category).toBe('Transporte');
    });

    test('should combine multiple filters', async () => {
      const userId = testUsers[0]._id;
      
      const response = await request(app)
        .get(`/api/transactions?userId=${userId}&type=income`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(t => 
        t.userId._id === userId.toString() && t.type === 'income'
      )).toBe(true);
    });

    test('should return empty array for non-matching filters', async () => {
      const response = await request(app)
        .get('/api/transactions?category=nonexistent')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    test('should handle invalid userId filter gracefully', async () => {
      const response = await request(app)
        .get('/api/transactions?userId=invalid-id')
        .expect(200); // Should not crash, but return empty results

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });

    test('should return empty array when no transactions exist', async () => {
      await Transaction.deleteMany({});
      
      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    test('should handle transactions with decimal amounts correctly', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      const transactionWithDecimals = response.body.data.find(t => 
        t.amount === 150.75
      );
      
      expect(transactionWithDecimals).toBeDefined();
      expect(transactionWithDecimals.amount).toBe(150.75);
      expect(transactionWithDecimals.description).toBe('Compras no supermercado');
    });
  });

  describe('GET /api/transactions/:id', () => {
    test('should return a specific transaction by ID', async () => {
      const transactionId = testTransactions[0]._id;
      
      const response = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(transactionId.toString());
      expect(response.body.data.amount).toBe(5000);
      expect(response.body.data.description).toBe('Salário mensal');
      expect(response.body.data.category).toBe('Trabalho');
      expect(response.body.data.type).toBe('income');
    });

    test('should populate user information in single transaction', async () => {
      const transactionId = testTransactions[0]._id;
      
      const response = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .expect(200);

      const transaction = response.body.data;
      
      expect(transaction.userId).toHaveProperty('firstName', 'John');
      expect(transaction.userId).toHaveProperty('lastName', 'Doe');
      expect(transaction.userId).toHaveProperty('email', 'john.doe@example.com');
      expect(transaction.userId).not.toHaveProperty('__v');
    });

    test('should return 404 for non-existent transaction ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/transactions/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Transação não encontrada');
    });

    test('should return 500 for invalid transaction ID format', async () => {
      const response = await request(app)
        .get('/api/transactions/invalid-id-format')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');
    });

    test('should return transaction with correct date format', async () => {
      const transactionId = testTransactions[0]._id;
      
      const response = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .expect(200);

      const transaction = response.body.data;
      
      expect(transaction.date).toBeDefined();
      expect(new Date(transaction.date)).toBeInstanceOf(Date);
      expect(new Date(transaction.date).toISOString().split('T')[0]).toBe('2025-10-01');
    });

    test('should handle transactions with different user owners', async () => {
      const user2TransactionId = testTransactions[3]._id; // User 1's transaction
      
      const response = await request(app)
        .get(`/api/transactions/${user2TransactionId}`)
        .expect(200);

      expect(response.body.data.userId.firstName).toBe('Maria');
      expect(response.body.data.userId.lastName).toBe('Silva');
      expect(response.body.data.description).toBe('Aluguel apartamento');
    });
  });

  describe('GET /api/transactions/summary', () => {
    test('should return summary for user with transactions', async () => {
      const userId = testUsers[0]._id;
      
      const response = await request(app)
        .get(`/api/transactions/summary?userId=${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalIncome');
      expect(response.body.data).toHaveProperty('totalExpense');
      expect(response.body.data).toHaveProperty('balance');
      
      // User 0 has: Income: 5000 + 2500 = 7500, Expenses: 150.75 + 1200 = 1350.75
      expect(response.body.data.totalIncome).toBe(7500);
      expect(response.body.data.totalExpense).toBe(1350.75);
      expect(response.body.data.balance).toBe(6149.25);
    });

    test('should calculate correct summary for different user', async () => {
      const userId = testUsers[1]._id;
      
      const response = await request(app)
        .get(`/api/transactions/summary?userId=${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // User 1 has: Income: 0, Expenses: 300 + 85.90 = 385.90
      expect(response.body.data.totalIncome).toBe(0);
      expect(response.body.data.totalExpense).toBe(385.90);
      expect(response.body.data.balance).toBe(-385.90);
    });

    test('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .get('/api/transactions/summary')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('userId é obrigatório para obter resumo');
    });

    test('should return empty summary for user with no transactions', async () => {
      const emptyUser = await User.create({
        email: 'empty@example.com',
        firstName: 'Empty',
        lastName: 'User'
      });

      const response = await request(app)
        .get(`/api/transactions/summary?userId=${emptyUser._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalIncome).toBe(0);
      expect(response.body.data.totalExpense).toBe(0);
      expect(response.body.data.balance).toBe(0);
    });

    test('should handle non-existent userId', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/transactions/summary?userId=${nonExistentId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalIncome).toBe(0);
      expect(response.body.data.totalExpense).toBe(0);
      expect(response.body.data.balance).toBe(0);
    });

    test('should handle invalid userId format in summary', async () => {
      const response = await request(app)
        .get('/api/transactions/summary?userId=invalid-format')
        .expect(200); // Controller doesn't validate ObjectId format for summary

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalIncome).toBe(0);
      expect(response.body.data.totalExpense).toBe(0);
      expect(response.body.data.balance).toBe(0);
    });

    test('should calculate summary with high precision decimals', async () => {
      await Transaction.deleteMany({});
      
      // Create transactions with decimal precision
      await Transaction.insertMany([
        {
          userId: testUsers[0]._id,
          amount: 1000.33,
          description: 'Income 1',
          category: 'Work',
          type: 'income',
          date: new Date()
        },
        {
          userId: testUsers[0]._id,
          amount: 250.67,
          description: 'Expense 1',
          category: 'Food',
          type: 'expense',
          date: new Date()
        }
      ]);

      const response = await request(app)
        .get(`/api/transactions/summary?userId=${testUsers[0]._id}`)
        .expect(200);

      expect(response.body.data.totalIncome).toBe(1000.33);
      expect(response.body.data.totalExpense).toBe(250.67);
      expect(response.body.data.balance).toBe(749.66);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors in getTransactions', async () => {
      // Mock Transaction to throw an error
      const originalFind = Transaction.find;
      Transaction.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('Database connection failed'))
        })
      });

      const response = await request(app)
        .get('/api/transactions')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');

      // Restore original function
      Transaction.find = originalFind;
    });

    test('should handle database errors in getTransactionById', async () => {
      const originalFindById = Transaction.findById;
      Transaction.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database query failed'))
      });

      const transactionId = testTransactions[0]._id;
      const response = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');

      Transaction.findById = originalFindById;
    });

    test('should handle database errors in summary endpoint', async () => {
      const originalFind = Transaction.find;
      Transaction.find = jest.fn().mockRejectedValue(new Error('Database failed'));

      const response = await request(app)
        .get(`/api/transactions/summary?userId=${testUsers[0]._id}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');

      Transaction.find = originalFind;
    });

    test('should handle malformed ObjectId in findById', async () => {
      const response = await request(app)
        .get('/api/transactions/123')
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle large number of transactions efficiently', async () => {
      await Transaction.deleteMany({});
      
      // Create many transactions
      const manyTransactions = Array.from({ length: 1000 }, (_, i) => ({
        userId: testUsers[0]._id,
        amount: Math.random() * 1000,
        description: `Transaction ${i}`,
        category: 'Test',
        type: i % 2 === 0 ? 'income' : 'expense',
        date: new Date()
      }));
      
      await Transaction.insertMany(manyTransactions);
      
      const startTime = Date.now();
      const response = await request(app)
        .get('/api/transactions')
        .expect(200);
      const endTime = Date.now();
      
      expect(response.body.count).toBe(1000);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in less than 5 seconds
    });

    test('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 10 }, () =>
        request(app).get('/api/transactions').expect(200)
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(6);
      });
    });

    test('should handle special characters in descriptions and categories', async () => {
      const specialTransaction = await Transaction.create({
        userId: testUsers[0]._id,
        amount: 100,
        description: 'Açaí com açúcar & café ñoño',
        category: 'Alimentação & Bebidas',
        type: 'expense',
        date: new Date()
      });

      const response = await request(app)
        .get(`/api/transactions/${specialTransaction._id}`)
        .expect(200);

      expect(response.body.data.description).toBe('Açaí com açúcar & café ñoño');
      expect(response.body.data.category).toBe('Alimentação & Bebidas');
    });

    test('should handle very large amounts', async () => {
      const largeAmountTransaction = await Transaction.create({
        userId: testUsers[0]._id,
        amount: 999999999.99,
        description: 'Large amount transaction',
        category: 'Investment',
        type: 'income',
        date: new Date()
      });

      const response = await request(app)
        .get(`/api/transactions/${largeAmountTransaction._id}`)
        .expect(200);

      expect(response.body.data.amount).toBe(999999999.99);
    });

    test('should maintain sort order with same dates', async () => {
      await Transaction.deleteMany({});
      
      const sameDate = new Date('2025-10-10');
      await Transaction.insertMany([
        {
          userId: testUsers[0]._id,
          amount: 100,
          description: 'First',
          category: 'Test',
          type: 'income',
          date: sameDate
        },
        {
          userId: testUsers[0]._id,
          amount: 200,
          description: 'Second',
          category: 'Test',
          type: 'income',
          date: sameDate
        }
      ]);

      const response = await request(app)
        .get('/api/transactions')
        .expect(200);

      expect(response.body.count).toBe(2);
      // Both should have same date, order by creation time (most recent first)
      expect(response.body.data[0].description).toBe('Second');
      expect(response.body.data[1].description).toBe('First');
    });
  });
});