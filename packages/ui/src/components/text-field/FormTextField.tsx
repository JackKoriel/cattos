import { ReactNode, useState } from 'react'
import { TextField, TextFieldProps, InputAdornment } from './TextField'
import { Typography } from '../typography'
import { Box } from '../box'
import { IconButton } from '../icon-button'
import { Visibility, VisibilityOff } from '../icons'

export interface FormTextFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  /**
   * Error message to display. If provided, the field will be in error state.
   */
  errorText?: string | null | boolean
  /**
   * Optional helper text to display when there is no error.
   */
  helperText?: string | null
  /**
   * Optional icon to display at the start of the input.
   */
  startIcon?: ReactNode
  /**
   * Optional icon or component to display at the end of the input (e.g. status spinner).
   */
  endIcon?: ReactNode
  /**
   * If true, the label will be rendered as a Typography component above the input.
   */
  outsideLabel?: boolean
}

/**
 * A specialized TextField for forms that simplifies error handling and icon placement.
 */
export const FormTextField = ({
  errorText,
  helperText,
  startIcon,
  endIcon,
  InputProps,
  outsideLabel,
  label,
  ...props
}: FormTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const isError = Boolean(errorText)
  const displayHelperText = isError && typeof errorText === 'string' ? errorText : helperText

  const isPassword = props.type === 'password'
  const actualType = isPassword ? (showPassword ? 'text' : 'password') : props.type

  const handleTogglePasswordVisibility = () => {
    setShowPassword((show) => !show)
  }

  const finalEndIcon = isPassword ? (
    <IconButton
      aria-label="toggle password visibility"
      onClick={handleTogglePasswordVisibility}
      edge="end"
      size="small"
    >
      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
    </IconButton>
  ) : (
    endIcon
  )

  const textField = (
    <TextField
      {...props}
      type={actualType}
      margin={outsideLabel ? 'none' : props.margin}
      label={outsideLabel ? undefined : label}
      error={isError}
      helperText={displayHelperText || ' '}
      FormHelperTextProps={{
        sx: {
          minHeight: '20px',
          visibility: displayHelperText ? 'visible' : 'hidden',
        },
      }}
      InputProps={{
        ...InputProps,
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : (
          InputProps?.startAdornment
        ),
        endAdornment: finalEndIcon ? (
          <InputAdornment position="end">{finalEndIcon}</InputAdornment>
        ) : (
          InputProps?.endAdornment
        ),
      }}
    />
  )

  if (outsideLabel && label) {
    return (
      <Box sx={{ width: '100%', mb: props.margin === 'normal' ? 2 : 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 0.5,
            fontWeight: 600,
            color: 'text.secondary',
            display: 'block',
            textAlign: 'left',
          }}
        >
          {label}
          {props.required && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
        <Box>{textField}</Box>
      </Box>
    )
  }

  return textField
}
