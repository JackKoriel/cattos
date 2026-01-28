import type { Request } from 'express'

export type UnknownRecord = Record<string, unknown>

export const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const getString = (value: unknown): string | undefined => {
  return typeof value === 'string' ? value : undefined
}

export const getStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined
  if (!value.every((item) => typeof item === 'string')) return undefined
  return value
}

export const getBody = (req: Request): UnknownRecord => {
  const raw: unknown = req.body
  return isRecord(raw) ? raw : {}
}

export const getQuery = (req: Request): UnknownRecord => {
  const raw: unknown = req.query
  return isRecord(raw) ? raw : {}
}

export const getCookies = (req: Request): UnknownRecord => {
  const raw: unknown = (req as unknown as { cookies?: unknown }).cookies
  return isRecord(raw) ? raw : {}
}

export const parseIntOr = (value: unknown, fallback: number): number => {
  const str = getString(value)
  if (!str) return fallback
  const n = Number.parseInt(str, 10)
  return Number.isFinite(n) ? n : fallback
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

export const parsePagination = (
  req: Request,
  options: { defaultLimit: number; maxLimit: number; defaultSkip?: number }
): { limit: number; skip: number } => {
  const query = getQuery(req)
  const limit = clamp(parseIntOr(query.limit, options.defaultLimit), 1, options.maxLimit)
  const skip = Math.max(0, parseIntOr(query.skip, options.defaultSkip ?? 0))
  return { limit, skip }
}

export const getCookieString = (req: Request, name: string): string | undefined => {
  const cookies = getCookies(req)
  return getString(cookies[name])
}
