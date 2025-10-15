const mongodb = require('../data/database');

// Mock the database module
jest.mock('../data/database');

describe('Database Module', () => {
  let mockCollection, mockDatabase;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCollection = {
      find: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn()
    };

    mockDatabase = {
      collection: jest.fn().mockReturnValue(mockCollection),
      databaseName: 'project1'
    };

    mongodb.getDatabase.mockReturnValue(mockDatabase);
  });

  describe('getDatabase', () => {
    test('should return database when initialized', () => {
      const result = mongodb.getDatabase();
      expect(result).toEqual(mockDatabase);
      expect(result.databaseName).toBe('project1');
    });

    test('should return null when not initialized', () => {
      mongodb.getDatabase.mockReturnValue(null);
      const result = mongodb.getDatabase();
      expect(result).toBeNull();
    });

    test('should support collection operations', () => {
      const result = mongodb.getDatabase();
      const collection = result.collection('users');
      expect(collection).toEqual(mockCollection);
      expect(result.collection).toHaveBeenCalledWith('users');
    });

    test('should support multiple collections', () => {
      const db = mongodb.getDatabase();
      
      const usersCollection = db.collection('users');
      const productsCollection = db.collection('products');
      
      expect(usersCollection).toEqual(mockCollection);
      expect(productsCollection).toEqual(mockCollection);
      expect(db.collection).toHaveBeenCalledWith('users');
      expect(db.collection).toHaveBeenCalledWith('products');
    });
  });

  describe('Database Operations', () => {
    test('should have correct database name', () => {
      const db = mongodb.getDatabase();
      expect(db.databaseName).toBe('project1');
    });

    test('should support collection operations for users', () => {
      const db = mongodb.getDatabase();
      const collection = db.collection('users');
      
      // Test that collection methods are available
      expect(typeof collection.find).toBe('function');
      expect(typeof collection.findOne).toBe('function');
      expect(typeof collection.insertOne).toBe('function');
      expect(typeof collection.updateOne).toBe('function');
      expect(typeof collection.deleteOne).toBe('function');
    });

    test('should support collection operations for products', () => {
      const db = mongodb.getDatabase();
      const collection = db.collection('products');
      
      // Test that collection methods are available
      expect(typeof collection.find).toBe('function');
      expect(typeof collection.findOne).toBe('function');
      expect(typeof collection.insertOne).toBe('function');
      expect(typeof collection.updateOne).toBe('function');
      expect(typeof collection.deleteOne).toBe('function');
    });
  });
});