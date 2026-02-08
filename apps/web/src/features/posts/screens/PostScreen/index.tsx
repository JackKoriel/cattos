import { useParams, useNavigate } from 'react-router-dom'
import { PostScreenError, PostScreenPresentation } from './presentation'
import { PostDetailSkeleton } from '@/features/posts/components'
import { usePostById } from '@/hooks/posts/usePostById'
import { usePostActions } from '@/hooks/posts/usePostActions'

export const PostScreen = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { post, setPost, loading, error } = usePostById(id)
  const { like, bookmark, repost, share } = usePostActions()

  if (loading) return <PostDetailSkeleton />
  if (error || !post) return <PostScreenError message={error ?? 'Post not found'} />

  return (
    <PostScreenPresentation
      post={post}
      onOpen={(postId) => navigate(`/post/${postId}`)}
      onProfileClick={(username) => navigate(`/profile/${username}`)}
      onLike={like}
      onBookmark={bookmark}
      onRepost={repost}
      onShare={(postId) => {
        void share(postId)
      }}
      onCommentCreated={() => {
        setPost((prev) => (prev ? { ...prev, commentsCount: (prev.commentsCount ?? 0) + 1 } : prev))
      }}
    />
  )
}
