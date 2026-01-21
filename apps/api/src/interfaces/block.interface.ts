import { Types } from 'mongoose'

export interface IBlock {
  _id: Types.ObjectId
  blockerId: Types.ObjectId
  blockedId: Types.ObjectId
  createdAt: Date
}
