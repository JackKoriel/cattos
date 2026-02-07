import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogContent as MuiDialogContent,
  DialogContentProps as MuiDialogContentProps,
} from '@mui/material'

export type DialogProps = MuiDialogProps
export type DialogContentProps = MuiDialogContentProps

export const Dialog = (props: DialogProps) => {
  return <MuiDialog {...props} />
}

export const DialogContent = (props: DialogContentProps) => {
  return <MuiDialogContent {...props} />
}
