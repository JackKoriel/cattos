import type { User } from '@cattos/shared'
import { usersService } from './users'
import { uploadAvatar } from './uploads'

export interface UpdateRegisterPayload {
  displayName: string
  bio: string
  avatar: string | null
  coverImage: string | null
  location: string
  website: string
}

export async function updateRegister(userId: string, values: UpdateRegisterPayload): Promise<User> {
  let avatarUrl = values.avatar
  let coverUrl = values.coverImage

  if (avatarUrl && avatarUrl.startsWith('blob:')) {
    const file = await fetch(avatarUrl)
      .then((r) => r.blob())
      .then((blob) => new File([blob], 'avatar.png', { type: blob.type }))
    const uploaded = await uploadAvatar(file)
    avatarUrl = uploaded.url
  }

  if (coverUrl && coverUrl.startsWith('blob:')) {
    const file = await fetch(coverUrl)
      .then((r) => r.blob())
      .then((blob) => new File([blob], 'cover.png', { type: blob.type }))
    const { uploadCover } = await import('./uploads')
    const uploaded = await uploadCover(file)
    coverUrl = uploaded.url
  }

  return usersService.update(userId, {
    displayName: values.displayName,
    bio: values.bio,
    avatar: avatarUrl === null ? undefined : avatarUrl,
    coverImage: coverUrl === null ? undefined : coverUrl,
    location: values.location,
    website: values.website,
  })
}
