import type { Request, Response, NextFunction } from 'express'
import { postService } from '../services/index.js'

export const postController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const skip = parseInt(req.query.skip as string) || 0
      const authorId = req.query.authorId as string | undefined

      const posts = await postService.findAll({ limit, skip, authorId })
      res.json({ success: true, data: posts, count: posts.length })
    } catch (error) {
      next(error)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
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
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, mediaUrls, visibility } = req.body

      if (!content && (!mediaUrls || mediaUrls.length === 0)) {
        res.status(400).json({ success: false, error: 'Content or media is required' })
        return
      }

      const hashtags =
        (content || '').match(/#\w+/g)?.map((tag: string) => tag.slice(1).toLowerCase()) || []
      const mentions = (content || '').match(/@\w+/g)?.map((m: string) => m.slice(1)) || []

      const post = await postService.create({
        authorId: req.body.authorId, // TODO: Get from auth middleware
        content,
        mediaUrls: mediaUrls || [],
        visibility: visibility || 'public',
        hashtags,
        mentions,
      })

      res.status(201).json({ success: true, data: post })
    } catch (error) {
      next(error)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, visibility } = req.body
      const authorId = req.body.authorId // TODO: Get from auth middleware

      if (!authorId) {
        res.status(401).json({ success: false, error: 'Unauthorized' })
        return
      }

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
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const authorId = req.body.authorId // TODO: Get from auth middleware

      if (!authorId) {
        res.status(401).json({ success: false, error: 'Unauthorized' })
        return
      }

      const post = await postService.delete(req.params.id, authorId)
      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found or not authorized' })
        return
      }

      res.json({ success: true, message: 'Post deleted' })
    } catch (error) {
      next(error)
    }
  },

  async getByHashtag(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const skip = parseInt(req.query.skip as string) || 0

      const posts = await postService.getByHashtag(req.params.hashtag, { limit, skip })
      res.json({ success: true, data: posts, count: posts.length })
    } catch (error) {
      next(error)
    }
  },

  async getReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const skip = parseInt(req.query.skip as string) || 0

      const replies = await postService.getReplies(req.params.id, { limit, skip })
      res.json({ success: true, data: replies, count: replies.length })
    } catch (error) {
      next(error)
    }
  },
}
