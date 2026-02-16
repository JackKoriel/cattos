import React from 'react'
import { updateRegister, type UpdateRegisterPayload } from '@/services/register'
import { Box, Typography, Avatar, Button, Stack, useAppTheme } from '@cattos/ui'
import type { User } from '@cattos/shared'
import { PostFeed } from '@/features/posts/components'
import { useAuthUser } from '@/stores/authStore'
import { EditProfileModal } from '../../components'

export const ProfileScreenError = ({
  message,
  onGoHome,
}: {
  message: string
  onGoHome: () => void
}) => {
  return (
    <Box p={2}>
      <Typography color="error">{message}</Typography>
      <Button onClick={onGoHome}>Go Home</Button>
    </Box>
  )
}

export const ProfileScreenPresentation = ({ user }: { user: User }) => {
  const currentUser = useAuthUser()
  const isOwnProfile = currentUser && currentUser.username === user.username
  const [modalOpen, setModalOpen] = React.useState(false)
  const [profile, setProfile] = React.useState<User>(user)

  const handleEditProfile = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const handleSubmit = async (values: UpdateRegisterPayload) => {
    try {
      await updateRegister(profile.id, values)
      const { usersService } = await import('@/services/users')
      const updated = await usersService.getByUsername(profile.username)
      setProfile(updated)
      setModalOpen(false)
    } catch (err) {
      setModalOpen(false)
      console.warn('Failed to update profile', err)
    }
  }

  const appTheme = useAppTheme()

  return (
    <Box>
      <Box
        pb={3}
        m={2}
        bgcolor="white"
        borderRadius={appTheme.radii.radix2}
        boxShadow="0 4px 12px rgba(0,0,0,0.1)"
        sx={{ transition: 'box-shadow 0.2s' }}
      >
        <Box
          sx={{
            height: 150,
            borderTopLeftRadius: appTheme.radii.radix5,
            borderTopRightRadius: appTheme.radii.radix5,
            backgroundColor: profile.coverImage ? undefined : 'grey.300',
            backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : undefined,
            backgroundSize: profile.coverImage ? 'cover' : undefined,
            backgroundPosition: profile.coverImage ? 'center' : undefined,
          }}
        />
        <Box px={2} pb={2}>
          <Box mt={-6} mb={2} display="flex" justifyContent="space-between" alignItems="flex-end">
            <Avatar
              src={profile.avatar}
              alt={profile.username}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid',
                borderColor: 'background.paper',
              }}
            />
            {isOwnProfile && (
              <>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: appTheme.radii.radix6,
                    backgroundColor: '#ff9800',
                    color: 'white',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#f57c00',
                      boxShadow: 'none',
                    },
                  }}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
                <EditProfileModal
                  open={modalOpen}
                  initialValues={{
                    displayName: profile.displayName || '',
                    bio: profile.bio || '',
                    avatar: profile.avatar || '',
                    coverImage: profile.coverImage || '',
                    location: profile.location || '',
                    website: profile.website || '',
                  }}
                  onClose={handleCloseModal}
                  onSubmit={handleSubmit}
                />
              </>
            )}
          </Box>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {profile.displayName || profile.username}
          </Typography>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            @{profile.username}
          </Typography>
          <Typography
            variant="body1"
            paragraph
            color="text.primary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
            }}
          >
            {profile.bio || 'No bio yet.'}
          </Typography>

          <Box mb={1}>
            {profile.location && (
              <Typography variant="body2" color="text.secondary">
                {profile.location}
              </Typography>
            )}
            {profile.website && (
              <Typography variant="body2" color="primary">
                <a
                  href={
                    profile.website.startsWith('http')
                      ? profile.website
                      : `http://${profile.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {profile.website}
                </a>
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="text.primary">
              <b>0</b>{' '}
              <Box component="span" color="text.secondary">
                Following
              </Box>
            </Typography>
            <Typography variant="body2" color="text.primary">
              <b>0</b>{' '}
              <Box component="span" color="text.secondary">
                Followers
              </Box>
            </Typography>
          </Stack>
        </Box>
      </Box>
      <Box>
        <PostFeed authorId={profile.id} />
      </Box>
    </Box>
  )
}
