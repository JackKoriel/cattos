import { Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId
  cognitoId?: string
  email: string
  username: string
  passwordHash?: string

  displayName: string
  avatar?: string
  coverImage?: string
  bio?: string
  location?: string
  website?: string
  dateOfBirth?: Date

  followersCount: number
  followingCount: number
  postsCount: number

  isVerified: boolean
  isPrivate: boolean
  isSuspended: boolean
  isDeactivated: boolean
  emailVerified: boolean

  language: string
  theme: 'light' | 'dark' | 'system'
  notificationPreferences: {
    email: boolean
    push: boolean
    likes: boolean
    comments: boolean
    follows: boolean
    mentions: boolean
    directMessages: boolean
  }

  lastLoginAt?: Date
  lastPostAt?: Date
  createdAt: Date
  updatedAt: Date
}
