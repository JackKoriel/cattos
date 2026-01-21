import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/index.js'
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

app.get('/', (_req, res) => {
  res.json({ message: 'Cattos API is running 🐱' })
})

app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
