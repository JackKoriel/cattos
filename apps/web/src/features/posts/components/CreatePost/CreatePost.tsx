import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Avatar,
  TextField,
  Button,
  ActionButton,
  Stack,
  IconButton,
  Typography,
  ImageIcon,
  EmojiEmotionsIcon,
  Popover,
} from '@cattos/ui'
import { useAuthUser } from '@/stores/authStore'
import { apiClient, handleApiError } from '@/services/client'
import { uploadPostMedia } from '@/services/uploads'
import type { Post } from '@cattos/shared'
import { createTempPost } from '@/utils/optimistic'
import { emojis } from '../../constants/emojis'

interface CreatePostProps {
  onBeforeCreate?: (tempPost: Post) => void
  onPostCreated?: (serverPost: Post, tempId: string) => void
  onPostFailed?: (tempId: string) => void
}

export const CreatePost = ({ onBeforeCreate, onPostCreated, onPostFailed }: CreatePostProps) => {
  const navigate = useNavigate()
  const user = useAuthUser()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(null)

  const handleEmojiClick = (emoji: string) => {
    setContent((prev) => prev + emoji)
    setEmojiAnchor(null)
  }

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return

    setLoading(true)
    setError(null)
    const curUser = user!

    const tempPost = createTempPost({
      author: {
        id: curUser.id,
        username: curUser.username,
        displayName: curUser.displayName,
        avatar: curUser.avatar,
      },
      content,
    })
    const tempId = tempPost.id

    try {
      // notify parent to optimistically insert
      onBeforeCreate?.(tempPost)

      let mediaUrls: string[] | undefined
      if (mediaFiles.length > 0) {
        const uploaded = await uploadPostMedia(mediaFiles)
        mediaUrls = uploaded.map((u) => u.url)
      }

      const response = await apiClient.post('/posts', {
        content,
        visibility: 'public',
        ...(mediaUrls ? { mediaUrls } : {}),
      })

      const serverPost: Post = response.data.data

      // notify parent to replace temp with server post
      onPostCreated?.(serverPost, tempId)
      setContent('')
      setMediaFiles([])
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      // notify parent to remove temp post
      onPostFailed?.(tempId)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Box
      p={3}
      bgcolor="white"
      borderRadius={3}
      boxShadow="0 4px 12px rgba(0,0,0,0.1)"
      sx={{ transition: 'box-shadow 0.2s' }}
    >
      <Stack direction="row" spacing={2}>
        <Avatar
          src={user.avatar}
          alt={user.username}
          onClick={() => navigate(`/profile/${user.username}`)}
          sx={{ width: 48, height: 48, cursor: 'pointer' }}
        />
        <Box flex={1}>
          <TextField
            fullWidth
            placeholder="What's happening?!"
            multiline
            minRows={2}
            variant="standard"
            InputProps={{ disableUnderline: true, style: { fontSize: '1.1rem' } }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          {error && (
            <Box color="error.main" fontSize="caption.fontSize" mt={1}>
              {error}
            </Box>
          )}

          <Box
            mt={2}
            borderTop={1}
            borderColor="divider"
            pt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1}>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.currentTarget.files ?? [])
                  // Allow up to 4 total
                  const next = [...mediaFiles, ...files].slice(0, 4)
                  setMediaFiles(next)
                  e.currentTarget.value = ''
                }}
              />

              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || mediaFiles.length >= 4}
                sx={{ color: 'text.secondary' }}
              >
                <ImageIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => setEmojiAnchor(e.currentTarget)}
                sx={{ color: 'text.secondary' }}
              >
                <EmojiEmotionsIcon />
              </IconButton>
              <Popover
                open={Boolean(emojiAnchor)}
                anchorEl={emojiAnchor}
                onClose={() => setEmojiAnchor(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      p: 1,
                      mt: 1,
                      width: 350,
                      maxHeight: 300,
                      overflowY: 'auto',
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 0.5,
                  }}
                >
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      sx={{
                        minWidth: 40,
                        height: 40,
                        fontSize: '1.25rem',
                        padding: 0,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </Box>
              </Popover>
            </Stack>

            <ActionButton
              label="Post"
              onClick={handleSubmit}
              loading={loading}
              disabled={!content.trim() && mediaFiles.length === 0}
            />
          </Box>

          {mediaFiles.length > 0 && (
            <Box mt={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {mediaFiles.length} image{mediaFiles.length === 1 ? '' : 's'} selected
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setMediaFiles([])}
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  Clear
                </Button>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {mediaFiles.map((f) => f.name).join(', ')}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  )
}
