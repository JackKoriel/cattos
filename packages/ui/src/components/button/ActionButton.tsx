import { Button, ButtonProps } from './Button'
import { PawLoader } from '../loading-paw'
import { GRADIENTS } from '../../theme'

export interface ActionButtonProps extends Omit<ButtonProps, 'children'> {
  loading?: boolean
  label: string
}

export const ActionButton = ({
  loading,
  label,
  variant = 'orange',
  sx,
  ...props
}: ActionButtonProps) => {
  return (
    <Button
      variant={variant}
      disabled={props.disabled || loading}
      sx={{
        width: '120px',
        height: '52px',
        borderRadius: 50,
        px: 3,
        textTransform: 'none',
        fontWeight: 'bold',
        ...(variant === 'orange' && {
          background: GRADIENTS.orange,
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
          color: 'white',
          '&:hover': {
            background: GRADIENTS.orange,
            opacity: 0.9,
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {loading ? <PawLoader size="xSmall" color="inherit" /> : label}
    </Button>
  )
}
