import { Avatar as MuiAvatar, IconButton as MuiIconButton, SxProps, Theme } from '@mui/material'

export interface AvatarButtonProps {
  src?: string
  selected?: boolean
  onClick?: () => void
  sx?: SxProps<Theme>
  avatarSx?: SxProps<Theme>
}

export const AvatarButton = ({ src, selected, onClick, sx, avatarSx }: AvatarButtonProps) => {
  return (
    <MuiIconButton
      onClick={onClick}
      sx={{
        p: 0,
        border: '4px solid',
        borderColor: selected ? 'primary.main' : 'transparent',
        borderRadius: '50%',
        bgcolor: 'transparent',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'scale(1.06)',
          bgcolor: 'transparent',
        },
        ...sx,
      }}
    >
      <MuiAvatar
        src={src}
        sx={{
          width: '100%',
          height: '100%',
          aspectRatio: '1/1',
          ...avatarSx,
        }}
      />
    </MuiIconButton>
  )
}
