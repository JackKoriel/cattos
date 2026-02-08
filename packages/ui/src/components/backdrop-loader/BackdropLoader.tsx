import { Backdrop, useTheme } from '@mui/material'
import { PawLoader, PawLoaderProps } from '../loading-paw/PawLoader'

export interface BackdropLoaderProps extends Omit<PawLoaderProps, 'color'> {
  open: boolean
}

export const BackdropLoader = ({ open, size = 'large', ...props }: BackdropLoaderProps) => {
  const theme = useTheme()
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={open}
    >
      <PawLoader color="white" size={size} {...props} />
    </Backdrop>
  )
}
