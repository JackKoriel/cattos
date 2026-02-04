import type { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { likeService, postService } from '../services/index.js'
import { parsePagination } from '../utils/request.utils.js'

const addLike = async (req: Request, res: Response, next: NextFunction) => {
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
    const existingLike = await likeService.getLikeByPostAndUser(postId, userObjectId)
    if (existingLike) {
      res.status(409).json({ success: false, error: 'Already liked' })
      return
    }

    const like = await likeService.addLike(postId, userObjectId)
    await postService.incrementLikesCount(postId)
    res.status(201).json({ success: true, data: like })
  } catch (error) {
    next(error)
  }
}

const removeLike = async (req: Request, res: Response, next: NextFunction) => {
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
    const result = await likeService.removeLike(postId, userObjectId)
    if (result.deletedCount > 0) {
      await postService.decrementLikesCount(postId)
    }
    res.json({ success: true, message: 'Like removed' })
  } catch (error) {
    next(error)
  }
}

const listLikesForPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId
    const { limit, skip } = parsePagination(req, { defaultLimit: 100, maxLimit: 500 })

    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ success: false, error: 'Invalid post id' })
      return
    }

    const likes = await likeService.listLikesForPost(postId, { limit, skip })
    res.json({ success: true, data: likes, count: likes.length })
  } catch (error) {
    next(error)
  }
}

export const likeController = {
  addLike,
  removeLike,
  listLikesForPost,
}
