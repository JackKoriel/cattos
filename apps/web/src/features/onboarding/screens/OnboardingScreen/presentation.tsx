import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Avatar,
  CheckCircleOutlineIcon,
  CancelOutlinedIcon,
  AccountCircleIcon,
  LocationOnIcon,
  CloudUploadIcon,
} from '@cattos/ui'
import type { FormikProps } from 'formik'
import type { FocusEventHandler, MouseEventHandler, RefObject } from 'react'
import backgroundCity from '@/assets/backgrounds/background_city.jpg'
import appLogoSmall from '@/assets/logos/app_logo_small.png'

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
      }}
    >
      <Container component="main" maxWidth={false} sx={{ width: '100%', maxWidth: 750 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            minHeight: 480,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Blue Header */}
          <Box
            sx={{
              width: '100%',
              background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
              height: 100,
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
                width: 70,
                height: 70,
                borderRadius: '50%',
                border: '4px solid white',
                boxShadow: 2,
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={appLogoSmall}
                alt="Cattos Logo"
                style={{ width: '150%', height: '150%', display: 'block', objectFit: 'cover' }}
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
                  width: '100%',
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

                {/* Progress Stepper */}
                <Box sx={{ width: '70%', mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={((activeStep + 1) / steps.length) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: 'linear-gradient(90deg, #42a5f5 0%, #1976d2 100%)',
                        textAlign: 'center',
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Step {activeStep + 1} of {steps.length}
                  </Typography>
                </Box>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ flex: 1 }}>
                  {activeStep === 0 && (
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        required
                        placeholder="Username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={onUsernameBlur}
                        error={showUsernameFieldError}
                        helperText={usernameFieldErrorText}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                          endAdornment: usernameStatusAdornment ? (
                            <InputAdornment position="end">
                              {usernameStatusAdornment}
                            </InputAdornment>
                          ) : null,
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        placeholder="Display Name"
                        name="displayName"
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                        helperText={formik.touched.displayName && formik.errors.displayName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        placeholder="Location (Optional)"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.location && Boolean(formik.errors.location)}
                        helperText={formik.touched.location && formik.errors.location}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
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
                        sx={{ textTransform: 'none', borderRadius: 2 }}
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
                          <Box
                            key={url}
                            component="button"
                            type="button"
                            onClick={() => onPickPresetAvatar(url)}
                            sx={{
                              p: 0,
                              border: '4px solid',
                              borderColor:
                                formik.values.avatarUrl === url ? 'primary.main' : 'transparent',
                              borderRadius: '50%',
                              bgcolor: 'transparent',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              transition: 'all 0.2s',
                              '&:hover': { transform: 'scale(1.06)' },
                            }}
                          >
                            <Avatar
                              src={url}
                              sx={{
                                width: '100%',
                                height: '100%',
                                aspectRatio: '1/1',
                              }}
                            />
                          </Box>
                        ))}
                      </Box>

                      {formik.touched.avatarUrl && formik.errors.avatarUrl && (
                        <Typography color="error" variant="caption" textAlign="center">
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
                        minRows={4}
                        placeholder="What's on your mind, furry friend?"
                        name="firstPostContent"
                        value={formik.values.firstPostContent}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.firstPostContent && Boolean(formik.errors.firstPostContent)
                        }
                        helperText={
                          formik.touched.firstPostContent && formik.errors.firstPostContent
                        }
                      />
                    </Stack>
                  )}
                </Box>

                <Stack direction="row" justifyContent="space-between" mt={4}>
                  <Button
                    type="button"
                    variant="text"
                    disabled={activeStep === 0 || submitting}
                    onClick={onBack}
                    sx={{ textTransform: 'none' }}
                  >
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      sx={{ minWidth: 120, borderRadius: 2, textTransform: 'none' }}
                      onClick={onFinishIntent}
                    >
                      {submitting ? <CircularProgress size={22} color="inherit" /> : 'Create Post'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="contained"
                      onClick={onNext}
                      disabled={submitting}
                      sx={{ minWidth: 100, borderRadius: 2, textTransform: 'none' }}
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
