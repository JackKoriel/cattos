import type { Request, Response, NextFunction } from 'express'
import { userService } from '../services/index.js'
import { getBody, getQuery, getString, parsePagination } from '../utils/request.utils.js'

const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 100 })

    const users = await userService.findAll({ limit, skip })
    res.json({ success: true, data: users, count: users.length })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
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
}

const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
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
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = getBody(req)
    const email = getString(body.email)
    const username = getString(body.username)
    const displayName = getString(body.displayName)
    const avatar = getString(body.avatar)
    const bio = getString(body.bio)

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
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id

    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    if (req.user.id !== userId) {
      res.status(403).json({ success: false, error: 'Forbidden' })
      return
    }

    const body = getBody(req)
    const displayName = getString(body.displayName)
    const bio = getString(body.bio)
    const avatar = getString(body.avatar)
    const coverImage = getString(body.coverImage)
    const location = getString(body.location)
    const website = getString(body.website)

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
}

const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = getQuery(req)
    const query = getString(queryParams.q)
    if (!query) {
      res.status(400).json({ success: false, error: 'Search query is required' })
      return
    }

    const { limit, skip } = parsePagination(req, { defaultLimit: 20, maxLimit: 100 })

    const users = await userService.search(query, { limit, skip })
    res.json({ success: true, data: users, count: users.length })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  listUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  searchUsers,
}
