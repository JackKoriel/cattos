import { Types } from 'mongoose'

export interface IMute {
  _id: Types.ObjectId
  muterId: Types.ObjectId
  mutedId: Types.ObjectId
  expiresAt?: Date
  createdAt: Date
}
