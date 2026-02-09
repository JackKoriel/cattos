import { OnboardingScreenPresentation } from './presentation'
import { useOnboarding } from '@/hooks/onboarding/useOnboarding'

export const OnboardingScreen = () => {
  const onboarding = useOnboarding()

  if (!onboarding.user) return null

  return (
    <OnboardingScreenPresentation
      email={onboarding.user.email}
      steps={onboarding.steps}
      presetAvatars={onboarding.presetAvatars}
      activeStep={onboarding.activeStep}
      error={onboarding.error}
      avatarPreviewUrl={onboarding.avatarPreviewUrl}
      avatarInputRef={onboarding.avatarInputRef}
      formik={onboarding.formik}
      usernameAvailability={onboarding.usernameAvailability}
      usernameAvailabilityMessage={onboarding.usernameAvailabilityMessage}
      onUsernameBlur={(e) => {
        void onboarding.onUsernameBlur(e)
      }}
      onBack={onboarding.goBack}
      onNext={() => {
        void onboarding.goNext()
      }}
      onUploadAvatarClick={onboarding.onAvatarUploadClick}
      onAvatarInputClick={onboarding.onAvatarInputClick}
      onAvatarFileSelected={onboarding.onAvatarFileChange}
      onPickPresetAvatar={onboarding.pickPresetAvatar}
      onFinishIntent={onboarding.markFinishIntent}
      onLogout={() => {
        void onboarding.logout()
      }}
    />
  )
}
