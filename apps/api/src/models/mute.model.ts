import { Schema, model } from 'mongoose'
import { IMute } from '../interfaces/mute.interface.js'

const muteSchema = new Schema<IMute>(
  {
    muterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mutedId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

muteSchema.index({ muterId: 1, mutedId: 1 }, { unique: true })
muteSchema.index({ muterId: 1 })
muteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Mute = model<IMute>('Mute', muteSchema)
