import app from './app.js'
import { connectToDatabase } from './config/db.js'
import { env } from './config/env.js'

const start = async () => {
  if (env.MONGODB_URI) {
    await connectToDatabase()
    console.log('✅ Connected to MongoDB')
  } else {
    console.warn('⚠️  MONGODB_URI not set; starting API without DB connection')
  }

  app.listen(env.PORT, () => {
    console.log(`🚀 Cattos API server running on http://localhost:${env.PORT}`)
  })
}

start().catch((error) => {
  console.error('❌ Failed to start server:', error)
  process.exit(1)
})
