import mongoose from 'mongoose'

import { env } from './env.js'

export const connectToDatabase = async (): Promise<void> => {
  if (!env.MONGODB_URI) {
    throw new Error('Missing required environment variable: MONGODB_URI')
  }

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000,
  })
}

export const getDbStatus = () => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const readyState = mongoose.connection.readyState
  const statusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  return {
    readyState,
    status: statusMap[readyState] ?? 'unknown',
  }
}
