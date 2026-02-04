import { v2 as cloudinary } from 'cloudinary'
import { env } from './env.js'

const cloudName = env.CLOUDINARY_CLOUD_NAME ?? env.requireEnv('CLOUDINARY_CLOUD_NAME')
const apiKey = env.CLOUDINARY_API_KEY ?? env.requireEnv('CLOUDINARY_API_KEY')
const apiSecret = env.CLOUDINARY_API_SECRET ?? env.requireEnv('CLOUDINARY_API_SECRET')

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

export const cloudinaryFolders = {
  avatars: 'cattos/avatars',
  posts: 'cattos/posts',
} as const

export { cloudinary }
