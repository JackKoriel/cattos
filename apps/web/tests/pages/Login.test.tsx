import { test, expect, vi } from 'vitest'
import { renderWithTheme, screen } from '../utils/render'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/hooks/auth/useLoginForm', () => ({
  useLoginForm: () => ({
    formik: {
      values: { identifier: '', password: '' },
      handleSubmit: (e?: Event) => e?.preventDefault?.(),
      handleChange: vi.fn(),
      handleBlur: vi.fn(),
      touched: {},
      errors: {},
      isSubmitting: false,
    },
    authError: null,
  }),
}))

vi.mock('@/stores/authStore', () => ({
  useAuthIsLoading: () => false,
  useAuthUser: () => null,
}))

import { LoginPage } from '../../src/pages/LoginPage'

test('Login page shows inputs and submit button', () => {
  renderWithTheme(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )

  expect(screen.getByPlaceholderText(/e\.g\. catty@example.com or catty123/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/•{2,}/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /enter cattos/i })).toBeInTheDocument()
})
