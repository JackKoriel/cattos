import { OnboardingScreenPresentation } from './presentation'
import { useOnboarding } from '@/hooks/onboarding/useOnboarding'

export const OnboardingScreen = () => {
  const onboarding = useOnboarding()

  if (!onboarding.user) return null

  return (
    <OnboardingScreenPresentation
      steps={onboarding.steps}
      presetAvatars={onboarding.presetAvatars}
      activeStep={onboarding.activeStep}
      submitting={onboarding.submitting}
      error={onboarding.error}
      avatarPreviewUrl={onboarding.avatarPreviewUrl}
      avatarInputRef={onboarding.avatarInputRef}
      formik={onboarding.formik}
      onBack={onboarding.goBack}
      onNext={() => {
        void onboarding.goNext()
      }}
      onUploadAvatarClick={onboarding.onAvatarUploadClick}
      onAvatarInputClick={onboarding.onAvatarInputClick}
      onAvatarFileSelected={onboarding.onAvatarFileChange}
      onPickPresetAvatar={onboarding.pickPresetAvatar}
      onFinishIntent={onboarding.markFinishIntent}
    />
  )
}
