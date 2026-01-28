import { Post } from '../models/index.js'
import type { IPost } from '../interfaces/index.js'
import type { Types } from 'mongoose'

const findAll = async (options: { limit?: number; skip?: number; authorId?: Types.ObjectId } = {}) => {
  const { limit = 20, skip = 0, authorId } = options
  const query: Record<string, unknown> = { isDeleted: false, visibility: 'public' }
  if (authorId) query.authorId = authorId

  return Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
}

const findById = async (id: string) => {
  return Post.findOne({ _id: id, isDeleted: false }).lean()
}

const create = async (data: Partial<IPost>) => {
  const post = new Post(data)
  return post.save()
}

const update = async (id: string, authorId: Types.ObjectId, data: Partial<IPost>) => {
  return Post.findOneAndUpdate(
    { _id: id, authorId, isDeleted: false },
    { ...data, isEdited: true, editedAt: new Date() },
    { new: true }
  ).lean()
}

const remove = async (id: string, authorId: Types.ObjectId) => {
  return Post.findOneAndUpdate({ _id: id, authorId }, { isDeleted: true }, { new: true }).lean()
}

const getByHashtag = async (hashtag: string, options: { limit?: number; skip?: number } = {}) => {
  const { limit = 20, skip = 0 } = options
  return Post.find({ hashtags: hashtag.toLowerCase(), isDeleted: false, visibility: 'public' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
}

const getReplies = async (postId: string, options: { limit?: number; skip?: number } = {}) => {
  const { limit = 20, skip = 0 } = options
  return Post.find({ parentPostId: postId, isDeleted: false })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean()
}

export const postService = {
  findAll,
  findById,
  create,
  update,
  delete: remove,
  getByHashtag,
  getReplies,
}
