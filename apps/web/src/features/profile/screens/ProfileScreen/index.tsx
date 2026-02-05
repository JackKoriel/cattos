import { useParams, useNavigate } from 'react-router-dom'
import { ProfileScreenError, ProfileScreenLoading, ProfileScreenPresentation } from './presentation'
import { useProfileByUsername } from '@/hooks/profile/useProfileByUsername'

export const ProfileScreen = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()

  const { user, loading, error } = useProfileByUsername(username)

  if (loading) return <ProfileScreenLoading />
  if (error || !user) {
    return <ProfileScreenError message={error ?? 'User not found'} onGoHome={() => navigate('/')} />
  }

  return <ProfileScreenPresentation user={user} onBack={() => navigate(-1)} />
}
