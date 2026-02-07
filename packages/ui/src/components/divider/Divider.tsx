import { Divider as MuiDivider, DividerProps as MuiDividerProps } from '@mui/material'

export type DividerProps = MuiDividerProps

export const Divider = (props: DividerProps) => {
  return <MuiDivider {...props} />
}
