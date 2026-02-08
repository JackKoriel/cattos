import { useState } from 'react'
import { Box, Avatar, TextField, Button, Stack, PawLoader } from '@cattos/ui'
import { useAuthUser } from '@/stores/authStore'
import { apiClient, handleApiError } from '@/services/client'
import { Post } from '@cattos/shared'

interface CommentInputProps {
  postId: string
  onCommentAdded?: (comment: Post) => void
}

export const CommentInput = ({ postId, onCommentAdded }: CommentInputProps) => {
  const user = useAuthUser()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post('/posts', {
        content,
        parentPostId: postId,
        visibility: 'public',
      })

      setContent('')
      if (onCommentAdded && response.data.data) {
        onCommentAdded(response.data.data)
      }
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && content.trim()) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!user) return null

  return (
    <Box
      p={2}
      bgcolor="white"
      borderRadius={3}
      boxShadow="0 4px 12px rgba(0,0,0,0.1)"
      sx={{ transition: 'box-shadow 0.2s' }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar src={user.avatar} alt={user.username} sx={{ width: 40, height: 40 }}>
          {user.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box flex={1}>
          <TextField
            fullWidth
            placeholder="Post your reply"
            multiline
            minRows={1}
            maxRows={4}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            sx={{ mb: 1 }}
          />
          {error && (
            <Box color="error.main" fontSize="caption.fontSize" mb={1}>
              {error}
            </Box>
          )}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              sx={{ borderRadius: 20, px: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              {loading ? <PawLoader size="small" text="" color="inherit" /> : 'Reply'}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
