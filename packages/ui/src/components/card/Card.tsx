import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material'

export type CardProps = MuiCardProps

export const Card = (props: CardProps) => {
  return <MuiCard {...props} />
}
