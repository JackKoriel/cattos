import { Schema, model } from 'mongoose'
import type { IRefreshToken } from '../interfaces/refreshToken.interface.js'

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: Date,
    replacedByTokenHash: String,
  },
  { timestamps: true }
)

refreshTokenSchema.index({ userId: 1, expiresAt: -1 })

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema)
