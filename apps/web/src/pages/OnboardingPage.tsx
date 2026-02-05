import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Alert,
  Avatar,
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { apiClient, handleApiError } from '@/api/client'
import { uploadAvatar } from '@/api/uploads.ts'

const steps = ['Profile', 'Avatar', 'First post']

const presetAvatars = [
  'https://placekitten.com/256/256',
  'https://placekitten.com/257/257',
  'https://placekitten.com/258/258',
  'https://placekitten.com/259/259',
] as const

type OnboardingValues = {
  displayName: string
  location: string
  avatarUrl: string
  firstPostContent: string
}

export const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user, setCurrentUser } = useAuth()
  const [activeStep, setActiveStep] = useState(0)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const finishIntentRef = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    }
  }, [avatarPreviewUrl])

  const validationSchema = useMemo(() => {
    if (activeStep === 0) {
      return Yup.object({
        displayName: Yup.string()
          .trim()
          .min(2, 'Too short')
          .max(40, 'Too long')
          .required('Required'),
        location: Yup.string().trim().max(60, 'Too long'),
      })
    }

    if (activeStep === 1) {
      return Yup.object({
        avatarUrl: Yup.string()
          .trim()
          .test('avatar-required', 'Pick an avatar or upload one', (value) => {
            if (avatarFile) return true
            return Boolean(value)
          })
          .test('avatar-url', 'Must be a valid URL', (value) => {
            if (avatarFile) return true
            if (!value) return false
            try {
              const u = new URL(value)
              return u.protocol === 'http:' || u.protocol === 'https:'
            } catch {
              return false
            }
          }),
      })
    }

    return Yup.object({
      firstPostContent: Yup.string().trim().max(500, 'Too long'),
    })
  }, [activeStep, avatarFile])

  const formik = useFormik<OnboardingValues>({
    initialValues: {
      displayName: user?.displayName || user?.username || '',
      location: user?.location || '',
      avatarUrl: user?.avatar || '',
      firstPostContent: '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, helpers) => {
      if (!user?.id) return

      if (activeStep !== steps.length - 1) {
        const errors = await helpers.validateForm()

        const currentStepFields: Array<keyof OnboardingValues> =
          activeStep === 0
            ? ['displayName', 'location']
            : activeStep === 1
              ? ['avatarUrl']
              : ['firstPostContent']

        const hasStepErrors = currentStepFields.some((field) => Boolean(errors[field]))
        if (hasStepErrors) {
          currentStepFields.forEach((field) => helpers.setFieldTouched(field, true, false))
          return
        }

        setActiveStep((s) => Math.min(s + 1, steps.length - 1))
        return
      }

      if (!finishIntentRef.current) {
        return
      }
      finishIntentRef.current = false

      setSubmitting(true)
      setError(null)
      try {
        let avatarUrl = values.avatarUrl

        if (avatarFile) {
          const uploaded = await uploadAvatar(avatarFile)
          avatarUrl = uploaded.url
        }

        const updated = await apiClient.patch(`/users/${user.id}`, {
          displayName: values.displayName.trim(),
          location: values.location.trim() || undefined,
          avatar: avatarUrl,
        })

        if (updated.data?.data) {
          setCurrentUser(updated.data.data)
        }

        // Optional first post
        if (values.firstPostContent.trim()) {
          await apiClient.post('/posts', {
            content: values.firstPostContent.trim(),
            visibility: 'public',
            mediaUrls: [],
          })
        }

        navigate('/', { replace: true })
      } catch (err) {
        const apiError = handleApiError(err)
        setError(apiError.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const goNext = async () => {
    const errors = await formik.validateForm()

    const currentStepFields: Array<keyof OnboardingValues> =
      activeStep === 0
        ? ['displayName', 'location']
        : activeStep === 1
          ? ['avatarUrl']
          : ['firstPostContent']

    const hasStepErrors = currentStepFields.some((field) => Boolean(errors[field]))

    if (hasStepErrors) {
      currentStepFields.forEach((field) => formik.setFieldTouched(field, true, false))
      return
    }

    setActiveStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const goBack = () => {
    setActiveStep((s) => Math.max(s - 1, 0))
  }

  if (!user) return null

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Finish setting up your profile
            </Typography>
            <Typography color="text.secondary">Just a couple quick steps.</Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            {activeStep === 0 && (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Display name"
                  name="displayName"
                  value={formik.values.displayName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                  helperText={formik.touched.displayName && formik.errors.displayName}
                />
                <TextField
                  fullWidth
                  label="Location (optional)"
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={avatarPreviewUrl ?? formik.values.avatarUrl}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    Upload avatar
                  </Button>
                  <input
                    ref={avatarInputRef}
                    hidden
                    type="file"
                    accept="image/*"
                    onClick={(e) => {
                      e.currentTarget.value = ''
                    }}
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0] ?? null

                      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)

                      setAvatarFile(file)
                      if (file) {
                        const preview = URL.createObjectURL(file)
                        setAvatarPreviewUrl(preview)
                        formik.setFieldValue('avatarUrl', '')
                      } else {
                        setAvatarPreviewUrl(null)
                      }
                    }}
                  />
                </Stack>

                <Typography variant="subtitle2" color="text.secondary">
                  Or pick one:
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {presetAvatars.map((url) => (
                    <Button
                      key={url}
                      type="button"
                      onClick={() => {
                        setAvatarFile(null)
                        if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
                        setAvatarPreviewUrl(null)
                        formik.setFieldValue('avatarUrl', url)
                      }}
                      sx={{ p: 1, borderRadius: 2, minWidth: 0 }}
                      variant={formik.values.avatarUrl === url ? 'contained' : 'outlined'}
                    >
                      <Avatar src={url} sx={{ width: 48, height: 48 }} />
                    </Button>
                  ))}
                </Stack>

                {formik.touched.avatarUrl && formik.errors.avatarUrl && (
                  <Typography color="error" variant="body2">
                    {formik.errors.avatarUrl}
                  </Typography>
                )}
              </Stack>
            )}

            {activeStep === 2 && (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Your first post (optional)"
                  name="firstPostContent"
                  value={formik.values.firstPostContent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstPostContent && Boolean(formik.errors.firstPostContent)}
                  helperText={formik.touched.firstPostContent && formik.errors.firstPostContent}
                />
              </Stack>
            )}

            <Stack direction="row" justifyContent="space-between" mt={4}>
              <Button type="button" disabled={activeStep === 0 || submitting} onClick={goBack}>
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{ minWidth: 140 }}
                  onClick={() => {
                    finishIntentRef.current = true
                  }}
                >
                  {submitting ? <CircularProgress size={22} color="inherit" /> : 'Finish'}
                </Button>
              ) : (
                <Button type="button" variant="contained" onClick={goNext} disabled={submitting}>
                  Next
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  )
}
