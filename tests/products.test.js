const { getAll, getSingle } = require('../controllers/products');
const mongodb = require('../data/database');

// Mock the database module
jest.mock('../data/database');

describe('Products Controller', () => {
  let mockReq, mockRes, mockCollection, mockDatabase;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis()
    };

    mockCollection = {
      find: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn()
    };

    mockDatabase = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };

    mongodb.getDatabase.mockReturnValue(mockDatabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return all products successfully', async () => {
      const mockProducts = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Product 1',
          description: 'Description 1',
          price: 29.99,
          category: 'Electronics',
          inStock: true,
          createdAt: new Date()
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Product 2',
          description: 'Description 2',
          price: 19.99,
          category: 'Clothing',
          inStock: false,
          createdAt: new Date()
        }
      ];

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue(mockProducts)
      };

      mockCollection.find.mockReturnValue(mockCursor);

      await getAll(mockReq, mockRes);

      expect(mockDatabase.collection).toHaveBeenCalledWith('products');
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCursor.toArray).toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    test('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockCollection.find.mockImplementation(() => {
        throw error;
      });

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Server error fetching products'
      });
    });

    test('should handle empty result set', async () => {
      const mockCursor = {
        toArray: jest.fn().mockResolvedValue([])
      };

      mockCollection.find.mockReturnValue(mockCursor);

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    test('should handle null database', async () => {
      mongodb.getDatabase.mockReturnValue(null);

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Server error fetching products'
      });
    });
  });

  describe('getSingle', () => {
    test('should return single product by valid ID', async () => {
      const productId = '507f1f77bcf86cd799439011';
      mockReq.params.id = productId;

      const mockProduct = {
        _id: productId,
        name: 'Product 1',
        description: 'Description 1',
        price: 29.99,
        category: 'Electronics',
        inStock: true,
        createdAt: new Date()
      };

      mockCollection.findOne.mockResolvedValue(mockProduct);

      await getSingle(mockReq, mockRes);

      expect(mockDatabase.collection).toHaveBeenCalledWith('products');
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: expect.objectContaining({
          toString: expect.any(Function)
        })
      });
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    test('should return 404 for non-existent product', async () => {
      const productId = '507f1f77bcf86cd799439011';
      mockReq.params.id = productId;

      mockCollection.findOne.mockResolvedValue(null);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Product not found'
      });
    });

    test('should return 400 for invalid ObjectId', async () => {
      mockReq.params.id = 'invalid-id';

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid product ID format'
      });
      expect(mockCollection.findOne).not.toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      const productId = '507f1f77bcf86cd799439011';
      mockReq.params.id = productId;

      const error = new Error('Database error');
      mockCollection.findOne.mockRejectedValue(error);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Server error fetching product'
      });
    });

    test('should handle null database', async () => {
      const productId = '507f1f77bcf86cd799439011';
      mockReq.params.id = productId;

      mongodb.getDatabase.mockReturnValue(null);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Server error fetching product'
      });
    });

    test('should handle various valid ObjectId formats', async () => {
      const validIds = [
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
        '507f191e810c19729de860ea'
      ];

      for (const productId of validIds) {
        mockReq.params.id = productId;
        mockCollection.findOne.mockResolvedValue({
          _id: productId,
          name: 'Test Product'
        });

        await getSingle(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockCollection.findOne).toHaveBeenCalled();
        
        // Reset mocks for next iteration
        jest.clearAllMocks();
        mongodb.getDatabase.mockReturnValue(mockDatabase);
      }
    });
  });
});
