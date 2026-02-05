import { useRef, useState } from 'react'
import {
  Box,
  Avatar,
  TextField,
  Button,
  Stack,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material'
import { Image, EmojiEmotions } from '@mui/icons-material'
import { useAuth } from '@/features/auth/context/AuthContext'
import { apiClient, handleApiError } from '@/services/client'
import { uploadPostMedia } from '@/services/uploads'

interface CreatePostProps {
  onPostCreated?: () => void
}

export const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth()
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
    <Box p={2} borderBottom={1} borderColor="divider">
      <Stack direction="row" spacing={2}>
        <Avatar src={user.avatar} alt={user.username} />
        <Box flex={1}>
          <TextField
            fullWidth
            placeholder="What is happening?!"
            multiline
            minRows={2}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          {error && (
            <Box color="error.main" fontSize="caption.fontSize" mt={1}>
              {error}
            </Box>
          )}

          {mediaFiles.length > 0 && (
            <Box mt={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {mediaFiles.length} image{mediaFiles.length === 1 ? '' : 's'} selected
                </Typography>
                <Button
                  size="small"
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

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            borderTop={1}
            borderColor="divider"
            pt={1}
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
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || mediaFiles.length >= 4}
              >
                <Image fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary">
                <EmojiEmotions fontSize="small" />
              </IconButton>
            </Stack>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={(!content.trim() && mediaFiles.length === 0) || loading}
              sx={{ borderRadius: 20, px: 3, textTransform: 'none', fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
