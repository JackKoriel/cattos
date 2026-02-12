import type { Post } from '@cattos/shared'
import { PostCard } from '@cattos/ui'
import usePostCard, { type UsePostActions } from '@/hooks/usePostCard'
import resolvePostAuthors from '@/utils/resolvePostAuthors'

export interface PostCardContainerProps {
  post: Post
  resolvedUsers?: Record<string, Post['author']>
  showCommentButton?: boolean
  showRepostButton?: boolean
  showBookmarkButton?: boolean
  showShareButton?: boolean
  onLike?: (id: string, isLiked: boolean) => Promise<void>
  onBookmark?: (id: string, isBookmarked: boolean) => Promise<void>
  onRepost?: (id: string) => Promise<Post | void>
  onShare?: (id: string) => void
  onComment?: (id: string) => void
  onOpen?: (id: string) => void
  onProfileClick?: (username: string) => void
}

export const PostCardContainer = ({
  post,
  resolvedUsers,
  showCommentButton,
  showRepostButton,
  showBookmarkButton,
  showShareButton,
  onLike,
  onBookmark,
  onRepost,
  onShare,
  onComment,
  onOpen,
  onProfileClick,
}: PostCardContainerProps) => {
  const actions: UsePostActions = {
    onLike,
    onBookmark,
    onRepost,
    onShare,
    onComment,
    onOpen,
    onProfileClick,
  }
  const postWithResolvedAuthors = resolvePostAuthors(post, resolvedUsers)

  const ui = usePostCard(postWithResolvedAuthors, actions)
  return (
    <PostCard
      postId={post.id}
      content={ui.actionPost?.content ?? post.content}
      createdAt={ui.actionPost?.createdAt ?? post.createdAt}
      mediaUrls={ui.mediaUrls}
      isReshare={ui.isReshare}
      displayName={ui.displayName}
      username={ui.username}
      avatarSrc={ui.avatarSrc}
      liked={ui.liked}
      bookmarked={ui.bookmarked}
      localLikesCount={ui.localLikesCount}
      localRepostsCount={ui.localRepostsCount}
      commentsValue={ui.commentsValue}
      showCommentButton={showCommentButton}
      showRepostButton={showRepostButton}
      showBookmarkButton={showBookmarkButton}
      showShareButton={showShareButton}
      onLike={ui.handleLike}
      onRepost={ui.handleRepost}
      onBookmark={ui.handleBookmark}
      onComment={() => onComment?.(post.id)}
      onShare={ui.handleShare}
      onOpen={onOpen}
      onProfileClick={onProfileClick}
    />
  )
}
