import { User } from '../models/index.js'
import type { IUser } from '../interfaces/index.js'

export const userService = {
  async findAll(options: { limit?: number; skip?: number } = {}) {
    const { limit = 20, skip = 0 } = options
    return User.find({ isDeactivated: false, isSuspended: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  },

  async findById(id: string) {
    return User.findOne({ _id: id, isDeactivated: false }).lean()
  },

  async findByUsername(username: string) {
    return User.findOne({ username, isDeactivated: false }).lean()
  },

  async findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase() }).lean()
  },

  async create(data: Partial<IUser>) {
    const user = new User(data)
    return user.save()
  },

  async update(id: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(id, data, { new: true }).lean()
  },

  async search(query: string, options: { limit?: number; skip?: number } = {}) {
    const { limit = 20, skip = 0 } = options
    return User.find({
      $text: { $search: query },
      isDeactivated: false,
      isSuspended: false,
    })
      .skip(skip)
      .limit(limit)
      .lean()
  },
}
