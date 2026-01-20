import { User } from './user.types'

export interface Post {
  id: string
  content: string
  imageUrl?: string
  authorId: string
  author?: User
  likes: number
  comments: number
  createdAt: Date
  updatedAt: Date
}
