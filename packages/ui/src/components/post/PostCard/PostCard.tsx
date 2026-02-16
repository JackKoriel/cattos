import { Avatar, Box, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material'
import { useAppTheme } from '../../..'
import type { Post } from '@cattos/shared'
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
  postId: string
  content: string
  createdAt?: string
  mediaUrls?: string[]

  isReshare?: boolean
  displayName: string
  username?: string
  avatarSrc?: string

  liked?: boolean
  bookmarked?: boolean
  localLikesCount?: number
  localRepostsCount?: number
  commentsValue?: number

  showCommentButton?: boolean
  showRepostButton?: boolean
  showBookmarkButton?: boolean
  showShareButton?: boolean

  onLike?: () => Promise<void> | void
  onRepost?: () => Promise<Post | void> | void
  onBookmark?: () => Promise<void> | void
  onComment?: () => void
  onShare?: () => void
  onOpen?: (id: string) => void
  onProfileClick?: (username: string) => void
}

export const PostCard = ({
  postId,
  content,
  createdAt,
  mediaUrls,
  isReshare = false,
  displayName,
  username,
  avatarSrc,
  liked = false,
  bookmarked = false,
  localLikesCount = 0,
  localRepostsCount = 0,
  commentsValue = 0,
  showCommentButton = true,
  showRepostButton = true,
  showBookmarkButton = true,
  showShareButton = true,
  onLike,
  onRepost,
  onBookmark,
  onComment,
  onShare,
  onOpen,
  onProfileClick,
}: PostCardProps) => {
  const appTheme = useAppTheme()
  const timeAgo = createdAt
    ? formatDistanceToNowStrict(new Date(createdAt), { addSuffix: false })
    : ''

  const avatar = avatarSrc
  const inactiveActionColor = 'text.secondary'
  const commentColor = commentsValue > 0 ? 'success.main' : inactiveActionColor
  const repostColor = localRepostsCount > 0 ? 'secondary.main' : inactiveActionColor
  const likeColor = liked ? 'error.main' : inactiveActionColor
  const bookmarkColor = bookmarked ? 'primary.main' : inactiveActionColor
  const shareColor = 'text.secondary'

  const actionButtonSx = {
    transition: 'transform 120ms ease, color 120ms ease',
    '&:hover': { transform: 'scale(1.12)', bgcolor: 'transparent' },
    '&:active': { transform: 'scale(1.06)' },
  } as const

  const mediaCount = mediaUrls?.length ?? 0

  return (
    <Card
      variant="outlined"
          onClick={() => onOpen?.(postId)}
      sx={{
        display: 'flex',
        p: 2,
          borderRadius: appTheme.radii.radix2,
        cursor: onOpen ? 'pointer' : 'default',
        bgcolor: 'white',
      }}
    >
      <Box sx={{ mr: 2 }}>
        <Avatar
          src={avatar}
          alt={displayName}
          sx={{ cursor: onProfileClick ? 'pointer' : 'inherit' }}
        >
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
            <span>{displayName} reshared</span>
          </Typography>
        )}
        <CardHeader
          disableTypography
          sx={{ p: 0, mb: 1 }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                onClick={(e) => {
                  e.stopPropagation()
                  onProfileClick?.(username ?? '')
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: onProfileClick ? 'pointer' : 'inherit',
                  '&:hover': { textDecoration: onProfileClick ? 'underline' : 'none' },
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>{displayName}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  @{username}
                </Typography>
              </Box>
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
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
          >
            {content}
          </Typography>
          {mediaCount > 0 && (
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                mt: 1.5,
                  borderRadius: appTheme.radii.radix1,
                overflow: 'hidden',
                gridTemplateColumns:
                  mediaCount === 1 ? '1fr' : mediaCount === 2 ? '1fr 1fr' : '1fr 1fr',
                gridTemplateRows:
                  mediaCount < 3 ? 'auto' : mediaCount === 3 ? '1fr 1fr' : '1fr 1fr',
                maxWidth: 420,
                width: '100%',
                background: '#f7f7f7',
              }}
            >
              {mediaUrls?.map((url, idx) => (
                <Box
                  key={url}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    gridColumn: mediaCount === 3 && idx === 0 ? '1 / span 2' : undefined,
                    gridRow: mediaCount === 3 && idx === 0 ? '1' : undefined,
                    overflow: 'hidden',
                    borderRadius: appTheme.radii.radix1,
                    background: '#e0e0e0',
                  }}
                >
                  <img
                    src={url}
                    alt={`Post media ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '425px' }}>
          {showCommentButton && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onComment?.()
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
                void onRepost?.()
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
              void onLike?.()
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
                void onBookmark?.()
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
                onShare?.()
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

export default PostCard
