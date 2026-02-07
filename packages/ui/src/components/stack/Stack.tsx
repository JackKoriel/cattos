import { Stack as MuiStack, StackProps as MuiStackProps } from '@mui/material'

export type StackProps = MuiStackProps

export const Stack = (props: StackProps) => {
  return <MuiStack {...props} />
}
