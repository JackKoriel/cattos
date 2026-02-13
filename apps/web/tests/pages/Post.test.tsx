import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/features/posts/screens/PostScreen', () => ({
  PostScreen: () => <div>PostScreenMock</div>,
}))

import { Routes, Route } from 'react-router-dom'
import { PostPage } from '../../src/pages/PostPage'
import { AppLayout } from '../../src/shared/layout/AppLayout'

test('PostPage renders header and post screen', () => {
  render(
    <MemoryRouter initialEntries={['/post/123']}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByText(/^Post$/i)).toBeInTheDocument()
  expect(screen.getByText(/PostScreenMock/i)).toBeInTheDocument()
})
