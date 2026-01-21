import { Schema, model } from 'mongoose'
import { IReport } from '../interfaces/report.interface.js'

const reportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    reportedPostId: { type: Schema.Types.ObjectId, ref: 'Post' },
    reason: {
      type: String,
      enum: [
        'spam',
        'harassment',
        'hate_speech',
        'violence',
        'nudity',
        'misinformation',
        'impersonation',
        'copyright',
        'other',
      ],
      required: true,
    },
    description: { type: String, maxlength: 1000 },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'action_taken', 'dismissed'],
      default: 'pending',
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    actionTaken: String,
  },
  { timestamps: true }
)

reportSchema.index({ status: 1, createdAt: -1 })
reportSchema.index({ reportedUserId: 1, status: 1 })
reportSchema.index({ reportedPostId: 1, status: 1 })
reportSchema.index({ reporterId: 1, createdAt: -1 })

export const Report = model<IReport>('Report', reportSchema)
