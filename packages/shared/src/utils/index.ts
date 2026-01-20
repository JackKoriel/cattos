import axios, { AxiosInstance, AxiosError } from 'axios'
import { ApiError } from '../types'

const createApiClient = (baseURL: string): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    return {
      code: axiosError.code || 'UNKNOWN_ERROR',
      message: axiosError.message || 'An error occurred',
      statusCode: axiosError.response?.status || 500,
    }
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  }
}

export { createApiClient, handleApiError }
