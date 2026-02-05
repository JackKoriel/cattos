import { useParams, useNavigate } from 'react-router-dom'
import { PostScreenError, PostScreenLoading, PostScreenPresentation } from './presentation'
import { usePostById } from '@/hooks/posts/usePostById'
import { usePostActions } from '@/hooks/posts/usePostActions'

export const PostScreen = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { post, setPost, loading, error } = usePostById(id)
  const { like, bookmark, repost, share } = usePostActions()

  if (loading) return <PostScreenLoading />
  if (error || !post) return <PostScreenError message={error ?? 'Post not found'} />

  return (
    <PostScreenPresentation
      post={post}
      onBack={() => navigate(-1)}
      onOpen={(postId) => navigate(`/post/${postId}`)}
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
