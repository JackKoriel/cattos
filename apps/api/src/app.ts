import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/health.routes.js'
import { env } from './config/env.js'

const app = express()

app.use(
  cors(
    env.CORS_ORIGIN
      ? {
          origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
        }
      : undefined
  )
)
app.use(express.json())

app.use('/api/health', healthRoutes)

app.get('/', (_req, res) => {
  res.json({ message: 'Cattos API is running 🐱' })
})

export default app
