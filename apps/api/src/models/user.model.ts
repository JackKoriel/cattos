import { Schema, model } from 'mongoose'
import { OnboardingStatus } from '@cattos/shared'
import { IUser } from '../interfaces/user.interface.js'

const userSchema = new Schema<IUser>(
  {
    cognitoId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
    },
    passwordHash: { type: String, select: false },

    onboardingStatus: {
      type: String,
      enum: Object.values(OnboardingStatus),
      default: OnboardingStatus.InProgress,
    },

    displayName: { type: String, required: true, trim: true, maxlength: 50 },
    avatar: String,
    coverImage: String,
    bio: { type: String, maxlength: 160 },
    location: { type: String, maxlength: 100 },
    website: { type: String, maxlength: 200 },
    dateOfBirth: Date,

    followersCount: { type: Number, default: 0, min: 0 },
    followingCount: { type: Number, default: 0, min: 0 },
    postsCount: { type: Number, default: 0, min: 0 },

    isVerified: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },

    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      directMessages: { type: Boolean, default: true },
    },

    lastLoginAt: Date,
    lastPostAt: Date,
  },
  { timestamps: true }
)

userSchema.index({ createdAt: -1 })
userSchema.index({ followersCount: -1 })
userSchema.index({ username: 'text', displayName: 'text' })

export const User = model<IUser>('User', userSchema)
