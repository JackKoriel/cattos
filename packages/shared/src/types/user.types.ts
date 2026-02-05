export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  coverImage?: string
  bio?: string
  location?: string
  website?: string
  createdAt: Date
}
