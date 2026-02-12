import { forwardRef, useImperativeHandle } from 'react'
import { Box, Stack, Typography, Snackbar, AdPostCard } from '@cattos/ui'
import { PostCardContainer as PostCard } from '@/features/posts/components/PostCardContainer'
import { FeedSkeleton, LoadingMoreIndicator } from '@/features/posts/components'
import usePostFeed from '@/hooks/usePostFeed'
import { usePostActions } from '@/hooks/posts/usePostActions'
import { CommentDialog } from '@/features/comments/components'
import { useNavigate } from 'react-router-dom'
import resolvePostAuthors from '@/utils/resolvePostAuthors'

export interface PostFeedHandle {
  refresh: () => void
  prependPost?: (post: import('@cattos/shared').Post) => void
  replaceTempPost?: (tempId: string, serverPost: import('@cattos/shared').Post) => void
  removePost?: (postId: string) => void
  refreshPost?: (postId: string) => Promise<void>
  refreshUser?: (userId: string) => Promise<void>
}

interface PostFeedProps {
  authorId?: string
  showAds?: boolean
}
export const PostFeed = forwardRef<PostFeedHandle, PostFeedProps>(
  ({ authorId, showAds = false }, ref) => {
    const navigate = useNavigate()
    const {
      posts,
      loading,
      loadingMore,
      error,
      hasMore,
      refresh,
      updatePost,
      prependPost,
      removePost,
      refreshPost,
      refreshUser,
      replaceTempPost,
      listRootRef,
      renderedItems,
      snackbar,
      lastPostRef,
      commentDialogPost,
      getScrollContainer,
      handleCloseCommentDialog,
      handleCommentCreated,
      handleShare,
      handleCloseSnackbar,
      showSnackbar,
      handleComment,
      usersById,
    } = usePostFeed(authorId, showAds)

    const { like, bookmark, repost } = usePostActions()

    const handleRepostWithFeedback = async (id: string) => {
      const created = await repost(id)

      prependPost(created)
      updatePost(id, (prev) => ({ ...prev, repostsCount: (prev.repostsCount ?? 0) + 1 }))

      // Scroll to top to show the new repost
      const scrollEl = getScrollContainer()
      if (scrollEl) {
        scrollEl.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }

      showSnackbar('Reposted!')
    }

    useImperativeHandle(
      ref,
      () => ({
        refresh,
        prependPost,
        replaceTempPost: (tempId: string, serverPost: import('@cattos/shared').Post) =>
          replaceTempPost(tempId, serverPost),
        removePost: (id: string) => removePost(id),
        refreshPost: (id: string) => refreshPost(id),
        refreshUser: (id: string) => refreshUser(id),
      }),
      [refresh, prependPost, replaceTempPost, removePost, refreshPost, refreshUser]
    )

    if (loading && posts.length === 0) {
      return <FeedSkeleton count={5} />
    }

    if (!loading && !error && posts.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, p: 2 }}>
          <Typography variant="body1" color="text.secondary">
            No posts found. Be the first to post! 🐱
          </Typography>
        </Box>
      )
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )
    }

    return (
      <>
        <Box ref={listRootRef}>
          <Stack spacing={2} p={2} pb={4}>
            {renderedItems.map((item) => {
              if (item.type === 'ad') {
                return (
                  <AdPostCard
                    key={item.key}
                    ad={item.ad}
                    onClick={() => {
                      navigate('/coming-soon')
                    }}
                  />
                )
              }

              return (
                <PostCard
                  key={item.key}
                  post={item.post}
                  resolvedUsers={usersById}
                  onLike={like}
                  onRepost={handleRepostWithFeedback}
                  onBookmark={bookmark}
                  onComment={() => {
                    void handleComment(item.post.id)
                  }}
                  onShare={handleShare}
                  onOpen={(postId) => navigate(`/post/${postId}`)}
                  onProfileClick={(username) => navigate(`/profile/${username}`)}
                />
              )
            })}

            {hasMore && <div ref={lastPostRef} style={{ height: 1 }} />}

            {loadingMore && <LoadingMoreIndicator />}

            {!hasMore && posts.length > 0 && (
              <Typography variant="body2" color="text.secondary" align="center" py={2}>
                You've reached the end! 🐱
              </Typography>
            )}
          </Stack>
        </Box>

        <CommentDialog
          open={!!commentDialogPost}
          onClose={handleCloseCommentDialog}
          post={commentDialogPost ? resolvePostAuthors(commentDialogPost, usersById) : null}
          onLike={like}
          onBookmark={bookmark}
          onCommentCreated={handleCommentCreated}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
        />
      </>
    )
  }
)

PostFeed.displayName = 'PostFeed'
