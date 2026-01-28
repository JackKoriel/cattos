import app from './app.js'
import { connectToDatabase } from './config/db.js'
import { env } from './config/env.js'

const start = async () => {
  if (env.NODE_ENV !== 'test') {
    env.requireEnv('MONGODB_URI')
    env.requireEnv('JWT_ACCESS_SECRET')
  }

  await connectToDatabase()
  console.log('✅ Connected to MongoDB')

  app.listen(env.PORT, () => {
    console.log(`🚀 Cattos API server running on http://localhost:${env.PORT}`)
  })
}

start().catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})
