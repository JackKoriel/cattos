import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Types } from 'mongoose'
import { bookmarkService } from '../bookmark.service.js'
import { Bookmark } from '../../models/index.js'

vi.mock('../../models/index.js', () => {
  const BookmarkCtor = vi.fn()

  ;(BookmarkCtor as unknown as { deleteOne: unknown }).deleteOne = vi.fn()
  ;(BookmarkCtor as unknown as { findOne: unknown }).findOne = vi.fn()
  ;(BookmarkCtor as unknown as { find: unknown }).find = vi.fn()

  return {
    Bookmark: BookmarkCtor,
  }
})

describe('Bookmark Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('addBookmark', () => {
    it('should create and save a bookmark', async () => {
      const postId = 'post-1'
      const userId = new Types.ObjectId()
      const saved = { _id: 'bm-1', postId, userId }

      const save = vi.fn().mockResolvedValue(saved)
      vi.mocked(
        Bookmark as unknown as (input: unknown) => { save: () => Promise<unknown> }
      ).mockImplementation(() => ({ save }))

      const result = await bookmarkService.addBookmark(postId, userId)

      expect(result).toEqual(saved)
      expect(Bookmark).toHaveBeenCalledWith({ postId, userId })
      expect(save).toHaveBeenCalled()
    })
  })

  describe('removeBookmark', () => {
    it('should delete one bookmark by postId and userId', async () => {
      const postId = 'post-1'
      const userId = new Types.ObjectId()

      const deleteOne = vi.fn().mockResolvedValue({ deletedCount: 1 })
      ;(Bookmark as unknown as { deleteOne: typeof deleteOne }).deleteOne = deleteOne

      const result = await bookmarkService.removeBookmark(postId, userId)

      expect(result).toEqual({ deletedCount: 1 })
      expect(deleteOne).toHaveBeenCalledWith({ postId, userId })
    })
  })

  describe('getBookmarkByPostAndUser', () => {
    it('should return a bookmark for postId and userId', async () => {
      const postId = 'post-1'
      const userId = new Types.ObjectId()
      const mockBookmark = { _id: 'bm-1', postId, userId }

      const findOne = vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockBookmark),
      })
      ;(Bookmark as unknown as { findOne: typeof findOne }).findOne = findOne

      const result = await bookmarkService.getBookmarkByPostAndUser(postId, userId)

      expect(result).toEqual(mockBookmark)
      expect(findOne).toHaveBeenCalledWith({ postId, userId })
    })
  })

  describe('listBookmarksForUser', () => {
    it('should list bookmarks sorted by createdAt desc with default pagination', async () => {
      const userId = new Types.ObjectId()
      const mockBookmarks = [{ _id: 'b1' }, { _id: 'b2' }]

      const sort = vi.fn().mockReturnThis()
      const skip = vi.fn().mockReturnThis()
      const limit = vi.fn().mockReturnThis()
      const lean = vi.fn().mockResolvedValue(mockBookmarks)

      const find = vi.fn().mockReturnValue({ sort, skip, limit, lean })
      ;(Bookmark as unknown as { find: typeof find }).find = find

      const result = await bookmarkService.listBookmarksForUser(userId)

      expect(result).toEqual(mockBookmarks)
      expect(find).toHaveBeenCalledWith({ userId })
      expect(sort).toHaveBeenCalledWith({ createdAt: -1 })
      expect(skip).toHaveBeenCalledWith(0)
      expect(limit).toHaveBeenCalledWith(20)
    })

    it('should apply provided pagination', async () => {
      const userId = new Types.ObjectId()
      const sortMock = vi.fn().mockReturnThis()
      const skipMock = vi.fn().mockReturnThis()
      const limitMock = vi.fn().mockReturnThis()

      const find = vi.fn().mockReturnValue({
        sort: sortMock,
        skip: skipMock,
        limit: limitMock,
        lean: vi.fn().mockResolvedValue([]),
      })
      ;(Bookmark as unknown as { find: typeof find }).find = find

      await bookmarkService.listBookmarksForUser(userId, { skip: 40, limit: 5 })

      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 })
      expect(skipMock).toHaveBeenCalledWith(40)
      expect(limitMock).toHaveBeenCalledWith(5)
    })
  })
})
