import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Container,
  Paper,
  Stack,
  FormTextField,
  Typography,
  Alert,
  Avatar,
  AvatarButton,
  CheckCircleOutlineIcon,
  CancelOutlinedIcon,
  AccountCircleIcon,
  LocationOnIcon,
  CloudUploadIcon,
  LogoutIcon,
  EmailIcon,
  useAppTheme,
} from '@cattos/ui'
import type { FormikProps } from 'formik'
import type { FocusEventHandler, MouseEventHandler, RefObject } from 'react'
import backgroundCity from '@/assets/backgrounds/background_city.jpg'
import appLogoBig from '@/assets/logos/app_logo_big.png'
import { OnboardingLoading } from '@/features/onboarding/components'

type OnboardingValues = {
  username: string
  displayName: string
  location: string
  avatarUrl: string
  firstPostContent: string
}

export type OnboardingScreenPresentationProps = {
  email: string
  steps: string[]
  presetAvatars: readonly string[]
  activeStep: number
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
  onLogout: () => void
}

export const OnboardingScreenPresentation = ({
  email,
  steps,
  presetAvatars,
  activeStep,
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
  onLogout,
}: OnboardingScreenPresentationProps) => {
  const appTheme = useAppTheme()
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

  if (formik.isSubmitting) {
    return <OnboardingLoading />
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${backgroundCity})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: 12,
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'fixed', bottom: 24, left: 24, zIndex: 10 }}>
        <Button variant="orange" startIcon={<LogoutIcon />} onClick={onLogout}>
          Logout
        </Button>
      </Box>

      <Container component="main" maxWidth={false} sx={{ width: '100%', maxWidth: 750 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: appTheme.radii.radix3,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            minHeight: 480,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: '100%',
              background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '20px 20px',
              },
            }}
          >
            <Box
              sx={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                outline: '4px solid white',
                boxShadow: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={appLogoBig}
                alt="Cattos Logo"
                style={{
                  width: '150%',
                  height: '150%',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>

          <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={3} alignItems="center" sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {activeStep === 0
                    ? 'Welcome to Cattos!'
                    : activeStep === 1
                      ? 'Choose Your Avatar'
                      : 'Your First Post'}
                </Typography>

                <Box sx={{ width: '70%', mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / steps.length) * 100}
                    sx={{
                      height: 10,
                      borderRadius: appTheme.radii.radix3,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: appTheme.radii.radix3,
                        background: 'linear-gradient(90deg, #42a5f5 0%, #1976d2 100%)',
                        textAlign: 'center',
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block', fontWeight: 500 }}
                  >
                    Step {activeStep + 1} of {steps.length}
                  </Typography>
                </Box>
              </Box>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    '& .MuiAlert-message': { fontSize: '1rem' },
                    '& .MuiAlert-icon': { fontSize: '1.5rem', alignItems: 'center' },
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ flex: 1 }}>
                  {activeStep === 0 && (
                    <Stack spacing={0} sx={{ width: '100%' }}>
                      <FormTextField
                        margin="normal"
                        fullWidth
                        required
                        outsideLabel
                        label="Username"
                        placeholder="e.g. cool_cat"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={onUsernameBlur}
                        errorText={showUsernameFieldError ? usernameFieldErrorText : null}
                        startIcon={<AccountCircleIcon color="action" fontSize="small" />}
                        endIcon={usernameStatusAdornment}
                      />
                      <FormTextField
                        margin="normal"
                        fullWidth
                        required
                        outsideLabel
                        label="Display Name"
                        placeholder="What should we call you?"
                        name="displayName"
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorText={
                          formik.touched.displayName && formik.errors.displayName
                            ? (formik.errors.displayName as string)
                            : null
                        }
                        startIcon={<AccountCircleIcon color="action" fontSize="small" />}
                      />
                      <FormTextField
                        margin="normal"
                        fullWidth
                        disabled
                        outsideLabel
                        label="Email Address"
                        name="email"
                        value={email}
                        startIcon={<EmailIcon color="action" fontSize="small" />}
                      />
                      <FormTextField
                        margin="normal"
                        fullWidth
                        outsideLabel
                        label="Location"
                        placeholder="Where are you located? (Optional)"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorText={
                          formik.touched.location && formik.errors.location
                            ? (formik.errors.location as string)
                            : null
                        }
                        startIcon={<LocationOnIcon color="action" fontSize="small" />}
                      />
                    </Stack>
                  )}

                  {activeStep === 1 && (
                    <Stack spacing={3}>
                      <Stack direction="row" justifyContent="center">
                        <Avatar
                          src={avatarPreviewUrl ?? formik.values.avatarUrl}
                          sx={{ width: 96, height: 96, boxShadow: 2, bgcolor: 'grey.100' }}
                        />
                      </Stack>

                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        onClick={onUploadAvatarClick}
                      >
                        Upload Your Own
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

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: 2,
                        }}
                      >
                        {presetAvatars.map((url) => (
                          <AvatarButton
                            key={url}
                            src={url}
                            selected={formik.values.avatarUrl === url}
                            onClick={() => onPickPresetAvatar(url)}
                          />
                        ))}
                      </Box>

                      {formik.touched.avatarUrl && formik.errors.avatarUrl && (
                        <Typography color="error" variant="body2" textAlign="center">
                          {formik.errors.avatarUrl as string}
                        </Typography>
                      )}
                    </Stack>
                  )}

                  {activeStep === 2 && (
                    <Stack spacing={2} sx={{ width: '100%' }}>
                      <FormTextField
                        fullWidth
                        multiline
                        outsideLabel
                        minRows={4}
                        label="Your First Post"
                        placeholder="What's on your mind, furry friend?"
                        name="firstPostContent"
                        value={formik.values.firstPostContent}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        errorText={
                          formik.touched.firstPostContent && formik.errors.firstPostContent
                            ? (formik.errors.firstPostContent as string)
                            : null
                        }
                      />
                    </Stack>
                  )}
                </Box>

                <Stack direction="row" justifyContent="space-between" mt={4}>
                  {activeStep > 0 ? (
                    <Button
                      type="button"
                      variant="outlined"
                      disabled={formik.isSubmitting}
                      onClick={onBack}
                    >
                      Back
                    </Button>
                  ) : (
                    <Box />
                  )}

                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="orange"
                      disabled={formik.isSubmitting}
                      sx={{ minWidth: 120 }}
                      onClick={onFinishIntent}
                    >
                      Create Post
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="contained"
                      onClick={onNext}
                      disabled={formik.isSubmitting}
                      sx={{ minWidth: 100 }}
                    >
                      Next
                    </Button>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
