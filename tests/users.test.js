const { getAll, getSingle } = require('../controllers/users');
const mongodb = require('../data/database');

// Mock the database module
jest.mock('../data/database');

describe('Users Controller', () => {
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
    test('should return all users successfully', async () => {
      const mockUsers = [
        {
          _id: '507f1f77bcf86cd799439011',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          favoriteColor: 'Blue',
          birthday: '1990-01-01'
        },
        {
          _id: '507f1f77bcf86cd799439012',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          favoriteColor: 'Red',
          birthday: '1985-05-15'
        }
      ];

      const mockCursor = {
        toArray: jest.fn().mockResolvedValue(mockUsers)
      };

      mockCollection.find.mockReturnValue(mockCursor);

      await getAll(mockReq, mockRes);

      expect(mockDatabase.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCursor.toArray).toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    test('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockCollection.find.mockImplementation(() => {
        throw error;
      });

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Server error fetching users'
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
  });

  describe('getSingle', () => {
    test('should return single user by valid ID', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockReq.params.id = userId;

      const mockUser = {
        _id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        favoriteColor: 'Blue',
        birthday: '1990-01-01'
      };

      mockCollection.findOne.mockResolvedValue(mockUser);

      await getSingle(mockReq, mockRes);

      expect(mockDatabase.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: expect.objectContaining({
          toString: expect.any(Function)
        })
      });
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    test('should return 404 for non-existent user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockReq.params.id = userId;

      mockCollection.findOne.mockResolvedValue(null);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });

    test('should return 400 for invalid ObjectId', async () => {
      mockReq.params.id = 'invalid-id';

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid user ID format'
      });
      expect(mockCollection.findOne).not.toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockReq.params.id = userId;

      const error = new Error('Database error');
      mockCollection.findOne.mockRejectedValue(error);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Server error fetching user'
      });
    });

    test('should handle null database', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockReq.params.id = userId;

      mongodb.getDatabase.mockReturnValue(null);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Server error fetching user'
      });
    });
  });
});
