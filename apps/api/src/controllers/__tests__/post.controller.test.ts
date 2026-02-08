import { describe, it, expect, beforeEach, vi } from 'vitest'
import { postController } from '../post.controller.js'
import { postService } from '../../services/post.service.js'
import { likeService } from '../../services/like.service.js'
import { bookmarkService } from '../../services/bookmark.service.js'
import type { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'

vi.mock('../../services/post.service.js')
vi.mock('../../services/like.service.js', () => ({
  likeService: {
    getLikeByPostAndUser: vi.fn(),
  },
}))

vi.mock('../../services/bookmark.service.js', () => ({
  bookmarkService: {
    getBookmarkByPostAndUser: vi.fn(),
  },
}))

type FindAllResult = Awaited<ReturnType<(typeof postService)['findAll']>>
type FindByIdResult = Awaited<ReturnType<(typeof postService)['findById']>>
type CreateResult = Awaited<ReturnType<(typeof postService)['create']>>
type DeleteResult = Awaited<ReturnType<(typeof postService)['delete']>>
type GetByHashtagResult = Awaited<ReturnType<(typeof postService)['getByHashtag']>>
type GetRepliesResult = Awaited<ReturnType<(typeof postService)['getReplies']>>

describe('Post Controller', () => {
  let mockReq: Partial<Request> & { user?: { id: string } }
  let mockRes: Partial<Response>
  let mockNext: ReturnType<typeof vi.fn>
  let userId: string

  beforeEach(() => {
    userId = new Types.ObjectId().toHexString()
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

    vi.mocked(likeService.getLikeByPostAndUser).mockResolvedValue(null as unknown as never)
    vi.mocked(bookmarkService.getBookmarkByPostAndUser).mockResolvedValue(null as unknown as never)
  })

  describe('listPosts', () => {
    it('should return all posts with default pagination', async () => {
      const mockPosts = [
        { id: '1', content: 'Post 1' },
        { id: '2', content: 'Post 2' },
      ]

      vi.mocked(postService.findAll).mockResolvedValue(mockPosts as unknown as FindAllResult)

      await postController.listPosts(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: [
          { id: '1', content: 'Post 1', isLiked: false, isBookmarked: false },
          { id: '2', content: 'Post 2', isLiked: false, isBookmarked: false },
        ],
        count: 2,
      })
    })

    it('should apply limit and skip from query parameters', async () => {
      mockReq.query = { limit: '50', skip: '100' }

      vi.mocked(postService.findAll).mockResolvedValue([])

      await postController.listPosts(
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

      await postController.listPosts(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(postService.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }))
    })

    it('should call next with error on service failure', async () => {
      const error = new Error('Database error')
      vi.mocked(postService.findAll).mockRejectedValue(error)

      await postController.listPosts(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const mockPost = { id: '1', content: 'Test Post' }
      mockReq.params = { id: '1' }

      vi.mocked(postService.findById).mockResolvedValue(mockPost as unknown as FindByIdResult)

      await postController.getPostById(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { id: '1', content: 'Test Post', isLiked: false, isBookmarked: false },
      })
    })

    it('should return 404 if post not found', async () => {
      mockReq.params = { id: 'nonexistent' }

      vi.mocked(postService.findById).mockResolvedValue(null)

      await postController.getPostById(
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

  describe('createPost', () => {
    it('should create a post with content', async () => {
      const postData = {
        content: 'Test post #hello @user',
        visibility: 'public',
      }
      mockReq.body = postData
      mockReq.user = { id: userId }

      const mockCreatedPost = { id: '1', ...postData, hashtags: ['hello'], mentions: ['user'] }
      vi.mocked(postService.create).mockResolvedValue(mockCreatedPost as unknown as CreateResult)

      await postController.createPost(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { ...mockCreatedPost, isLiked: false, isBookmarked: false },
      })
    })

    it('should extract hashtags and mentions from content', async () => {
      mockReq.body = {
        content: '#cats #cute @meow @purr',
        visibility: 'public',
      }
      mockReq.user = { id: userId }

      vi.mocked(postService.create).mockResolvedValue({} as unknown as CreateResult)

      await postController.createPost(
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
      mockReq.body = { mediaUrls: [] }
      mockReq.user = { id: userId }

      await postController.createPost(
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

    it('should return 401 if not authenticated', async () => {
      mockReq.body = { content: 'Hello' }

      await postController.createPost(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(401)
    })
  })

  describe('deletePost', () => {
    it('should delete a post by author', async () => {
      mockReq.params = { id: '1' }
      mockReq.user = { id: userId }

      vi.mocked(postService.delete).mockResolvedValue({
        _id: '1',
        isDeleted: true,
      } as unknown as DeleteResult)

      await postController.deletePost(
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

      await postController.deletePost(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(401)
    })

    it('should return 404 if post not found or unauthorized', async () => {
      mockReq.params = { id: '1' }
      mockReq.user = { id: userId }

      vi.mocked(postService.delete).mockResolvedValue(null)

      await postController.deletePost(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.status).toHaveBeenCalledWith(404)
    })
  })

  describe('listPostsByHashtag', () => {
    it('should return posts filtered by hashtag', async () => {
      const mockPosts = [{ id: '1', hashtags: ['cats'] }]
      mockReq.params = { hashtag: 'cats' }
      mockReq.query = { limit: '20', skip: '0' }

      vi.mocked(postService.getByHashtag).mockResolvedValue(
        mockPosts as unknown as GetByHashtagResult
      )

      await postController.listPostsByHashtag(
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

  describe('listRepliesForPost', () => {
    it('should return replies to a post', async () => {
      const mockReplies = [
        { id: '2', content: 'Reply 1', parentPostId: '1' },
        { id: '3', content: 'Reply 2', parentPostId: '1' },
      ]
      mockReq.params = { id: '1' }

      vi.mocked(postService.getReplies).mockResolvedValue(
        mockReplies as unknown as GetRepliesResult
      )

      await postController.listRepliesForPost(
        mockReq as Request,
        mockRes as Response,
        mockNext as unknown as NextFunction
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: [
          { id: '2', content: 'Reply 1', parentPostId: '1', isLiked: false, isBookmarked: false },
          { id: '3', content: 'Reply 2', parentPostId: '1', isLiked: false, isBookmarked: false },
        ],
        count: 2,
      })
    })
  })
})
