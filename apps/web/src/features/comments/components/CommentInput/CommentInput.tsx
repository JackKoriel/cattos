import { useState } from 'react'
import { Box, Avatar, TextField, ActionButton, Stack } from '@cattos/ui'
import { useAuthUser } from '@/stores/authStore'
import { apiClient, handleApiError } from '@/services/client'
import { Post } from '@cattos/shared'
import { createTempComment } from '@/utils/optimistic'

interface CommentInputProps {
  postId: string
  onBeforeComment?: (comment: Post) => void
  onCommentCreated?: (serverComment: Post, tempId: string) => void
  onCommentFailed?: (tempId: string) => void
}

export const CommentInput = ({
  postId,
  onBeforeComment,
  onCommentCreated,
  onCommentFailed,
}: CommentInputProps) => {
  const user = useAuthUser()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setLoading(true)
    setError(null)
    const tempComment = createTempComment({
      author: {
        id: user!.id,
        username: user!.username,
        displayName: user!.displayName,
        avatar: user!.avatar,
      },
      content,
      parentPostId: postId,
    })
    const tempId = tempComment.id

    try {
      onBeforeComment?.(tempComment)

      const response = await apiClient.post('/posts', {
        content,
        parentPostId: postId,
        visibility: 'public',
      })

      setContent('')
      const serverComment: Post = response.data.data
      onCommentCreated?.(serverComment, tempId)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      onCommentFailed?.(tempId)
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
            <ActionButton
              label="Reply"
              onClick={handleSubmit}
              loading={loading}
              disabled={!content.trim()}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
