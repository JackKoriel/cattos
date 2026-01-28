import { User } from '../models/index.js'
import type { IUser } from '../interfaces/index.js'

const findAll = async (options: { limit?: number; skip?: number } = {}) => {
  const { limit = 20, skip = 0 } = options
  return User.find({ isDeactivated: false, isSuspended: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
}

const findById = async (id: string) => {
  return User.findOne({ _id: id, isDeactivated: false }).lean()
}

const findByUsername = async (username: string) => {
  return User.findOne({ username, isDeactivated: false }).lean()
}

const findByEmail = async (email: string) => {
  return User.findOne({ email: email.toLowerCase() }).lean()
}

const create = async (data: Partial<IUser>) => {
  const user = new User(data)
  return user.save()
}

const update = async (id: string, data: Partial<IUser>) => {
  return User.findByIdAndUpdate(id, data, { new: true }).lean()
}

const search = async (query: string, options: { limit?: number; skip?: number } = {}) => {
  const { limit = 20, skip = 0 } = options
  return User.find({
    $text: { $search: query },
    isDeactivated: false,
    isSuspended: false,
  })
    .skip(skip)
    .limit(limit)
    .lean()
}

export const userService = {
  findAll,
  findById,
  findByUsername,
  findByEmail,
  create,
  update,
  search,
}
