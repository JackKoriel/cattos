import type { Types } from 'mongoose'

export interface IRefreshToken {
  userId: Types.ObjectId
  tokenHash: string
  expiresAt: Date
  revokedAt?: Date
  replacedByTokenHash?: string
}
