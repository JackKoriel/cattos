# API Test Suite

Comprehensive Vitest test suite for Cattos API services, controllers, and middleware.

## Test Structure

Tests are organized in `__tests__` folders parallel to the code they test:

```
src/
├── services/
│   ├── post.service.ts
│   └── __tests__/
│       ├── post.service.test.ts
│       └── user.service.test.ts
├── controllers/
│   ├── post.controller.ts
│   └── __tests__/
│       ├── post.controller.test.ts
│       └── user.controller.test.ts
└── middleware/
    ├── error.middleware.ts
    └── __tests__/
        └── error.middleware.test.ts
```

## Running Tests

```bash
# Run all tests
yarn test

# Watch mode (auto-rerun on file changes)
yarn test:watch

# Coverage report
yarn test:coverage
```

## Test Coverage

### Services

- **postService**: 8 test suites covering CRUD, hashtags, and replies
- **userService**: 7 test suites covering CRUD, search, and uniqueness validation

### Controllers

- **postController**: 7 test suites for all endpoints with validation
- **userController**: 7 test suites for all endpoints with business logic
- **errorMiddleware**: Error handling and 404 responses

## Mocking Strategy

All services are mocked in controller tests to isolate controller logic:

```typescript
vi.mock('../services/post.service.js')
```

MongoDB models are mocked in service tests to avoid database dependency.

## Test Examples

### Service Test

```typescript
describe('postService', () => {
  describe('findAll', () => {
    it('should return public posts with pagination', async () => {
      vi.mocked(Post.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockPosts),
      } as any)

      const result = await postService.findAll({ limit: 20, skip: 0 })
      expect(result).toEqual(mockPosts)
    })
  })
})
```

### Controller Test

```typescript
describe('postController', () => {
  describe('create', () => {
    it('should extract hashtags and mentions from content', async () => {
      mockReq.body = {
        authorId: 'user1',
        content: '#cats #cute @meow @purr',
      }

      await postController.create(mockReq, mockRes, mockNext)

      expect(postService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          hashtags: ['cats', 'cute'],
          mentions: ['meow', 'purr'],
        })
      )
    })
  })
})
```

## Configuration

- **jest.config.ts**: Main Jest configuration with ESM support
- **tsconfig.test.json**: Relaxed TypeScript config for tests (allows `any` type)
- Test files excluded from production build via tsconfig.json

## Key Test Scenarios

### Post Service

- ✓ Fetch all public posts with pagination
- ✓ Filter posts by author or visibility
- ✓ Create posts with auto-extracted hashtags/mentions
- ✓ Soft delete posts (only by author)
- ✓ Get posts by hashtag
- ✓ Get replies to a post thread
- ✓ Update posts (marks as edited)

### User Service

- ✓ Fetch all active users
- ✓ Find user by ID, username, or email
- ✓ Create new user with validation
- ✓ Update user profile
- ✓ Search users by text query
- ✓ Email/username uniqueness enforcement

### Controllers

- ✓ Request validation (required fields, data types)
- ✓ Authorization checks (user ownership)
- ✓ HTTP status codes (201 for create, 404 for not found, 409 for conflicts)
- ✓ Error handling and middleware delegation
- ✓ Query parameter parsing (pagination limits)
- ✓ Business logic (hashtag extraction, text search)

### Error Middleware

- ✓ MongoDB CastError → 400 "Invalid ID format"
- ✓ ValidationError → 400 with error message
- ✓ Duplicate key (11000) → 409 "Duplicate entry"
- ✓ Unknown errors → 500 "Internal server error"
- ✓ Custom status codes
- ✓ 404 for undefined routes

## Future Enhancements

- Integration tests with MongoDB test container
- API endpoint E2E tests
- Like/Follow/Bookmark service tests
- Authentication middleware tests (when Cognito integrated)
- Load testing for pagination limits
