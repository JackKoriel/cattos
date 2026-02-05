import { describe, it, expect, beforeEach, vi } from 'vitest'
import { postService } from '../post.service.js'
import { Post } from '../../models/index.js'
import { Types } from 'mongoose'

vi.mock('../../models/index.js', () => ({
  Post: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}))

describe('Post Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makeFindChain = (result: unknown) => {
    const chain = {
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue(result),
    }
    return chain
  }

  const makeFindOneChain = (result: unknown) => {
    const chain = {
      populate: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue(result),
    }
    return chain
  }

  type PostFindReturn = ReturnType<(typeof Post)['find']>
  type PostFindOneReturn = ReturnType<(typeof Post)['findOne']>
  type PostFindOneAndUpdateReturn = ReturnType<(typeof Post)['findOneAndUpdate']>
  type PostUpdateInput = Parameters<(typeof postService)['update']>[2]

  describe('findAll', () => {
    it('should return all public posts sorted by creation date', async () => {
      const createdAt1 = new Date('2026-01-01T00:00:00.000Z')
      const createdAt2 = new Date('2026-01-02T00:00:00.000Z')
      const mockPosts = [
        {
          _id: '1',
          authorId: 'a1',
          content: 'Post 1',
          visibility: 'public',
          createdAt: createdAt1,
          updatedAt: createdAt1,
        },
        {
          _id: '2',
          authorId: 'a2',
          content: 'Post 2',
          visibility: 'public',
          createdAt: createdAt2,
          updatedAt: createdAt2,
        },
      ]

      vi.mocked(Post.find).mockReturnValue(makeFindChain(mockPosts) as unknown as PostFindReturn)

      const result = await postService.findAll({ limit: 20, skip: 0 })

      expect(result).toEqual([
        {
          _id: '1',
          authorId: 'a1',
          content: 'Post 1',
          visibility: 'public',
          likesCount: 0,
          bookmarksCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          createdAt: createdAt1.toISOString(),
          updatedAt: createdAt1.toISOString(),
        },
        {
          _id: '2',
          authorId: 'a2',
          content: 'Post 2',
          visibility: 'public',
          likesCount: 0,
          bookmarksCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          createdAt: createdAt2.toISOString(),
          updatedAt: createdAt2.toISOString(),
        },
      ])
      expect(Post.find).toHaveBeenCalledWith({
        isDeleted: false,
        visibility: 'public',
        parentPostId: { $exists: false },
      })
    })

    it('should filter posts by authorId when provided', async () => {
      const authorId = new Types.ObjectId()
      vi.mocked(Post.find).mockReturnValue(makeFindChain([]) as unknown as PostFindReturn)

      await postService.findAll({ limit: 20, skip: 0, authorId })

      expect(Post.find).toHaveBeenCalledWith({
        isDeleted: false,
        visibility: 'public',
        parentPostId: { $exists: false },
        authorId,
      })
    })

    it('should apply pagination correctly', async () => {
      const sortMock = vi.fn()
      const skipMock = vi.fn()
      const limitMock = vi.fn()

      vi.mocked(Post.find).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: sortMock.mockReturnThis(),
        skip: skipMock.mockReturnThis(),
        limit: limitMock.mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as PostFindReturn)

      await postService.findAll({ limit: 50, skip: 100 })

      expect(skipMock).toHaveBeenCalledWith(100)
      expect(limitMock).toHaveBeenCalledWith(50)
    })
  })

  describe('findById', () => {
    it('should return a single post by ID', async () => {
      const createdAt = new Date('2026-01-01T00:00:00.000Z')
      const mockPost = {
        _id: '1',
        authorId: 'a1',
        content: 'Test Post',
        visibility: 'public',
        isDeleted: false,
        createdAt,
        updatedAt: createdAt,
      }

      vi.mocked(Post.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockPost),
      } as unknown as PostFindOneReturn)

      const result = await postService.findById('1')

      expect(result).toEqual({
        _id: '1',
        authorId: 'a1',
        content: 'Test Post',
        visibility: 'public',
        likesCount: 0,
        bookmarksCount: 0,
        commentsCount: 0,
        repostsCount: 0,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
      })
      expect(Post.findOne).toHaveBeenCalledWith({ _id: '1', isDeleted: false })
    })

    it('should return null if post not found', async () => {
      vi.mocked(Post.findOne).mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(null),
      } as unknown as PostFindOneReturn)

      const result = await postService.findById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it.skip('should create a new post', async () => {
      // Skipped: Mongoose model constructor mocking requires different approach
      // This functionality is tested via integration tests
    })
  })

  describe('update', () => {
    it('should update a post by author', async () => {
      const postId = '1'
      const authorId = new Types.ObjectId()
      const updateData: PostUpdateInput = { content: 'Updated content', visibility: 'private' }
      const mockUpdatedPost = { _id: postId, ...updateData, isEdited: true }

      vi.mocked(Post.findOneAndUpdate).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockUpdatedPost),
      } as unknown as PostFindOneAndUpdateReturn)

      const result = await postService.update(postId, authorId, updateData)

      expect(result).toEqual(mockUpdatedPost)
      expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: postId, authorId, isDeleted: false },
        expect.objectContaining({ ...updateData, isEdited: true }),
        { new: true }
      )
    })

    it('should not update post if user is not author', async () => {
      vi.mocked(Post.findOneAndUpdate).mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as unknown as PostFindOneAndUpdateReturn)

      const result = await postService.update('1', new Types.ObjectId(), { content: 'Hacked!' })

      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should soft delete a post by author', async () => {
      const postId = '1'
      const authorId = new Types.ObjectId()

      vi.mocked(Post.findOneAndUpdate).mockReturnValue({
        lean: vi.fn().mockResolvedValue({ _id: postId, isDeleted: true }),
      } as unknown as PostFindOneAndUpdateReturn)

      const result = await postService.delete(postId, authorId)

      expect(result).toEqual({ _id: postId, isDeleted: true })
      expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: postId, authorId },
        { isDeleted: true },
        { new: true }
      )
    })
  })

  describe('getByHashtag', () => {
    it('should return public posts with specific hashtag', async () => {
      const createdAt = new Date('2026-01-01T00:00:00.000Z')
      const mockPosts = [
        {
          _id: '1',
          authorId: 'a1',
          content: 'Tagged post',
          hashtags: ['test'],
          visibility: 'public',
          createdAt,
          updatedAt: createdAt,
        },
      ]

      vi.mocked(Post.find).mockReturnValue(makeFindChain(mockPosts) as unknown as PostFindReturn)

      const result = await postService.getByHashtag('test', { limit: 20, skip: 0 })

      expect(result).toEqual([
        {
          _id: '1',
          authorId: 'a1',
          content: 'Tagged post',
          hashtags: ['test'],
          visibility: 'public',
          likesCount: 0,
          bookmarksCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          createdAt: createdAt.toISOString(),
          updatedAt: createdAt.toISOString(),
        },
      ])
      expect(Post.find).toHaveBeenCalledWith({
        hashtags: 'test',
        isDeleted: false,
        visibility: 'public',
      })
    })

    it('should convert hashtag to lowercase', async () => {
      vi.mocked(Post.find).mockReturnValue(makeFindChain([]) as unknown as PostFindReturn)

      await postService.getByHashtag('CATS', { limit: 20, skip: 0 })

      expect(Post.find).toHaveBeenCalledWith(expect.objectContaining({ hashtags: 'cats' }))
    })
  })

  describe('getReplies', () => {
    it('should return all replies to a post', async () => {
      const createdAt1 = new Date('2026-01-01T00:00:00.000Z')
      const createdAt2 = new Date('2026-01-02T00:00:00.000Z')
      const mockReplies = [
        {
          _id: '2',
          authorId: 'a1',
          content: 'Reply 1',
          parentPostId: '1',
          createdAt: createdAt1,
          updatedAt: createdAt1,
        },
        {
          _id: '3',
          authorId: 'a2',
          content: 'Reply 2',
          parentPostId: '1',
          createdAt: createdAt2,
          updatedAt: createdAt2,
        },
      ]

      vi.mocked(Post.find).mockReturnValue(makeFindChain(mockReplies) as unknown as PostFindReturn)

      const result = await postService.getReplies('1', { limit: 20, skip: 0 })

      expect(result).toEqual([
        {
          _id: '2',
          authorId: 'a1',
          content: 'Reply 1',
          parentPostId: '1',
          likesCount: 0,
          bookmarksCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          createdAt: createdAt1.toISOString(),
          updatedAt: createdAt1.toISOString(),
        },
        {
          _id: '3',
          authorId: 'a2',
          content: 'Reply 2',
          parentPostId: '1',
          likesCount: 0,
          bookmarksCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          createdAt: createdAt2.toISOString(),
          updatedAt: createdAt2.toISOString(),
        },
      ])
      expect(Post.find).toHaveBeenCalledWith({
        parentPostId: '1',
        isDeleted: false,
      })
    })
  })
})
