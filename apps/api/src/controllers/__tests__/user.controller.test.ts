import { describe, it, expect, beforeEach, vi } from 'vitest'
import { userController } from '../user.controller.js'
import { userService } from '../../services/user.service.js'
import type { Request, Response, NextFunction } from 'express'

vi.mock('../../services/user.service.js')

type FindAllResult = Awaited<ReturnType<(typeof userService)['findAll']>>
type FindByIdResult = Awaited<ReturnType<(typeof userService)['findById']>>
type FindByUsernameResult = Awaited<ReturnType<(typeof userService)['findByUsername']>>
type FindByEmailResult = Awaited<ReturnType<(typeof userService)['findByEmail']>>
type CreateResult = Awaited<ReturnType<(typeof userService)['create']>>
type UpdateResult = Awaited<ReturnType<(typeof userService)['update']>>
type SearchResult = Awaited<ReturnType<(typeof userService)['search']>>

describe('User Controller', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockReq = {
      params: {},
      query: {},
      body: {},
    }
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    }
    mockNext = vi.fn()
    vi.clearAllMocks()
  })

  describe('listUsers', () => {
    it('should return all users with pagination', async () => {
      const mockUsers = [
        { _id: '1', username: 'cat1' },
        { _id: '2', username: 'cat2' },
      ]
      mockReq.query = { limit: '20', skip: '0' }

      vi.mocked(userService.findAll).mockResolvedValue(mockUsers as unknown as FindAllResult)

      await userController.listUsers(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUsers,
        count: 2,
      })
    })
  })

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { _id: '1', username: 'testcat' }
      mockReq.params = { id: '1' }

      vi.mocked(userService.findById).mockResolvedValue(mockUser as unknown as FindByIdResult)

      await userController.getUserById(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      })
    })

    it('should return 404 if user not found', async () => {
      mockReq.params = { id: 'nonexistent' }

      vi.mocked(userService.findById).mockResolvedValue(null)

      await userController.getUserById(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found',
      })
    })
  })

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
      const mockUser = { _id: '1', username: 'testcat' }
      mockReq.params = { username: 'testcat' }

      vi.mocked(userService.findByUsername).mockResolvedValue(
        mockUser as unknown as FindByUsernameResult
      )

      await userController.getUserByUsername(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      })
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newcat@example.com',
        username: 'newcat',
        displayName: 'New Cat',
        bio: 'Meow',
      }
      mockReq.body = userData

      const mockCreatedUser = { _id: '1', ...userData }
      vi.mocked(userService.findByEmail).mockResolvedValue(null)
      vi.mocked(userService.findByUsername).mockResolvedValue(null)
      vi.mocked(userService.create).mockResolvedValue(mockCreatedUser as unknown as CreateResult)

      await userController.createUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedUser,
      })
    })

    it('should use username as displayName if not provided', async () => {
      mockReq.body = {
        email: 'cat@example.com',
        username: 'mycat',
      }

      vi.mocked(userService.findByEmail).mockResolvedValue(null)
      vi.mocked(userService.findByUsername).mockResolvedValue(null)
      vi.mocked(userService.create).mockResolvedValue({} as unknown as CreateResult)

      await userController.createUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(userService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          displayName: 'mycat',
        })
      )
    })

    it('should return 400 if email or username missing', async () => {
      mockReq.body = { email: 'cat@example.com' } // missing username

      await userController.createUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email and username are required',
      })
    })

    it('should return 409 if email already in use', async () => {
      mockReq.body = {
        email: 'taken@example.com',
        username: 'newcat',
      }

      vi.mocked(userService.findByEmail).mockResolvedValue({
        _id: 'other',
      } as unknown as FindByEmailResult)

      await userController.createUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(409)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email already in use',
      })
    })

    it('should return 409 if username already taken', async () => {
      mockReq.body = {
        email: 'new@example.com',
        username: 'taken',
      }

      vi.mocked(userService.findByEmail).mockResolvedValue(null)
      vi.mocked(userService.findByUsername).mockResolvedValue({
        _id: 'other',
      } as unknown as FindByUsernameResult)

      await userController.createUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(409)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Username already taken',
      })
    })
  })

  describe('updateUser', () => {
    it('should update user profile', async () => {
      const updateData = { displayName: 'Updated', bio: 'New bio' }
      mockReq.params = { id: '1' }
      mockReq.body = updateData
      mockReq.user = { id: '1' }

      const mockUpdatedUser = { _id: '1', ...updateData }
      vi.mocked(userService.update).mockResolvedValue(mockUpdatedUser as unknown as UpdateResult)

      await userController.updateUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedUser,
      })
    })

    it('should return 401 if not authenticated', async () => {
      mockReq.params = { id: '1' }
      mockReq.body = { displayName: 'Updated' }

      await userController.updateUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Unauthorized',
      })
    })

    it('should return 403 if updating another user', async () => {
      mockReq.params = { id: '1' }
      mockReq.body = { displayName: 'Updated' }
      mockReq.user = { id: '2' }

      await userController.updateUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Forbidden',
      })
    })

    it('should return 404 if user not found', async () => {
      mockReq.params = { id: 'nonexistent' }
      mockReq.body = { displayName: 'Test' }
      mockReq.user = { id: 'nonexistent' }

      vi.mocked(userService.update).mockResolvedValue(null)

      await userController.updateUser(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(404)
    })
  })

  describe('searchUsers', () => {
    it('should search users by query', async () => {
      const mockResults = [
        { _id: '1', username: 'catfan' },
        { _id: '2', username: 'kittycat' },
      ]
      mockReq.query = { q: 'cat' }

      vi.mocked(userService.search).mockResolvedValue(mockResults as unknown as SearchResult)

      await userController.searchUsers(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResults,
        count: 2,
      })
    })

    it('should return 400 if query not provided', async () => {
      mockReq.query = {}

      await userController.searchUsers(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Search query is required',
      })
    })
  })
})
