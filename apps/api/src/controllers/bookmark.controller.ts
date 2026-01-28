import type { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { bookmarkService } from '../services/index.js'
import { parsePagination } from '../utils/request.utils.js'

const addBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    const postId = req.params.postId

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, error: 'Invalid user id' })
      return
    }

    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ success: false, error: 'Invalid post id' })
      return
    }

    const userObjectId = new Types.ObjectId(userId)
    const existingBookmark = await bookmarkService.getBookmarkByPostAndUser(postId, userObjectId)
    if (existingBookmark) {
      res.status(409).json({ success: false, error: 'Already bookmarked' })
      return
    }

    const bookmark = await bookmarkService.addBookmark(postId, userObjectId)
    res.status(201).json({ success: true, data: bookmark })
  } catch (error) {
    next(error)
  }
}

const removeBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    const postId = req.params.postId

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, error: 'Invalid user id' })
      return
    }

    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ success: false, error: 'Invalid post id' })
      return
    }

    const userObjectId = new Types.ObjectId(userId)
    await bookmarkService.removeBookmark(postId, userObjectId)
    res.json({ success: true, message: 'Bookmark removed' })
  } catch (error) {
    next(error)
  }
}

const listMyBookmarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, error: 'Invalid user id' })
      return
    }

    const { limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 100 })
    const userObjectId = new Types.ObjectId(userId)

    const bookmarks = await bookmarkService.listBookmarksForUser(userObjectId, { limit, skip })
    res.json({ success: true, data: bookmarks, count: bookmarks.length })
  } catch (error) {
    next(error)
  }
}

export const bookmarkController = {
  addBookmark,
  removeBookmark,
  listMyBookmarks,
}
