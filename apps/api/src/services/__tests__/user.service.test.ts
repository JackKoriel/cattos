import { describe, it, expect, beforeEach, vi } from 'vitest'
import { userService } from '../user.service.js'
import { User } from '../../models/index.js'
import { OnboardingStatus } from '@cattos/shared'

vi.mock('../../models/index.js', () => ({
  User: {
    find: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}))

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  type UserFindReturn = ReturnType<(typeof User)['find']>
  type UserFindOneReturn = ReturnType<(typeof User)['findOne']>
  type UserFindByIdAndUpdateReturn = ReturnType<(typeof User)['findByIdAndUpdate']>

  describe('findAll', () => {
    it('should return all active users', async () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z')
      const mockUsers = [
        {
          _id: '1',
          email: 'cat1@example.com',
          username: 'cat1',
          displayName: 'cat1',
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
          isDeactivated: false,
          isSuspended: false,
        },
        {
          _id: '2',
          email: 'cat2@example.com',
          username: 'cat2',
          displayName: 'cat2',
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
          isDeactivated: false,
          isSuspended: false,
        },
      ]

      vi.mocked(User.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockUsers),
      } as unknown as UserFindReturn)

      const result = await userService.findAll({ limit: 20, skip: 0 })

      expect(result).toEqual([
        {
          id: '1',
          email: 'cat1@example.com',
          username: 'cat1',
          displayName: 'cat1',
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
          avatar: undefined,
          coverImage: undefined,
          bio: undefined,
          location: undefined,
          website: undefined,
        },
        {
          id: '2',
          email: 'cat2@example.com',
          username: 'cat2',
          displayName: 'cat2',
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
          avatar: undefined,
          coverImage: undefined,
          bio: undefined,
          location: undefined,
          website: undefined,
        },
      ])
      expect(User.find).toHaveBeenCalledWith({
        isDeactivated: false,
        isSuspended: false,
      })
    })

    it('should apply pagination', async () => {
      const skipMock = vi.fn()
      const limitMock = vi.fn()

      vi.mocked(User.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: skipMock.mockReturnThis(),
        limit: limitMock.mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as UserFindReturn)

      await userService.findAll({ limit: 50, skip: 100 })

      expect(skipMock).toHaveBeenCalledWith(100)
      expect(limitMock).toHaveBeenCalledWith(50)
    })
  })

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z')
      const mockUser = {
        _id: '1',
        email: 'testcat@example.com',
        username: 'testcat',
        displayName: 'testcat',
        onboardingStatus: OnboardingStatus.InProgress,
        createdAt,
        isDeactivated: false,
      }

      vi.mocked(User.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUser),
      } as unknown as UserFindOneReturn)

      const result = await userService.findById('1')

      expect(result).toEqual({
        id: '1',
        email: 'testcat@example.com',
        username: 'testcat',
        displayName: 'testcat',
        onboardingStatus: OnboardingStatus.InProgress,
        createdAt,
        avatar: undefined,
        coverImage: undefined,
        bio: undefined,
        location: undefined,
        website: undefined,
      })
      expect(User.findOne).toHaveBeenCalledWith({ _id: '1', isDeactivated: false })
    })

    it('should return null if user not found', async () => {
      vi.mocked(User.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as unknown as UserFindOneReturn)

      const result = await userService.findById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z')
      const mockUser = {
        _id: '1',
        email: 'testcat@example.com',
        username: 'testcat',
        displayName: 'testcat',
        onboardingStatus: OnboardingStatus.InProgress,
        createdAt,
        isDeactivated: false,
      }

      vi.mocked(User.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUser),
      } as unknown as UserFindOneReturn)

      const result = await userService.findByUsername('testcat')

      expect(result).toEqual({
        id: '1',
        email: 'testcat@example.com',
        username: 'testcat',
        displayName: 'testcat',
        onboardingStatus: OnboardingStatus.InProgress,
        createdAt,
        avatar: undefined,
        coverImage: undefined,
        bio: undefined,
        location: undefined,
        website: undefined,
      })
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testcat', isDeactivated: false })
    })
  })

  describe('findByEmail', () => {
    it('should return a user by email (lowercased)', async () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z')
      const mockUser = {
        _id: '1',
        email: 'cat@example.com',
        username: 'cat',
        displayName: 'cat',
        onboardingStatus: OnboardingStatus.InProgress,
        createdAt,
      }

      vi.mocked(User.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUser),
      } as unknown as UserFindOneReturn)

      const result = await userService.findByEmail('CAT@EXAMPLE.COM')

      expect(result).toEqual({
        id: '1',
        email: 'cat@example.com',
        username: 'cat',
        displayName: 'cat',
        onboardingStatus: OnboardingStatus.InProgress,
        createdAt,
        avatar: undefined,
        coverImage: undefined,
        bio: undefined,
        location: undefined,
        website: undefined,
      })
      expect(User.findOne).toHaveBeenCalledWith({ email: 'cat@example.com' })
    })
  })

  describe('create', () => {
    it.skip('should create a new user', async () => {
      // Skipped: Mongoose model constructor mocking requires different approach
      // This functionality is tested via integration tests
    })
  })

  describe('update', () => {
    it('should update user profile data', async () => {
      const userId = '1'
      const updateData = { displayName: 'Updated Name', bio: 'New bio' }
      const createdAt = new Date('2024-01-01T00:00:00.000Z')

      vi.mocked(User.findByIdAndUpdate).mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: userId,
          email: 'cat@example.com',
          username: 'cat',
          displayName: updateData.displayName,
          bio: updateData.bio,
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
        }),
      } as unknown as UserFindByIdAndUpdateReturn)

      const result = await userService.update(userId, updateData)

      expect(result).toEqual({
        id: userId,
        email: 'cat@example.com',
        username: 'cat',
        displayName: updateData.displayName,
        onboardingStatus: OnboardingStatus.InProgress,
        createdAt,
        avatar: undefined,
        coverImage: undefined,
        bio: updateData.bio,
        location: undefined,
        website: undefined,
      })
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true })
    })

    it('should return null if user not found', async () => {
      vi.mocked(User.findByIdAndUpdate).mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as unknown as UserFindByIdAndUpdateReturn)

      const result = await userService.update('nonexistent', { displayName: 'Test' })

      expect(result).toBeNull()
    })
  })

  describe('search', () => {
    it('should search users by text query', async () => {
      const createdAt = new Date('2024-01-01T00:00:00.000Z')
      const mockResults = [
        {
          _id: '1',
          email: 'catfan@example.com',
          username: 'catfan',
          displayName: 'Cat Fan',
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
        },
        {
          _id: '2',
          email: 'kittycat@example.com',
          username: 'kittycat',
          displayName: 'Kitty Cat',
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
        },
      ]

      vi.mocked(User.find).mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockResults),
      } as unknown as UserFindReturn)

      const result = await userService.search('cat', { limit: 20, skip: 0 })

      expect(result).toEqual([
        {
          id: '1',
          email: 'catfan@example.com',
          username: 'catfan',
          displayName: 'Cat Fan',
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
          avatar: undefined,
          coverImage: undefined,
          bio: undefined,
          location: undefined,
          website: undefined,
        },
        {
          id: '2',
          email: 'kittycat@example.com',
          username: 'kittycat',
          displayName: 'Kitty Cat',
          onboardingStatus: OnboardingStatus.InProgress,
          createdAt,
          avatar: undefined,
          coverImage: undefined,
          bio: undefined,
          location: undefined,
          website: undefined,
        },
      ])
      expect(User.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $text: { $search: 'cat' },
          isDeactivated: false,
          isSuspended: false,
        })
      )
    })

    it('should apply pagination to search results', async () => {
      const skipMock = vi.fn()
      const limitMock = vi.fn()

      vi.mocked(User.find).mockReturnValue({
        skip: skipMock.mockReturnThis(),
        limit: limitMock.mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as UserFindReturn)

      await userService.search('test', { limit: 50, skip: 100 })

      expect(skipMock).toHaveBeenCalledWith(100)
      expect(limitMock).toHaveBeenCalledWith(50)
    })
  })
})
