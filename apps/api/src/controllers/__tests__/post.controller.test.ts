import { describe, it, expect, beforeEach, vi } from 'vitest'
import { postController } from '../post.controller.js'
import { postService } from '../../services/post.service.js'
import type { Request, Response, NextFunction } from 'express'

vi.mock('../../services/post.service.js')

type FindAllResult = Awaited<ReturnType<(typeof postService)['findAll']>>
type FindByIdResult = Awaited<ReturnType<(typeof postService)['findById']>>
type CreateResult = Awaited<ReturnType<(typeof postService)['create']>>
type DeleteResult = Awaited<ReturnType<(typeof postService)['delete']>>
type GetByHashtagResult = Awaited<ReturnType<(typeof postService)['getByHashtag']>>
type GetRepliesResult = Awaited<ReturnType<(typeof postService)['getReplies']>>

describe('Post Controller', () => {
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

  describe('getAll', () => {
    it('should return all posts with default pagination', async () => {
      const mockPosts = [
        { _id: '1', content: 'Post 1' },
        { _id: '2', content: 'Post 2' },
      ]

      vi.mocked(postService.findAll).mockResolvedValue(mockPosts as unknown as FindAllResult)

      await postController.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPosts,
        count: 2,
      })
    })

    it('should apply limit and skip from query parameters', async () => {
      mockReq.query = { limit: '50', skip: '100' }

      vi.mocked(postService.findAll).mockResolvedValue([])

      await postController.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(postService.findAll).toHaveBeenCalledWith({
        limit: 50,
        skip: 100,
        authorId: undefined,
      })
    })

    it('should cap limit to 100', async () => {
      mockReq.query = { limit: '200' }

      vi.mocked(postService.findAll).mockResolvedValue([])

      await postController.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(postService.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }))
    })

    it('should call next with error on service failure', async () => {
      const error = new Error('Database error')
      vi.mocked(postService.findAll).mockRejectedValue(error)

      await postController.getAll(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('getById', () => {
    it('should return a post by ID', async () => {
      const mockPost = { _id: '1', content: 'Test Post' }
      mockReq.params = { id: '1' }

      vi.mocked(postService.findById).mockResolvedValue(mockPost as unknown as FindByIdResult)

      await postController.getById(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPost,
      })
    })

    it('should return 404 if post not found', async () => {
      mockReq.params = { id: 'nonexistent' }

      vi.mocked(postService.findById).mockResolvedValue(null)

      await postController.getById(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Post not found',
      })
    })
  })

  describe('create', () => {
    it('should create a post with content', async () => {
      const postData = {
        authorId: 'user1',
        content: 'Test post #hello @user',
        visibility: 'public',
      }
      mockReq.body = postData

      const mockCreatedPost = { _id: '1', ...postData, hashtags: ['hello'], mentions: ['user'] }
      vi.mocked(postService.create).mockResolvedValue(mockCreatedPost as unknown as CreateResult)

      await postController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedPost,
      })
    })

    it('should extract hashtags and mentions from content', async () => {
      mockReq.body = {
        authorId: 'user1',
        content: '#cats #cute @meow @purr',
        visibility: 'public',
      }

      vi.mocked(postService.create).mockResolvedValue({} as unknown as CreateResult)

      await postController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(postService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          hashtags: ['cats', 'cute'],
          mentions: ['meow', 'purr'],
        })
      )
    })

    it('should reject if no content and no media', async () => {
      mockReq.body = { authorId: 'user1', mediaUrls: [] }

      await postController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Content or media is required',
      })
    })
  })

  describe('delete', () => {
    it('should delete a post by author', async () => {
      mockReq.params = { id: '1' }
      mockReq.body = { authorId: 'user1' }

      vi.mocked(postService.delete).mockResolvedValue({
        _id: '1',
        isDeleted: true,
      } as unknown as DeleteResult)

      await postController.delete(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Post deleted',
      })
    })

    it('should return 401 if authorId not provided', async () => {
      mockReq.params = { id: '1' }
      mockReq.body = {}

      await postController.delete(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(401)
    })

    it('should return 404 if post not found or unauthorized', async () => {
      mockReq.params = { id: '1' }
      mockReq.body = { authorId: 'user1' }

      vi.mocked(postService.delete).mockResolvedValue(null)

      await postController.delete(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(404)
    })
  })

  describe('getByHashtag', () => {
    it('should return posts filtered by hashtag', async () => {
      const mockPosts = [{ _id: '1', hashtags: ['cats'] }]
      mockReq.params = { hashtag: 'cats' }
      mockReq.query = { limit: '20', skip: '0' }

      vi.mocked(postService.getByHashtag).mockResolvedValue(
        mockPosts as unknown as GetByHashtagResult
      )

      await postController.getByHashtag(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockPosts,
        count: 1,
      })
    })
  })

  describe('getReplies', () => {
    it('should return replies to a post', async () => {
      const mockReplies = [
        { _id: '2', content: 'Reply 1', parentPostId: '1' },
        { _id: '3', content: 'Reply 2', parentPostId: '1' },
      ]
      mockReq.params = { id: '1' }

      vi.mocked(postService.getReplies).mockResolvedValue(
        mockReplies as unknown as GetRepliesResult
      )

      await postController.getReplies(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockReplies,
        count: 2,
      })
    })
  })
})
