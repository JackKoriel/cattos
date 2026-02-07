import { Box as MuiBox, BoxProps as MuiBoxProps } from '@mui/material'

export type BoxProps = MuiBoxProps

export const Box = (props: BoxProps) => {
  return <MuiBox {...props} />
}
