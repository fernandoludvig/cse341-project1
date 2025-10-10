# Finance Tracker API - Test Suite

This directory contains comprehensive tests for the Finance Tracker API, specifically focusing on GET requests for Categories and Budgets endpoints.

## 📋 Test Coverage

### Users Tests (`users.test.js`)
- **GET /api/users** - List all users with comprehensive validation
- **GET /api/users/:id** - Get specific user by ID with error handling

### Transactions Tests (`transactions.test.js`)
- **GET /api/transactions** - List all transactions with filtering and sorting
- **GET /api/transactions/:id** - Get specific transaction by ID
- **GET /api/transactions/summary** - Get financial summary for user

### Categories Tests (`categories.test.js`)
- **GET /api/categories** - List all categories with filtering
- **GET /api/categories/:id** - Get specific category by ID
- **GET /api/categories/user/:userId** - Get categories for specific user

### Budgets Tests (`budgets.test.js`)
- **GET /api/budgets** - List all budgets with filtering
- **GET /api/budgets/:id** - Get specific budget by ID
- **GET /api/budgets/current** - Get current month budget
- **GET /api/budgets/summary/:userId** - Get budget analytics summary

## 🚀 Running Tests

### Prerequisites
- Node.js installed
- MongoDB running (local or remote)
- All dependencies installed (`npm install`)

### Quick Start
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx jest tests/users.test.js
npx jest tests/transactions.test.js
npx jest tests/categories.test.js
npx jest tests/budgets.test.js

# Run tests in watch mode
npx jest --watch
```

### Using the Test Runner
```bash
# Use the custom test runner
node tests/run-tests.js
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Specify test database URL
MONGODB_TEST_URI=mongodb://localhost:27017/finance_tracker_test

# Optional: Enable test output (default: silent)
SILENT_TESTS=false
```

### Database Setup
The tests use a separate test database to avoid contaminating development data:
- Default: `mongodb://localhost:27017/finance_tracker_test`
- Each test suite creates and cleans up its own test data
- Database connection is established/closed automatically

## 📊 Test Structure

### Users Test Suite
```
User GET Routes
├── GET /api/users
│   ├── ✓ Return all users
│   ├── ✓ Handle various field types (Google ID, profile pictures, etc.)
│   ├── ✓ Data type validation
│   ├── ✓ Empty results handling
│   └── ✓ Performance with large datasets
├── GET /api/users/:id
│   ├── ✓ Return specific user
│   ├── ✓ Complete profile information
│   ├── ✓ Handle null/undefined fields
│   ├── ✓ Invalid ID format errors
│   ├── ✓ Non-existent user errors
│   └── ✓ Date format validation
└── Error Handling & Edge Cases
    ├── ✓ Database connection errors
    ├── ✓ Concurrent request handling
    ├── ✓ Special characters in names
    ├── ✓ Very long names
    ├── ✓ Future dates handling
    └── ✓ Data integrity validation
```

### Transactions Test Suite
```
Transaction GET Routes
├── GET /api/transactions
│   ├── ✓ Return all transactions
│   ├── ✓ Sort by date descending
│   ├── ✓ Populate user information
│   ├── ✓ Filter by userId
│   ├── ✓ Filter by type (income/expense)
│   ├── ✓ Filter by category (case-insensitive)
│   ├── ✓ Combined filters
│   ├── ✓ Handle decimal amounts
│   └── ✓ Empty results handling
├── GET /api/transactions/:id
│   ├── ✓ Return specific transaction
│   ├── ✓ Populate user data
│   ├── ✓ Date format validation
│   ├── ✓ Invalid ID handling
│   └── ✓ Non-existent transaction handling
├── GET /api/transactions/summary
│   ├── ✓ Calculate financial summary
│   ├── ✓ Handle different users
│   ├── ✓ Missing userId validation
│   ├── ✓ Empty user handling
│   ├── ✓ High precision decimals
│   └── ✓ Invalid userId handling
└── Performance & Edge Cases
    ├── ✓ Large datasets handling
    ├── ✓ Concurrent requests
    ├── ✓ Special characters
    ├── ✓ Very large amounts
    └── ✓ Sort order consistency
```

