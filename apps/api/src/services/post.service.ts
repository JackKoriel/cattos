import { Post } from '../models/index.js'
import type { IPost } from '../interfaces/index.js'
import type { Types } from 'mongoose'
import type { Post as SharedPost } from '@cattos/shared'

type PopulatedAuthor = {
  _id: Types.ObjectId
  username: string
  displayName: string
  avatar?: string
}

const toIdString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (value && typeof value === 'object') return String(value)
  return undefined
}

const toIsoString = (value: unknown): string => {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') return value
  if (typeof value === 'number') return new Date(value).toISOString()
  if (value && typeof value === 'object') {
    const asString = String(value)
    const parsed = new Date(asString)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }
  return new Date(0).toISOString()
}

const stringArrayOrUndefined = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const onlyStrings = value.filter((v) => typeof v === 'string')
  return onlyStrings.length === value.length ? onlyStrings : undefined
}

const clampNonNegativeNumber = (value: unknown) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  return Math.max(0, value)
}

const normalizePostShallow = (post: Record<string, unknown>): SharedPost => {
  const safeCounters = {
    likesCount: clampNonNegativeNumber(post.likesCount),
    bookmarksCount: clampNonNegativeNumber(post.bookmarksCount),
    commentsCount: clampNonNegativeNumber(post.commentsCount),
    repostsCount: clampNonNegativeNumber(post.repostsCount),
  }

  const id = toIdString(post._id) ?? ''
  const parentPostId = toIdString(post.parentPostId)
  const rootPostId = toIdString(post.rootPostId)
  const repostOfId = toIdString(post.repostOfId)

  const createdAt = toIsoString(post.createdAt)
  const updatedAt = toIsoString(post.updatedAt)

  const content = typeof post.content === 'string' ? post.content : ''
  const mediaUrls = stringArrayOrUndefined(post.mediaUrls)

  const isRepost = typeof post.isRepost === 'boolean' ? post.isRepost : undefined
  const visibility =
    typeof post.visibility === 'string' ? (post.visibility as SharedPost['visibility']) : undefined

  const hashtags = stringArrayOrUndefined(post.hashtags)
  const mentions = stringArrayOrUndefined(post.mentions)

  const authorField = post.authorId
  if (authorField && typeof authorField === 'object') {
    const author = authorField as PopulatedAuthor
    const authorId = String(author._id)

    return {
      id,
      authorId,
      author: {
        id: authorId,
        username: author.username,
        displayName: author.displayName,
        avatar: author.avatar,
      },
      content,
      ...(mediaUrls ? { mediaUrls } : null),
      ...(parentPostId ? { parentPostId } : null),
      ...(rootPostId ? { rootPostId } : null),
      ...(repostOfId ? { repostOfId } : null),
      ...(isRepost !== undefined ? { isRepost } : null),
      ...(visibility ? { visibility } : null),
      ...(hashtags ? { hashtags } : null),
      ...(mentions ? { mentions } : null),
      ...safeCounters,
      createdAt,
      updatedAt,
    }
  }

  const authorId = toIdString(post.authorId) ?? ''
  return {
    id,
    authorId,
    content,
    ...(mediaUrls ? { mediaUrls } : null),
    ...(parentPostId ? { parentPostId } : null),
    ...(rootPostId ? { rootPostId } : null),
    ...(repostOfId ? { repostOfId } : null),
    ...(isRepost !== undefined ? { isRepost } : null),
    ...(visibility ? { visibility } : null),
    ...(hashtags ? { hashtags } : null),
    ...(mentions ? { mentions } : null),
    ...safeCounters,
    createdAt,
    updatedAt,
  }
}

const normalizePost = (post: Record<string, unknown>): SharedPost => {
  const repostField = post.repostOfId
  if (repostField && typeof repostField === 'object' && '_id' in repostField) {
    const repostObj = repostField as Record<string, unknown>
    const repostIdValue = repostObj._id
    const repostId = typeof repostIdValue === 'string' ? repostIdValue : String(repostIdValue)

    const base = normalizePostShallow({ ...post, repostOfId: repostId })
    return {
      ...base,
      repostOf: normalizePostShallow(repostObj),
    }
  }

  return normalizePostShallow(post)
}

