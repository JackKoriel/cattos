import { Request, Response } from 'express'
import { getDbStatus } from '../config/db.js'

export const getHealth = (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Hello World from Cattos API! 🐱',
    db: getDbStatus(),
    timestamp: new Date().toISOString(),
  })
}
