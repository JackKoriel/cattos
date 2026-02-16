import { test, expect } from 'vitest'
import { renderWithTheme, screen } from '../utils/render'
import { MemoryRouter } from 'react-router-dom'
import { ComingSoonPage } from '../../src/pages/ComingSoonPage'

test('renders Coming Soon page', () => {
  renderWithTheme(
    <MemoryRouter>
      <ComingSoonPage />
    </MemoryRouter>
  )

  expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
})
