import { OnboardingStatus, type User } from '@cattos/shared'

type DbUserLike = {
  _id: unknown
  email: string
  username: string
  displayName: string
  onboardingStatus?: unknown
  avatar?: unknown
  coverImage?: unknown
  bio?: unknown
  location?: unknown
  website?: unknown
  createdAt?: unknown
}

export const toUserDto = (user: DbUserLike): User => {
  const onboardingStatus =
    user.onboardingStatus === OnboardingStatus.Complete
      ? OnboardingStatus.Complete
      : OnboardingStatus.InProgress

  const createdAt =
    user.createdAt instanceof Date ? user.createdAt : new Date(String(user.createdAt))

  return {
    id: String(user._id),
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    onboardingStatus,
    avatar: typeof user.avatar === 'string' ? user.avatar : undefined,
    coverImage: typeof user.coverImage === 'string' ? user.coverImage : undefined,
    bio: typeof user.bio === 'string' ? user.bio : undefined,
    location: typeof user.location === 'string' ? user.location : undefined,
    website: typeof user.website === 'string' ? user.website : undefined,
    createdAt,
  }
}
