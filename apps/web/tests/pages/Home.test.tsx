import { test, expect, vi } from 'vitest'
import { renderWithTheme, screen } from '../utils/render'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/stores/authStore', () => ({
  useAuthUser: () => ({ id: '1', username: 'tester', displayName: 'Tester', avatar: '' }),
  useAuthLogout: () => async () => {},
}))

vi.mock('@/hooks/usePostFeed', () => {
  return {
    __esModule: true,
    default: () => ({
      posts: [],
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: false,
      refresh: () => {},
      updatePost: () => {},
      prependPost: () => {},
      replaceTempPost: () => {},
      removePost: () => {},
      refreshPost: async () => {},
      refreshUser: async () => {},
      usersById: {},
      listRootRef: { current: null },
      renderedItems: [],
      lastPostRef: () => {},
      getScrollContainer: () => null,
      loadingAds: false,
      commentDialogPost: null,
      snackbar: { open: false, message: '' },
      handleCloseCommentDialog: () => {},
      handleCommentCreated: () => {},
      handleShare: () => {},
      handleCloseSnackbar: () => {},
      showSnackbar: () => {},
    }),
  }
})

vi.mock('@/hooks/posts/usePostActions', () => ({
  usePostActions: () => ({
    like: async () => {},
    bookmark: async () => {},
    repost: async () => {},
  }),
}))

import { Routes, Route } from 'react-router-dom'
import { HomePage } from '../../src/pages/HomePage'
import { AppLayout } from '../../src/shared/layout/AppLayout'

test('HomePage shows CreatePost, header and empty feed message', () => {
  renderWithTheme(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByRole('heading', { name: /^Home$/i })).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/what's happening/i)).toBeInTheDocument()
  expect(screen.getByText(/No posts found\. Be the first to post!/i)).toBeInTheDocument()
})
