import { test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/stores/authStore', () => ({
  useAuthLogout: () => async () => {},
  useAuthUser: () => ({ username: 'test' }),
}))

vi.mock('@/services/ads', () => ({
  adsService: {
    getSidebarAds: async () => [],
  },
}))

import { AppLayout } from '../../src/shared/layout/AppLayout'

test('AppLayout renders sidebar and sidebar ads area', async () => {
  render(
    <MemoryRouter>
      <AppLayout />
    </MemoryRouter>
  )

  expect(screen.getByLabelText('main-sidebar')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByLabelText('sidebar-ads')).toBeInTheDocument()
  })

  expect(screen.getByText(/Cattos/i)).toBeInTheDocument()
})
