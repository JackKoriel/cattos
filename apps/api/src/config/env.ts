import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()

const thisFilePath = fileURLToPath(import.meta.url)
const thisDir = path.dirname(thisFilePath)
const apiRoot = path.resolve(thisDir, '..', '..')
const repoRoot = path.resolve(apiRoot, '..', '..')

dotenv.config({ path: path.join(apiRoot, '.env') })
dotenv.config({ path: path.join(repoRoot, '.env') })

// Allow `.env.local` to override `.env` for local dev.
dotenv.config({ path: path.join(apiRoot, '.env.local'), override: true })
dotenv.config({ path: path.join(repoRoot, '.env.local'), override: true })

const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  MONGODB_URI: process.env.MONGODB_URI ? process.env.MONGODB_URI : undefined,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
  REFRESH_TOKEN_EXPIRES_DAYS: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? 30),
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS ?? 12),
  REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'refreshToken',
  COOKIE_SECURE:
    process.env.COOKIE_SECURE !== undefined
      ? process.env.COOKIE_SECURE === 'true'
      : (process.env.NODE_ENV ?? 'development') === 'production',
  requireEnv,
}
