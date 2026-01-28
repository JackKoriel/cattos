import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Types } from 'mongoose'
import { likeService } from '../like.service.js'
import { Like } from '../../models/index.js'

vi.mock('../../models/index.js', () => {
  const LikeCtor = vi.fn()

  ;(LikeCtor as unknown as { deleteOne: unknown }).deleteOne = vi.fn()
  ;(LikeCtor as unknown as { findOne: unknown }).findOne = vi.fn()
  ;(LikeCtor as unknown as { find: unknown }).find = vi.fn()

  return {
    Like: LikeCtor,
  }
})

describe('Like Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('addLike', () => {
    it('should create and save a like', async () => {
      const postId = 'post-1'
      const userId = new Types.ObjectId()
      const saved = { _id: 'like-1', postId, userId }

      const save = vi.fn().mockResolvedValue(saved)
      vi.mocked(
        Like as unknown as (input: unknown) => { save: () => Promise<unknown> }
      ).mockImplementation(() => ({ save }))

      const result = await likeService.addLike(postId, userId)

      expect(result).toEqual(saved)
      expect(Like).toHaveBeenCalledWith({ postId, userId })
      expect(save).toHaveBeenCalled()
    })
  })

  describe('removeLike', () => {
    it('should delete one like by postId and userId', async () => {
      const postId = 'post-1'
      const userId = new Types.ObjectId()

      const deleteOne = vi.fn().mockResolvedValue({ deletedCount: 1 })
      ;(Like as unknown as { deleteOne: typeof deleteOne }).deleteOne = deleteOne

      const result = await likeService.removeLike(postId, userId)

      expect(result).toEqual({ deletedCount: 1 })
      expect(deleteOne).toHaveBeenCalledWith({ postId, userId })
    })
  })

  describe('getLikeByPostAndUser', () => {
    it('should return a like for postId and userId', async () => {
      const postId = 'post-1'
      const userId = new Types.ObjectId()
      const mockLike = { _id: 'like-1', postId, userId }

      const findOne = vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockLike),
      })
      ;(Like as unknown as { findOne: typeof findOne }).findOne = findOne

      const result = await likeService.getLikeByPostAndUser(postId, userId)

      expect(result).toEqual(mockLike)
      expect(findOne).toHaveBeenCalledWith({ postId, userId })
    })
  })

  describe('listLikesForPost', () => {
    it('should list likes with default pagination', async () => {
      const postId = 'post-1'
      const mockLikes = [{ _id: 'l1' }, { _id: 'l2' }]

      const skip = vi.fn().mockReturnThis()
      const limit = vi.fn().mockReturnThis()
      const lean = vi.fn().mockResolvedValue(mockLikes)

      const find = vi.fn().mockReturnValue({ skip, limit, lean })
      ;(Like as unknown as { find: typeof find }).find = find

      const result = await likeService.listLikesForPost(postId)

      expect(result).toEqual(mockLikes)
      expect(find).toHaveBeenCalledWith({ postId })
      expect(skip).toHaveBeenCalledWith(0)
      expect(limit).toHaveBeenCalledWith(100)
    })

    it('should apply provided pagination', async () => {
      const postId = 'post-1'
      const skipMock = vi.fn().mockReturnThis()
      const limitMock = vi.fn().mockReturnThis()

      const find = vi.fn().mockReturnValue({
        skip: skipMock,
        limit: limitMock,
        lean: vi.fn().mockResolvedValue([]),
      })
      ;(Like as unknown as { find: typeof find }).find = find

      await likeService.listLikesForPost(postId, { skip: 50, limit: 10 })

      expect(skipMock).toHaveBeenCalledWith(50)
      expect(limitMock).toHaveBeenCalledWith(10)
    })
  })
})