### Categories Test Suite
```
Category GET Routes
├── GET /api/categories
│   ├── ✓ Return all categories
│   ├── ✓ Filter by userId
│   ├── ✓ Filter by type (income/expense)
│   ├── ✓ Combined filters
│   ├── ✓ Validation errors
│   └── ✓ Empty results
├── GET /api/categories/:id
│   ├── ✓ Return specific category
│   ├── ✓ Invalid ID format
│   ├── ✓ Non-existent ID
│   └── ✓ Populate user info
├── GET /api/categories/user/:userId
│   ├── ✓ User-specific categories
│   ├── ✓ Filter by type
│   ├── ✓ Sort by default status
│   ├── ✓ Invalid user ID
│   └── ✓ Empty user categories
└── Error Handling
    ├── ✓ Database errors
    └── ✓ Malformed requests
```

### Budgets Test Suite
```
Budget GET Routes
├── GET /api/budgets
│   ├── ✓ Return all budgets
│   ├── ✓ Filter by userId
│   ├── ✓ Filter by year/month
│   ├── ✓ Combined filters
│   ├── ✓ Population of related data
│   ├── ✓ Virtual fields calculation
│   └── ✓ Validation errors
├── GET /api/budgets/:id
│   ├── ✓ Return specific budget
│   ├── ✓ Invalid ID format
│   ├── ✓ Non-existent ID
│   ├── ✓ Populate relations
│   └── ✓ Virtual fields
├── GET /api/budgets/current
│   ├── ✓ Current month budget
│   ├── ✓ Missing userId
│   ├── ✓ Invalid userId
│   ├── ✓ No current budget
│   └── ✓ Population
├── GET /api/budgets/summary/:userId
│   ├── ✓ User budget summary
│   ├── ✓ Year filtering
│   ├── ✓ Invalid userId
│   ├── ✓ Statistics calculation
│   └── ✓ Empty user data
└── Error Handling & Edge Cases
    ├── ✓ Database errors
    ├── ✓ Malformed requests
    ├── ✓ Empty categories
    ├── ✓ Sorting verification
    └── ✓ Invalid filters
```

## 🧪 Test Features

### Data Management
- **Isolated Test Data**: Each test creates its own data and cleans up afterward
- **Realistic Test Cases**: Uses representative data that matches production scenarios
- **Cross-References**: Tests relationships between Users, Categories, and Budgets

### Validation Testing
- **Input Validation**: Tests various invalid inputs and edge cases
- **Error Responses**: Verifies proper error messages and status codes
- **Data Integrity**: Ensures data consistency and proper formatting

### Advanced Testing
- **Population Testing**: Verifies MongoDB populate operations work correctly
- **Virtual Fields**: Tests computed fields like `remainingBudget` and `utilizationPercentage`
- **Filtering Logic**: Comprehensive filter testing with multiple parameters
- **Sorting Logic**: Verifies correct data ordering

### Error Handling
- **Database Errors**: Mocks database failures to test error handling
- **Invalid Inputs**: Tests malformed requests and invalid parameters
- **Missing Data**: Tests scenarios with no data or missing relationships

## 📈 Coverage Goals

The test suite aims for comprehensive coverage of:
- ✅ **Happy Path**: All successful request scenarios
- ✅ **Error Cases**: All possible error conditions
- ✅ **Edge Cases**: Boundary conditions and unusual inputs
- ✅ **Integration**: Testing relationships between models
- ✅ **Performance**: Ensuring queries are efficient

## 🔍 Debugging Tests

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **Port Conflicts**: Make sure test database port is available
3. **Data Cleanup**: Tests should clean up their own data
4. **Async Operations**: All database operations use proper async/await

### Debug Commands
```bash
# Run with verbose output
SILENT_TESTS=false npm test

# Run single test with debugging
npx jest --detectOpenHandles tests/categories.test.js

# Check database connections
npx jest --forceExit tests/budgets.test.js
```

## 📝 Adding New Tests

When adding new GET endpoints, follow this pattern:

```javascript
describe('GET /api/new-endpoint', () => {
  test('should return expected data', async () => {
    // Arrange: Set up test data
    const testData = await Model.create({ ... });
    
    // Act: Make request
    const response = await request(app)
      .get('/api/new-endpoint')
      .expect(200);
    
    // Assert: Verify response
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('expectedField');
  });
});
```

## 🏆 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert**: Follow the AAA pattern for test structure
4. **Data Cleanup**: Always clean up test data to avoid interference
5. **Error Testing**: Test both success and failure scenarios
6. **Realistic Data**: Use data that represents real-world usage