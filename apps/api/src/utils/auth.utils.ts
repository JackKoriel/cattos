import crypto from 'crypto'

export const authUtils = {
  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
  },

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  },
}
