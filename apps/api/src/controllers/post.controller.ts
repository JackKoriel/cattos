import type { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { postService } from '../services/index.js'
import { getBody, getQuery, getString, getStringArray, parsePagination } from '../utils/request.utils.js'

type PostVisibility = 'public' | 'followers' | 'mentioned' | 'private'

const isPostVisibility = (value: string): value is PostVisibility => {
  switch (value) {
    case 'public':
    case 'followers':
    case 'mentioned':
    case 'private':
      return true
    default:
      return false
  }
}

const listPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 100 })
    const query = getQuery(req)
    const authorIdParam = getString(query.authorId)

    let authorId: Types.ObjectId | undefined
    if (authorIdParam) {
      if (!Types.ObjectId.isValid(authorIdParam)) {
        res.status(400).json({ success: false, error: 'Invalid author id' })
        return
      }
      authorId = new Types.ObjectId(authorIdParam)
    }

    const posts = await postService.findAll({ limit, skip, authorId })
    res.json({ success: true, data: posts, count: posts.length })
  } catch (error) {
    next(error)
  }
}

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postService.findById(req.params.id)
    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' })
      return
    }
    res.json({ success: true, data: post })
  } catch (error) {
    next(error)
  }
}

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = getBody(req)
    const content = getString(body.content)
    const mediaUrls = getStringArray(body.mediaUrls) ?? []
    const visibilityRaw = getString(body.visibility)
    let visibility: PostVisibility | undefined
    if (visibilityRaw && isPostVisibility(visibilityRaw)) {
      visibility = visibilityRaw
    }

    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    if (!Types.ObjectId.isValid(req.user.id)) {
      res.status(400).json({ success: false, error: 'Invalid user id' })
      return
    }

    const authorId = new Types.ObjectId(req.user.id)

    if (!content && (!mediaUrls || mediaUrls.length === 0)) {
      res.status(400).json({ success: false, error: 'Content or media is required' })
      return
    }

    const hashtags = (content || '').match(/#\w+/g)?.map((tag: string) => tag.slice(1).toLowerCase()) || []
    const mentions = (content || '').match(/@\w+/g)?.map((m: string) => m.slice(1)) || []

    const post = await postService.create({
      authorId,
      content,
      mediaUrls,
      visibility: visibility ?? 'public',
      hashtags,
      mentions,
    })

    res.status(201).json({ success: true, data: post })
  } catch (error) {
    next(error)
  }
}

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = getBody(req)
    const content = getString(body.content)
    const visibilityRaw = getString(body.visibility)
    let visibility: PostVisibility | undefined
    if (visibilityRaw && isPostVisibility(visibilityRaw)) {
      visibility = visibilityRaw
    }
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, error: 'Invalid user id' })
      return
    }

    const authorId = new Types.ObjectId(userId)

    const hashtags = content?.match(/#\w+/g)?.map((tag: string) => tag.slice(1).toLowerCase())
    const mentions = content?.match(/@\w+/g)?.map((m: string) => m.slice(1))

    const post = await postService.update(req.params.id, authorId, {
      content,
      visibility,
      ...(hashtags && { hashtags }),
      ...(mentions && { mentions }),
    })

    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found or not authorized' })
      return
    }

    res.json({ success: true, data: post })
  } catch (error) {
    next(error)
  }
}

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
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

    const authorId = new Types.ObjectId(userId)

    const post = await postService.delete(req.params.id, authorId)
    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found or not authorized' })
      return
    }

    res.json({ success: true, message: 'Post deleted' })
  } catch (error) {
    next(error)
  }
}

const listPostsByHashtag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 100 })

    const posts = await postService.getByHashtag(req.params.hashtag, { limit, skip })
    res.json({ success: true, data: posts, count: posts.length })
  } catch (error) {
    next(error)
  }
}

const listRepliesForPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 100 })

    const replies = await postService.getReplies(req.params.id, { limit, skip })
    res.json({ success: true, data: replies, count: replies.length })
  } catch (error) {
    next(error)
  }
}

export const postController = {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  listPostsByHashtag,
  listRepliesForPost,
}

