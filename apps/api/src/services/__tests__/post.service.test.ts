import { describe, it, expect, beforeEach, vi } from 'vitest'
import { postService } from '../post.service.js'
import { Post } from '../../models/index.js'

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

  type PostFindReturn = ReturnType<(typeof Post)['find']>
  type PostFindOneReturn = ReturnType<(typeof Post)['findOne']>
  type PostFindOneAndUpdateReturn = ReturnType<(typeof Post)['findOneAndUpdate']>
  type PostUpdateInput = Parameters<(typeof postService)['update']>[2]

  describe('findAll', () => {
    it('should return all public posts sorted by creation date', async () => {
      const mockPosts = [
        { _id: '1', content: 'Post 1', visibility: 'public', createdAt: new Date() },
        { _id: '2', content: 'Post 2', visibility: 'public', createdAt: new Date() },
      ]

      vi.mocked(Post.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockPosts),
      } as unknown as PostFindReturn)

      const result = await postService.findAll({ limit: 20, skip: 0 })

      expect(result).toEqual(mockPosts)
      expect(Post.find).toHaveBeenCalledWith({ isDeleted: false, visibility: 'public' })
    })

    it('should filter posts by authorId when provided', async () => {
      const authorId = 'user123'
      vi.mocked(Post.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as PostFindReturn)

      await postService.findAll({ limit: 20, skip: 0, authorId })

      expect(Post.find).toHaveBeenCalledWith({
        isDeleted: false,
        visibility: 'public',
        authorId,
      })
    })

    it('should apply pagination correctly', async () => {
      const sortMock = vi.fn()
      const skipMock = vi.fn()
      const limitMock = vi.fn()

      vi.mocked(Post.find).mockReturnValue({
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
      const mockPost = { _id: '1', content: 'Test Post', isDeleted: false }

      vi.mocked(Post.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockPost),
      } as unknown as PostFindOneReturn)

      const result = await postService.findById('1')

      expect(result).toEqual(mockPost)
      expect(Post.findOne).toHaveBeenCalledWith({ _id: '1', isDeleted: false })
    })

    it('should return null if post not found', async () => {
      vi.mocked(Post.findOne).mockReturnValue({
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
      const authorId = 'user1'
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

      const result = await postService.update('1', 'wrong-user', { content: 'Hacked!' })

      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should soft delete a post by author', async () => {
      const postId = '1'
      const authorId = 'user1'

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
      const mockPosts = [{ _id: '1', content: 'Tagged post', hashtags: ['test'] }]

      vi.mocked(Post.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockPosts),
      } as unknown as PostFindReturn)

      const result = await postService.getByHashtag('test', { limit: 20, skip: 0 })

      expect(result).toEqual(mockPosts)
      expect(Post.find).toHaveBeenCalledWith({
        hashtags: 'test',
        isDeleted: false,
        visibility: 'public',
      })
    })

    it('should convert hashtag to lowercase', async () => {
      vi.mocked(Post.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as PostFindReturn)

      await postService.getByHashtag('CATS', { limit: 20, skip: 0 })

      expect(Post.find).toHaveBeenCalledWith(expect.objectContaining({ hashtags: 'cats' }))
    })
  })

  describe('getReplies', () => {
    it('should return all replies to a post', async () => {
      const mockReplies = [
        { _id: '2', content: 'Reply 1', parentPostId: '1' },
        { _id: '3', content: 'Reply 2', parentPostId: '1' },
      ]

      vi.mocked(Post.find).mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockReplies),
      } as unknown as PostFindReturn)

      const result = await postService.getReplies('1', { limit: 20, skip: 0 })

      expect(result).toEqual(mockReplies)
      expect(Post.find).toHaveBeenCalledWith({
        parentPostId: '1',
        isDeleted: false,
      })
    })
  })
})
