import type { Request, Response, NextFunction } from 'express'
import { userService } from '../services/index.js'

export const userController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const skip = parseInt(req.query.skip as string) || 0

      const users = await userService.findAll({ limit, skip })
      res.json({ success: true, data: users, count: users.length })
    } catch (error) {
      next(error)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.findById(req.params.id)
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' })
        return
      }
      res.json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  },

  async getByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.findByUsername(req.params.username)
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' })
        return
      }
      res.json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, displayName, avatar, bio } = req.body

      if (!email || !username) {
        res.status(400).json({ success: false, error: 'Email and username are required' })
        return
      }

      const existingEmail = await userService.findByEmail(email)
      if (existingEmail) {
        res.status(409).json({ success: false, error: 'Email already in use' })
        return
      }

      const existingUsername = await userService.findByUsername(username)
      if (existingUsername) {
        res.status(409).json({ success: false, error: 'Username already taken' })
        return
      }

      const user = await userService.create({
        email: email.toLowerCase(),
        username,
        displayName: displayName || username,
        avatar,
        bio,
      })

      res.status(201).json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id // TODO: Verify from auth middleware

      const { displayName, bio, avatar, coverImage, location, website } = req.body

      const user = await userService.update(userId, {
        displayName,
        bio,
        avatar,
        coverImage,
        location,
        website,
      })

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' })
        return
      }

      res.json({ success: true, data: user })
    } catch (error) {
      next(error)
    }
  },

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string
      if (!query) {
        res.status(400).json({ success: false, error: 'Search query is required' })
        return
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100)
      const skip = parseInt(req.query.skip as string) || 0

      const users = await userService.search(query, { limit, skip })
      res.json({ success: true, data: users, count: users.length })
    } catch (error) {
      next(error)
    }
  },
}
