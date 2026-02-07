import { Alert as MuiAlert, AlertProps as MuiAlertProps } from '@mui/material'

export type AlertProps = MuiAlertProps

export const Alert = (props: AlertProps) => {
  return <MuiAlert {...props} />
}
