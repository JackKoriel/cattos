import { Types } from 'mongoose'

export interface IHashtag {
  _id: Types.ObjectId
  tag: string
  postsCount: number
  lastUsedAt: Date
  createdAt: Date
  updatedAt: Date
}
