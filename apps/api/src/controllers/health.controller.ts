import { Request, Response } from 'express'

export const getHealth = (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Hello World from Cattos API! 🐱',
    timestamp: new Date().toISOString(),
  })
}
