import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

vi.mock('@/stores/authStore', () => ({
  useAuthUser: () => ({ onboardingStatus: 'incomplete', email: 'test@example.com' }),
}))

vi.mock('@cattos/ui', async () => {
  const actual = await vi.importActual('@cattos/ui')
  return {
    ...actual,
    AvatarButton: ({ src, onClick }: { src?: string; onClick?: () => void }) => (
      <button data-testid={`avatar-${src}`} onClick={() => onClick?.()}>
        {src}
      </button>
    ),
  }
})

type OnboardingState = {
  user: { email: string } | null
  steps: string[]
  presetAvatars: string[]
  activeStep: number
  error: string | null
  avatarPreviewUrl: string | null
  avatarInputRef: { current: null | HTMLInputElement }
  formik: {
    values: Record<string, string>
    handleSubmit: (e?: Event) => void
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    touched: Record<string, unknown>
    errors: Record<string, unknown>
    isSubmitting: boolean
  }
  usernameAvailability: string
  usernameAvailabilityMessage: string | null
  onUsernameBlur: (e?: Event) => void
  goBack: () => void
  goNext: () => void
  onAvatarUploadClick: () => void
  onAvatarInputClick: (e?: Event) => void
  onAvatarFileChange: (file?: File | null) => void
  pickPresetAvatar: (url: string) => void
  markFinishIntent: () => void
  logout: () => void
} | null

let onboardingState: OnboardingState = null
vi.mock('@/hooks/onboarding/useOnboarding', () => ({
  useOnboarding: () => onboardingState,
}))

import { OnboardingPage } from '../../src/pages/OnboardingPage'

test('Onboarding stepper: username -> pick avatar -> finish', async () => {
  const pickPresetAvatar = vi.fn()
  const markFinishIntent = vi.fn()

  onboardingState = {
    user: { email: 'test@example.com' },
    steps: ['welcome', 'avatar', 'first-post'],
    presetAvatars: [],
    activeStep: 0,
    error: null,
    avatarPreviewUrl: null,
    avatarInputRef: { current: null },
    formik: {
      values: { username: '', displayName: '', location: '', avatarUrl: '', firstPostContent: '' },
      handleSubmit: (e?: Event) => e?.preventDefault?.(),
      handleChange: vi.fn(),
      handleBlur: vi.fn(),
      touched: {},
      errors: {},
      isSubmitting: false,
    },
    usernameAvailability: 'idle',
    usernameAvailabilityMessage: null,
    onUsernameBlur: vi.fn(),
    goBack: vi.fn(),
    goNext: vi.fn(),
    onAvatarUploadClick: vi.fn(),
    onAvatarInputClick: vi.fn(),
    onAvatarFileChange: vi.fn(),
    pickPresetAvatar,
    markFinishIntent,
    logout: vi.fn(),
  }

  const user = userEvent.setup()

  const { rerender } = render(
    <MemoryRouter>
      <OnboardingPage />
    </MemoryRouter>
  )

  expect(screen.getByPlaceholderText(/e\.g\. cool_cat/i)).toBeInTheDocument()

  onboardingState.activeStep = 1
  onboardingState.presetAvatars = ['avatar1.png', 'avatar2.png']
  rerender(
    <MemoryRouter>
      <OnboardingPage />
    </MemoryRouter>
  )

  expect(screen.getByRole('button', { name: /upload your own/i })).toBeInTheDocument()
  const avatarBtn = screen.getByTestId('avatar-avatar1.png')
  await user.click(avatarBtn)
  expect(pickPresetAvatar).toHaveBeenCalledWith('avatar1.png')

  onboardingState.activeStep = 2
  rerender(
    <MemoryRouter>
      <OnboardingPage />
    </MemoryRouter>
  )

  const createBtn = screen.getByRole('button', { name: /create post/i })
  await user.click(createBtn)
  expect(markFinishIntent).toHaveBeenCalled()
})
