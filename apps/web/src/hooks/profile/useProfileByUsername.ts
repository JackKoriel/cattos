import { useCallback, useEffect, useState } from 'react'
import type { User } from '@cattos/shared'
import { handleApiError } from '@/services/client'
import { usersService } from '@/services/users'

export const useProfileByUsername = (username: string | undefined) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!username) return

    setLoading(true)
    setError(null)

    try {
      const nextUser = await usersService.getByUsername(username)
      setUser(nextUser)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { user, loading, error, refresh }
}
