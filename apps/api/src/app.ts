import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/health.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/health', healthRoutes)

app.get('/', (_req, res) => {
  res.json({ message: 'Cattos API is running 🐱' })
})

export default app
