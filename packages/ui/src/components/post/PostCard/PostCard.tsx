import { useEffect, useRef, useState } from 'react'
import { Avatar, Box, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material'
import { Post } from '@cattos/shared'
import {
  ChatBubbleOutline,
  FavoriteBorder,
  Favorite,
  Repeat,
  BookmarkBorder,
  Bookmark,
  Share,
} from '@mui/icons-material'
import { formatDistanceToNowStrict } from 'date-fns'

export interface PostCardProps {
  post: Post
  onLike?: (id: string, isLiked: boolean) => Promise<void>
  onRepost?: (id: string) => Promise<void>
  onBookmark?: (id: string, isBookmarked: boolean) => Promise<void>
  onComment?: (id: string) => void
  onShare?: (id: string) => void

  onOpen?: (id: string) => void
  showCommentButton?: boolean
  showRepostButton?: boolean
  showBookmarkButton?: boolean
  showShareButton?: boolean
}

export const PostCard = ({
  post,
  onLike,
  onRepost,
  onBookmark,
  onComment,
  onShare,
  onOpen,
  showCommentButton = true,
  showRepostButton = true,
  showBookmarkButton = true,
  showShareButton = true,
}: PostCardProps) => {
  const isReshare = !!(post.isRepost && post.repostOf)
  const actionPost = (isReshare ? post.repostOf : post) as Post

  const {
    _id: targetId,
    content,
    createdAt,
    likesCount,
    commentsCount,
    repostsCount,
    authorId,
    isLiked,
    isBookmarked,
  } = actionPost

  const [liked, setLiked] = useState(isLiked ?? false)
  const [bookmarked, setBookmarked] = useState(isBookmarked ?? false)
  const [localLikesCount, setLocalLikesCount] = useState(likesCount ?? 0)
  const [localRepostsCount, setLocalRepostsCount] = useState(repostsCount ?? 0)
  const [shareActive, setShareActive] = useState(false)
  const shareTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current !== null) {
        window.clearTimeout(shareTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setLiked(isLiked ?? false)
  }, [targetId, isLiked])

  useEffect(() => {
    setBookmarked(isBookmarked ?? false)
  }, [targetId, isBookmarked])

  useEffect(() => {
    setLocalLikesCount(likesCount ?? 0)
  }, [targetId, likesCount])

  useEffect(() => {
    setLocalRepostsCount(repostsCount ?? 0)
  }, [targetId, repostsCount])

  const handleLike = async () => {
    if (!onLike) return
    const wasLiked = liked
    try {
      setLiked(!wasLiked)
      setLocalLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1))
      await onLike(targetId, wasLiked)
    } catch {
      setLiked(wasLiked)
      setLocalLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1))
    }
  }

  const handleBookmark = async () => {
    if (!onBookmark) return
    const wasBookmarked = bookmarked
    try {
      setBookmarked(!wasBookmarked)
      await onBookmark(targetId, wasBookmarked)
    } catch {
      setBookmarked(wasBookmarked)
    }
  }

  const handleRepost = async () => {
    if (!onRepost) return
    try {
      await onRepost(targetId)
      setLocalRepostsCount((prev) => prev + 1)
    } catch {
      console.error('Failed to repost')
    }
  }

  const handleShare = () => {
    setShareActive(true)
    if (shareTimeoutRef.current !== null) {
      window.clearTimeout(shareTimeoutRef.current)
    }
    shareTimeoutRef.current = window.setTimeout(() => setShareActive(false), 900)

    if (onShare) {
      onShare(targetId)
    } else {
      const url = `${window.location.origin}/post/${targetId}`
      navigator.clipboard.writeText(url)
    }
  }

  const timeAgo = formatDistanceToNowStrict(new Date(createdAt), {
    addSuffix: false,
  })

  const wrapperDisplayName = post.author?.displayName ?? 'Cat User'
  const wrapperUsername =
    post.author?.username ?? (post.authorId ? `user_${post.authorId.slice(-6)}` : 'anonymous')
  const displayName = actionPost.author?.displayName ?? wrapperDisplayName
  const username =
    actionPost.author?.username ?? (authorId ? `user_${authorId.slice(-6)}` : wrapperUsername)
  const avatarSrc = actionPost.author?.avatar

  const inactiveActionColor = 'text.secondary'
  const commentsValue = commentsCount ?? 0
  const commentColor = commentsValue > 0 ? 'success.main' : inactiveActionColor
  const repostColor = localRepostsCount > 0 ? 'secondary.main' : inactiveActionColor
  const likeColor = liked ? 'error.main' : inactiveActionColor
  const bookmarkColor = bookmarked ? 'primary.main' : inactiveActionColor
  const shareColor = shareActive ? 'info.main' : inactiveActionColor

  const actionButtonSx = {
    transition: 'transform 120ms ease, color 120ms ease',
    '&:hover': {
      transform: 'scale(1.12)',
      bgcolor: 'transparent',
    },
    '&:active': {
      transform: 'scale(1.06)',
    },
  } as const

  return (
    <Card
      variant="outlined"
      onClick={() => onOpen?.(targetId)}
      sx={{
        display: 'flex',
        p: 2,
        borderRadius: 3,
        cursor: onOpen ? 'pointer' : 'default',
      }}
    >
      <Box sx={{ mr: 2 }}>
        <Avatar src={avatarSrc} alt={displayName}>
          {displayName.charAt(0)}
        </Avatar>
      </Box>
      <Box sx={{ flex: 1 }}>
        {isReshare && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
          >
            <Repeat fontSize="small" />
            <span>{wrapperDisplayName} reshared</span>
          </Typography>
        )}
        <CardHeader
          disableTypography
          sx={{ p: 0, mb: 1 }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold' }}>{displayName}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                @{username}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                ·
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {timeAgo}
              </Typography>
            </Box>
          }
        />
        <CardContent sx={{ p: 0, mb: 1 }}>
          <Typography variant="body1">{content}</Typography>
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '425px' }}>
          {showCommentButton && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onComment?.(targetId)
              }}
              sx={{ ...actionButtonSx, color: commentColor }}
            >
              <ChatBubbleOutline fontSize="small" />
              <Typography variant="body2" sx={{ ml: 1, color: 'inherit' }}>
                {commentsValue}
              </Typography>
            </IconButton>
          )}

          {showRepostButton && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                void handleRepost()
              }}
              sx={{ ...actionButtonSx, color: repostColor }}
            >
              <Repeat fontSize="small" />
              <Typography variant="body2" sx={{ ml: 1, color: 'inherit' }}>
                {localRepostsCount}
              </Typography>
            </IconButton>
          )}

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              void handleLike()
            }}
            sx={{ ...actionButtonSx, color: likeColor }}
          >
            {liked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            <Typography variant="body2" sx={{ ml: 1, color: 'inherit' }}>
              {localLikesCount}
            </Typography>
          </IconButton>

          {showBookmarkButton && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                void handleBookmark()
              }}
              sx={{ ...actionButtonSx, color: bookmarkColor }}
            >
              {bookmarked ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
            </IconButton>
          )}

          {showShareButton && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                handleShare()
              }}
              disableRipple
              disableFocusRipple
              disableTouchRipple
              sx={{
                ...actionButtonSx,
                color: shareColor,
                '&.Mui-focusVisible': { bgcolor: 'transparent' },
                '&:active': { bgcolor: 'transparent', transform: 'scale(1.06)' },
              }}
            >
              <Share fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Card>
  )
}
