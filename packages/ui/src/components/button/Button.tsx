import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material'

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /**
   * Custom variants for Cattos
   */
  variant?: 'primary' | 'secondary' | 'orange' | 'ghost' | 'contained' | 'outlined' | 'text'
}

export const Button = ({ variant = 'primary', sx, ...props }: ButtonProps) => {
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
    case 'primary':
      muiVariant = 'contained'
      customSx = {
        bgcolor: '#1976d2',
        color: 'white',
        '&:hover': { bgcolor: '#1565c0' },
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
    case 'ghost':
      muiVariant = 'outlined'
      customSx = {
        color: '#1976d2',
        borderColor: '#1976d2',
        '&:hover': {
          borderColor: '#115293',
          bgcolor: 'rgba(25, 118, 210, 0.04)',
        },
      }
      break
    case 'outlined':
      muiVariant = 'outlined'
      break
    case 'text':
      muiVariant = 'text'
      break
    default:
      muiVariant = 'contained'
      break
  }

  return (
    <MuiButton
      {...props}
      variant={muiVariant}
      sx={{
        borderRadius: 2,
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
