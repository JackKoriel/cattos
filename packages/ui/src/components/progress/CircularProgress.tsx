import {
  CircularProgress as MuiCircularProgress,
  CircularProgressProps as MuiCircularProgressProps,
} from '@mui/material'

export type CircularProgressProps = MuiCircularProgressProps

export const CircularProgress = (props: CircularProgressProps) => {
  return <MuiCircularProgress {...props} />
}
