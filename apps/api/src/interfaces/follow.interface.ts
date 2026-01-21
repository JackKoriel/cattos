import { Types } from 'mongoose'

export interface IFollow {
  _id: Types.ObjectId
  followerId: Types.ObjectId
  followingId: Types.ObjectId
  createdAt: Date
}
