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
} from '@cattos/ui'
import { useAuthUser } from '@/stores/authStore'
import { apiClient, handleApiError } from '@/services/client'
import { uploadPostMedia } from '@/services/uploads'

interface CreatePostProps {
  onPostCreated?: () => void
}

export const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const navigate = useNavigate()
  const user = useAuthUser()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return

    setLoading(true)
    setError(null)

    try {
      let mediaUrls: string[] | undefined

      if (mediaFiles.length > 0) {
        const uploaded = await uploadPostMedia(mediaFiles)
        mediaUrls = uploaded.map((u) => u.url)
      }

      await apiClient.post('/posts', {
        content,
        visibility: 'public',
        ...(mediaUrls ? { mediaUrls } : {}),
      })
      setContent('')
      setMediaFiles([])
      if (onPostCreated) onPostCreated()
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
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
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <EmojiEmotionsIcon />
              </IconButton>
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
