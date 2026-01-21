import { Types } from 'mongoose'

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'violence'
  | 'nudity'
  | 'misinformation'
  | 'impersonation'
  | 'copyright'
  | 'other'

export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed'

export interface IReport {
  _id: Types.ObjectId
  reporterId: Types.ObjectId
  reportedUserId?: Types.ObjectId
  reportedPostId?: Types.ObjectId
  reason: ReportReason
  description?: string
  status: ReportStatus
  reviewedBy?: Types.ObjectId
  reviewedAt?: Date
  actionTaken?: string
  createdAt: Date
  updatedAt: Date
}
