import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '../../theme'

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /**
   * Custom variants for Cattos
   */
  variant?: 'contained' | 'outlined' | 'text' | 'secondary' | 'orange'
}

export const Button = ({ variant = 'contained', sx, ...props }: ButtonProps) => {
  const theme = useTheme<Theme>()

  let muiVariant: 'contained' | 'outlined' | 'text' = 'contained'
  let customSx = {}

  switch (variant) {
    case 'orange':
      muiVariant = 'contained'
      customSx = {
        bgcolor: '#f57c00',
        color: 'white',
        '&:hover': { bgcolor: '#e65100' },
        boxShadow: 'none',
      }
      break
    case 'secondary':
      muiVariant = 'contained'
      customSx = {
        bgcolor: 'grey.200',
        color: 'text.primary',
        '&:hover': { bgcolor: 'grey.300' },
        boxShadow: 'none',
      }
      break
    case 'outlined':
      muiVariant = 'outlined'
      break
    case 'text':
      muiVariant = 'text'
      break
    case 'contained':
    default:
      muiVariant = 'contained'
      customSx = {
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
      }
      break
  }

  return (
    <MuiButton
      {...props}
      variant={muiVariant}
      sx={{
        borderRadius: theme.radii.radix1,
        alignItems: 'center',
        justifyContent: 'center',
        py: 1.2,
        px: 3,
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        ...customSx,
        ...sx,
      }}
    />
  )
}
