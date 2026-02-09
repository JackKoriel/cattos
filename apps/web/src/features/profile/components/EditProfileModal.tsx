import React, { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
  CloseIcon,
  PawLoader,
} from '@cattos/ui'
import { useFormik } from 'formik'

interface EditProfileModalProps {
  open: boolean
  initialValues: {
    displayName: string
    bio: string
    avatar: string
    coverImage: string
    location: string
    website: string
  }
  onClose: () => void
  onSubmit: (values: EditProfileModalProps['initialValues']) => Promise<void>
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialValues.avatar || null)
  const [coverPreview, setCoverPreview] = useState<string | null>(initialValues.coverImage || null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values)
      onClose()
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setAvatarPreview(initialValues.avatar || null)
    setCoverPreview(initialValues.coverImage || null)
    onClose()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
      formik.setFieldValue('avatar', url)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    formik.setFieldValue('avatar', null)
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCoverPreview(url)
      formik.setFieldValue('coverImage', url)
    }
  }

  const handleRemoveCover = () => {
    setCoverPreview(null)
    formik.setFieldValue('coverImage', null)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogContent
        sx={{
          bgcolor: 'white',
          p: 4,
          borderRadius: 3,
          width: '100%',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Edit Profile
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Display Name
              </Typography>
              <TextField
                name="displayName"
                value={formik.values.displayName}
                onChange={formik.handleChange}
                fullWidth
                placeholder="Enter your display name"
                sx={{ mb: 0 }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Bio
              </Typography>
              <TextField
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                multiline
                rows={3}
                fullWidth
                placeholder="Tell us about yourself"
                sx={{ mb: 0 }}
              />
              <IconButton
                onClick={handleClose}
                sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Avatar
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                <Avatar src={avatarPreview || undefined} sx={{ width: 64, height: 64 }} />
                <Box display="flex" flexDirection="row" gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => avatarInputRef.current?.click()}
                    sx={{ minWidth: 120 }}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    onClick={handleRemoveAvatar}
                    sx={{ minWidth: 80 }}
                    disabled={!avatarPreview}
                  >
                    Remove
                  </Button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </Box>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Cover Image
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                {coverPreview ? (
                  <Box
                    component="img"
                    src={coverPreview}
                    alt="Cover Preview"
                    sx={{
                      width: 120,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid #eee',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 120,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      borderRadius: 2,
                      border: '1px solid #eee',
                      color: 'grey.400',
                      fontSize: 32,
                    }}
                  >
                    <span role="img" aria-label="No cover">
                      🖼️
                    </span>
                  </Box>
                )}
                <Box display="flex" flexDirection="row" gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => coverInputRef.current?.click()}
                    sx={{ minWidth: 120 }}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    onClick={handleRemoveCover}
                    sx={{ minWidth: 80 }}
                    disabled={!coverPreview}
                  >
                    Remove
                  </Button>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverChange}
                  />
                </Box>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Location
              </Typography>
              <TextField
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                fullWidth
                placeholder="Where are you located?"
                sx={{ mb: 0 }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Website
              </Typography>
              <TextField
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                fullWidth
                placeholder="Your website or link"
                sx={{ mb: 0 }}
              />
            </Box>
            <Button
              type="submit"
              variant="orange"
              fullWidth
              disabled={formik.isSubmitting}
              sx={{ mt: 2 }}
            >
              {formik.isSubmitting ? <PawLoader size="xSmall" color="inherit" /> : 'Save Changes'}
            </Button>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
