import { User } from '../models/index.js'
import type { IUser } from '../interfaces/index.js'
import type { User as UserDto } from '@cattos/shared'
import { toUserDto } from '../mappers/user.mapper.js'

const mapNullable = <T, R>(value: T | null, mapper: (input: T) => R): R | null =>
  value ? mapper(value) : null

const findAll = async (options: { limit?: number; skip?: number } = {}): Promise<UserDto[]> => {
  const { limit = 20, skip = 0 } = options
  const users = await User.find({ isDeactivated: false, isSuspended: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  return users.map(toUserDto)
}

const findById = async (id: string): Promise<UserDto | null> => {
  const user = await User.findOne({ _id: id, isDeactivated: false }).lean()
  return mapNullable(user, toUserDto)
}

const findByUsername = async (username: string): Promise<UserDto | null> => {
  const user = await User.findOne({ username, isDeactivated: false }).lean()
  return mapNullable(user, toUserDto)
}

const findByEmail = async (email: string): Promise<UserDto | null> => {
  const user = await User.findOne({ email: email.toLowerCase() }).lean()
  return mapNullable(user, toUserDto)
}

const create = async (data: Partial<IUser>): Promise<UserDto> => {
  const user = new User(data)
  const saved = await user.save()
  return toUserDto(saved.toObject())
}

const update = async (id: string, data: Partial<IUser>): Promise<UserDto | null> => {
  const user = await User.findByIdAndUpdate(id, data, { new: true }).lean()
  return mapNullable(user, toUserDto)
}

const search = async (
  query: string,
  options: { limit?: number; skip?: number } = {}
): Promise<UserDto[]> => {
  const { limit = 20, skip = 0 } = options
  const users = await User.find({
    $text: { $search: query },
    isDeactivated: false,
    isSuspended: false,
  })
    .skip(skip)
    .limit(limit)
    .lean()

  return users.map(toUserDto)
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
