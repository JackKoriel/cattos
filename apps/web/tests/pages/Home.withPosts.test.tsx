import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/stores/authStore', () => ({
  useAuthUser: () => ({ id: '1', username: 'tester', displayName: 'Tester', avatar: '' }),
}))

vi.mock('@cattos/ui', async () => {
  const actual = await vi.importActual('@cattos/ui')
  return {
    ...actual,
    PostCard: ({ content }: { content?: string }) => <div data-testid="post-card">{content}</div>,
  }
})

vi.mock('@/hooks/usePostFeed', () => {
  return {
    __esModule: true,
    default: () => ({
      posts: [
        {
          id: 'post-1',
          content: 'Hello from test post',
          createdAt: new Date().toISOString(),
          author: { id: '1', username: 'tester', displayName: 'Tester', avatar: '' },
        },
      ],
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
      renderedItems: [
        { type: 'post', key: 'post-1', post: { id: 'post-1', content: 'Hello from test post', createdAt: new Date().toISOString(), author: { id: '1', username: 'tester', displayName: 'Tester', avatar: '' } } },
      ],
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

import { HomePage } from '../../src/pages/HomePage'

test('HomePage shows post when posts exist', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )

  expect(screen.getByTestId('post-card')).toHaveTextContent('Hello from test post')
})
