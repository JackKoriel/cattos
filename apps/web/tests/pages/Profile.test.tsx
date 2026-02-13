import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/features/profile/screens/ProfileScreen', () => ({
  ProfileScreen: () => <div>ProfileScreenMock</div>,
}))

import { Routes, Route } from 'react-router-dom'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { AppLayout } from '../../src/shared/layout/AppLayout'

test('ProfilePage renders header with username and profile screen', () => {
  render(
    <MemoryRouter initialEntries={['/profile/tester']}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByText(/tester/i)).toBeInTheDocument()
  expect(screen.getByText(/ProfileScreenMock/i)).toBeInTheDocument()
})
