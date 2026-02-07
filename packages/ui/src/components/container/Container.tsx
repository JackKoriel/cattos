import { Container as MuiContainer, ContainerProps as MuiContainerProps } from '@mui/material'

export type ContainerProps = MuiContainerProps

export const Container = (props: ContainerProps) => {
  return <MuiContainer {...props} />
}
