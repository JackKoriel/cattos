import { Types } from 'mongoose'

export interface IBookmark {
  _id: Types.ObjectId
  userId: Types.ObjectId
  postId: Types.ObjectId
  createdAt: Date
}
