import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import type { FormikProps } from 'formik'
import type { FocusEventHandler, MouseEventHandler, RefObject } from 'react'

type OnboardingValues = {
  username: string
  displayName: string
  location: string
  avatarUrl: string
  firstPostContent: string
}

export type OnboardingScreenPresentationProps = {
  steps: string[]
  presetAvatars: readonly string[]
  activeStep: number
  submitting: boolean
  error: string | null
  avatarPreviewUrl: string | null
  avatarInputRef: RefObject<HTMLInputElement>
  formik: FormikProps<OnboardingValues>
  usernameAvailability: 'idle' | 'checking' | 'available' | 'taken' | 'error'
  usernameAvailabilityMessage: string | null
  onUsernameBlur: FocusEventHandler<HTMLInputElement>
  onBack: () => void
  onNext: () => void
  onUploadAvatarClick: () => void
  onAvatarInputClick: MouseEventHandler<HTMLInputElement>
  onAvatarFileSelected: (file: File | null) => void
  onPickPresetAvatar: (url: string) => void
  onFinishIntent: () => void
}

export const OnboardingScreenPresentation = ({
  steps,
  presetAvatars,
  activeStep,
  submitting,
  error,
  avatarPreviewUrl,
  avatarInputRef,
  formik,
  usernameAvailability,
  usernameAvailabilityMessage,
  onUsernameBlur,
  onBack,
  onNext,
  onUploadAvatarClick,
  onAvatarInputClick,
  onAvatarFileSelected,
  onPickPresetAvatar,
  onFinishIntent,
}: OnboardingScreenPresentationProps) => {
  const usernameStatusAdornment =
    usernameAvailability === 'checking' ? (
      <CircularProgress size={18} />
    ) : usernameAvailability === 'available' ? (
      <CheckCircleOutlineIcon fontSize="small" color="success" />
    ) : usernameAvailability === 'taken' || usernameAvailability === 'error' ? (
      <CancelOutlinedIcon fontSize="small" color="error" />
    ) : null

  const usernameFieldErrorText =
    formik.touched.username && formik.errors.username
      ? (formik.errors.username as string)
      : usernameAvailabilityMessage

  const showUsernameFieldError =
    (formik.touched.username && Boolean(formik.errors.username)) ||
    (Boolean(usernameAvailabilityMessage) &&
      (usernameAvailability === 'taken' || usernameAvailability === 'error'))

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
                  required
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={onUsernameBlur}
                  error={showUsernameFieldError}
                  helperText={usernameFieldErrorText}
                  InputProps={
                    usernameStatusAdornment
                      ? {
                          endAdornment: (
                            <InputAdornment position="end">
                              {usernameStatusAdornment}
                            </InputAdornment>
                          ),
                        }
                      : undefined
                  }
                />
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
                  <Button type="button" variant="outlined" onClick={onUploadAvatarClick}>
                    Upload avatar
                  </Button>
                  <input
                    ref={avatarInputRef}
                    hidden
                    type="file"
                    accept="image/*"
                    onClick={onAvatarInputClick}
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0] ?? null
                      onAvatarFileSelected(file)
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
                      onClick={() => onPickPresetAvatar(url)}
                      sx={{ p: 1, borderRadius: 2, minWidth: 0 }}
                      variant={formik.values.avatarUrl === url ? 'contained' : 'outlined'}
                    >
                      <Avatar src={url} sx={{ width: 48, height: 48 }} />
                    </Button>
                  ))}
                </Stack>

                {formik.touched.avatarUrl && formik.errors.avatarUrl && (
                  <Typography color="error" variant="body2">
                    {formik.errors.avatarUrl as string}
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
              <Button type="button" disabled={activeStep === 0 || submitting} onClick={onBack}>
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{ minWidth: 140 }}
                  onClick={onFinishIntent}
                >
                  {submitting ? <CircularProgress size={22} color="inherit" /> : 'Finish'}
                </Button>
              ) : (
                <Button type="button" variant="contained" onClick={onNext} disabled={submitting}>
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
