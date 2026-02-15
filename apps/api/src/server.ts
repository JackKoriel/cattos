import app from './app.js'
import { connectToDatabase } from './config/db.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

const start = async () => {
  if (env.NODE_ENV !== 'test') {
    env.requireEnv('MONGODB_URI')
    env.requireEnv('JWT_ACCESS_SECRET')
  }

  await connectToDatabase()
  logger.info('✅ Connected to MongoDB')

  app.listen(env.PORT, () => {
    logger.info(`🚀 Cattos API server running on http://localhost:${env.PORT}`)
  })
}

start().catch((error) => {
  logger.error('❌ Failed to start server', error)
  process.exit(1)
})
