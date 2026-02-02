import { Avatar, Box, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material'
import { Post } from '@cattos/shared'
import { ChatBubbleOutline, FavoriteBorder, Repeat, Share } from '@mui/icons-material'
import { formatDistanceToNowStrict } from 'date-fns'

export interface PostCardProps {
  post: Post
}

export const PostCard = ({ post }: PostCardProps) => {
  const { content, createdAt, likesCount, commentsCount, repostsCount } = post
  const safeLikesCount = likesCount ?? 0
  const safeCommentsCount = commentsCount ?? 0
  const safeRepostsCount = repostsCount ?? 0

  const timeAgo = formatDistanceToNowStrict(new Date(createdAt), {
    addSuffix: false,
  })

  return (
    <Card variant="outlined" sx={{ display: 'flex', p: 2, borderRadius: 3 }}>
      <Box sx={{ mr: 2 }}>
        <Avatar alt="user" />
      </Box>
      <Box sx={{ flex: 1 }}>
        <CardHeader
          disableTypography
          sx={{ p: 0, mb: 1 }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold' }}>Catto</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                @catto
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
          <IconButton size="small">
            <ChatBubbleOutline fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {safeCommentsCount}
            </Typography>
          </IconButton>
          <IconButton size="small">
            <Repeat fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {safeRepostsCount}
            </Typography>
          </IconButton>
          <IconButton size="small">
            <FavoriteBorder fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {safeLikesCount}
            </Typography>
          </IconButton>
          <IconButton size="small">
            <Share fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  )
}
