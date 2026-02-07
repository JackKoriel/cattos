import { Snackbar as MuiSnackbar, SnackbarProps as MuiSnackbarProps } from '@mui/material'

export type SnackbarProps = MuiSnackbarProps

export const Snackbar = (props: SnackbarProps) => {
  return <MuiSnackbar {...props} />
}
