import { useParams, useNavigate } from 'react-router-dom'
import { ProfileScreenError, ProfileScreenPresentation } from './presentation'
import { ProfileSkeleton } from '@/features/profile/components'
import { useProfileByUsername } from '@/hooks/profile/useProfileByUsername'

export const ProfileScreen = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()

  const { user, loading, error } = useProfileByUsername(username)

  if (loading) return <ProfileSkeleton />
  if (error || !user) {
    return <ProfileScreenError message={error ?? 'User not found'} onGoHome={() => navigate('/')} />
  }

  return <ProfileScreenPresentation user={user} />
}
