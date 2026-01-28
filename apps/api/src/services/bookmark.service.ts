import { Bookmark } from '../models/index.js'
import type { Types } from 'mongoose'

const addBookmark = async (postId: string, userId: Types.ObjectId) => {
  const bookmark = new Bookmark({ postId, userId })
  return bookmark.save()
}

const removeBookmark = async (postId: string, userId: Types.ObjectId) => {
  return Bookmark.deleteOne({ postId, userId })
}

const getBookmarkByPostAndUser = async (postId: string, userId: Types.ObjectId) => {
  return Bookmark.findOne({ postId, userId }).lean()
}

const listBookmarksForUser = async (userId: Types.ObjectId, options: { limit?: number; skip?: number } = {}) => {
  const { limit = 20, skip = 0 } = options
  return Bookmark.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
}

export const bookmarkService = {
  addBookmark,
  removeBookmark,
  getBookmarkByPostAndUser,
  listBookmarksForUser,
}
