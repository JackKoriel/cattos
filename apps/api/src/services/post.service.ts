import { Post } from '../models/index.js'
import type { IPost } from '../interfaces/index.js'

export const postService = {
  async findAll(options: { limit?: number; skip?: number; authorId?: string } = {}) {
    const { limit = 20, skip = 0, authorId } = options
    const query: Record<string, unknown> = { isDeleted: false, visibility: 'public' }
    if (authorId) query.authorId = authorId

    return Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
  },

  async findById(id: string) {
    return Post.findOne({ _id: id, isDeleted: false }).lean()
  },

  async create(data: Partial<IPost>) {
    const post = new Post(data)
    return post.save()
  },

  async update(id: string, authorId: string, data: Partial<IPost>) {
    return Post.findOneAndUpdate(
      { _id: id, authorId, isDeleted: false },
      { ...data, isEdited: true, editedAt: new Date() },
      { new: true }
    ).lean()
  },

  async delete(id: string, authorId: string) {
    return Post.findOneAndUpdate({ _id: id, authorId }, { isDeleted: true }, { new: true }).lean()
  },

  async getByHashtag(hashtag: string, options: { limit?: number; skip?: number } = {}) {
    const { limit = 20, skip = 0 } = options
    return Post.find({ hashtags: hashtag.toLowerCase(), isDeleted: false, visibility: 'public' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  },

  async getReplies(postId: string, options: { limit?: number; skip?: number } = {}) {
    const { limit = 20, skip = 0 } = options
    return Post.find({ parentPostId: postId, isDeleted: false })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
  },
}
