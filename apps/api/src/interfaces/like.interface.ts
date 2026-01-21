import { Types } from 'mongoose'

export interface ILike {
  _id: Types.ObjectId
  userId: Types.ObjectId
  postId: Types.ObjectId
  createdAt: Date
}
