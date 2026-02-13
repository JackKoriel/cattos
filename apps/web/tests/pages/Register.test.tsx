import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/hooks/auth/useRegisterForm', () => ({
  useRegisterForm: () => ({
    formik: {
      values: { email: '', password: '' },
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

import { RegisterPage } from '../../src/pages/RegisterPage'

test('Register page shows email/password inputs and submit', () => {
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )

  expect(screen.getByPlaceholderText(/e\.g\. catty@example.com/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/Create a strong password/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /enter cattos/i })).toBeInTheDocument()
})
