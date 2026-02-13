import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/hooks/onboarding/useOnboarding', () => ({
  useOnboarding: () => ({
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
    pickPresetAvatar: vi.fn(),
    markFinishIntent: vi.fn(),
    logout: vi.fn(),
  }),
}))

vi.mock('@/stores/authStore', () => ({
  useAuthUser: () => ({ onboardingStatus: 'incomplete' }),
}))

import { OnboardingPage } from '../../src/pages/OnboardingPage'

test('Onboarding page shows logout and next controls and username field', () => {
  render(
    <MemoryRouter>
      <OnboardingPage />
    </MemoryRouter>
  )

  expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/e\.g\. cool_cat/i)).toBeInTheDocument()
})
