import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
} from '@mui/material'

export type TextFieldProps = MuiTextFieldProps

export const TextField = (props: TextFieldProps) => {
  return <MuiTextField {...props} />
}

export { InputAdornment }