const findAll = async (
  options: { limit?: number; skip?: number; authorId?: Types.ObjectId } = {}
): Promise<SharedPost[]> => {
  const { limit = 20, skip = 0, authorId } = options
  const query: Record<string, unknown> = {
    isDeleted: false,
    visibility: 'public',
    parentPostId: { $exists: false }, // Exclude replies from main feed
  }
  if (authorId) query.authorId = authorId

  const posts = await Post.find(query)
    .populate('authorId', '_id username displayName avatar')
    .populate({
      path: 'repostOfId',
      populate: { path: 'authorId', select: '_id username displayName avatar' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return posts.map((p) => normalizePost(p as unknown as Record<string, unknown>))
}

const findById = async (id: string): Promise<SharedPost | null> => {
  const post = await Post.findOne({ _id: id, isDeleted: false })
    .populate('authorId', '_id username displayName avatar')
    .populate({
      path: 'repostOfId',
      populate: { path: 'authorId', select: '_id username displayName avatar' },
    })
    .lean()
  return post ? normalizePost(post as unknown as Record<string, unknown>) : null
}

const create = async (data: Partial<IPost>): Promise<SharedPost> => {
  const post = new Post(data)
  const saved = await post.save()

  const hydrated = await findById(saved._id.toString())
  if (hydrated) return hydrated

  return normalizePost(saved.toObject() as unknown as Record<string, unknown>)
}

const update = async (
  id: string,
  authorId: Types.ObjectId,
  data: Partial<IPost>
): Promise<SharedPost | null> => {
  const updated = await Post.findOneAndUpdate(
    { _id: id, authorId, isDeleted: false },
    { ...data, isEdited: true, editedAt: new Date() },
    { new: true }
  ).lean()

  if (!updated) return null
  return findById(id)
}

const remove = async (id: string, authorId: Types.ObjectId) => {
  return Post.findOneAndUpdate({ _id: id, authorId }, { isDeleted: true }, { new: true }).lean()
}

const getByHashtag = async (
  hashtag: string,
  options: { limit?: number; skip?: number } = {}
): Promise<SharedPost[]> => {
  const { limit = 20, skip = 0 } = options
  const posts = await Post.find({
    hashtags: hashtag.toLowerCase(),
    isDeleted: false,
    visibility: 'public',
  })
    .populate('authorId', '_id username displayName avatar')
    .populate({
      path: 'repostOfId',
      populate: { path: 'authorId', select: '_id username displayName avatar' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return posts.map((p) => normalizePost(p as unknown as Record<string, unknown>))
}

const getReplies = async (
  postId: string,
  options: { limit?: number; skip?: number } = {}
): Promise<SharedPost[]> => {
  const { limit = 20, skip = 0 } = options
  const posts = await Post.find({ parentPostId: postId, isDeleted: false })
    .populate('authorId', '_id username displayName avatar')
    .populate({
      path: 'repostOfId',
      populate: { path: 'authorId', select: '_id username displayName avatar' },
    })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return posts.map((p) => normalizePost(p as unknown as Record<string, unknown>))
}

const incrementLikesCount = async (postId: string) => {
  return Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } })
}

const decrementLikesCount = async (postId: string) => {
  return Post.findOneAndUpdate(
    { _id: postId, likesCount: { $gt: 0 } },
    { $inc: { likesCount: -1 } }
  )
}

const incrementBookmarksCount = async (postId: string) => {
  return Post.findByIdAndUpdate(postId, { $inc: { bookmarksCount: 1 } })
}

const decrementBookmarksCount = async (postId: string) => {
  return Post.findOneAndUpdate(
    { _id: postId, bookmarksCount: { $gt: 0 } },
    { $inc: { bookmarksCount: -1 } }
  )
}

const incrementCommentsCount = async (postId: string) => {
  return Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } })
}

const decrementCommentsCount = async (postId: string) => {
  return Post.findOneAndUpdate(
    { _id: postId, commentsCount: { $gt: 0 } },
    { $inc: { commentsCount: -1 } }
  )
}

const incrementRepostsCount = async (postId: string) => {
  return Post.findByIdAndUpdate(postId, { $inc: { repostsCount: 1 } })
}

const decrementRepostsCount = async (postId: string) => {
  return Post.findOneAndUpdate(
    { _id: postId, repostsCount: { $gt: 0 } },
    { $inc: { repostsCount: -1 } }
  )
}

export const postService = {
  findAll,
  findById,
  create,
  update,
  delete: remove,
  getByHashtag,
  getReplies,
  incrementLikesCount,
  decrementLikesCount,
  incrementBookmarksCount,
  decrementBookmarksCount,
  incrementCommentsCount,
  decrementCommentsCount,
  incrementRepostsCount,
  decrementRepostsCount,
}
