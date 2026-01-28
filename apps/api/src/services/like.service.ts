import { Like } from '../models/index.js'
import type { Types } from 'mongoose'

const addLike = async (postId: string, userId: Types.ObjectId) => {
  const like = new Like({ postId, userId })
  return like.save()
}

const removeLike = async (postId: string, userId: Types.ObjectId) => {
  return Like.deleteOne({ postId, userId })
}

const getLikeByPostAndUser = async (postId: string, userId: Types.ObjectId) => {
  return Like.findOne({ postId, userId }).lean()
}

const listLikesForPost = async (postId: string, options: { limit?: number; skip?: number } = {}) => {
  const { limit = 100, skip = 0 } = options
  return Like.find({ postId }).skip(skip).limit(limit).lean()
}

export const likeService = {
  addLike,
  removeLike,
  getLikeByPostAndUser,
  listLikesForPost,
}
