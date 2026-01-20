import type { ReactNode } from 'react'
import { Box, BoxProps } from '@mui/material'

export interface LayoutProps extends BoxProps {
  sidebar?: ReactNode
  children: ReactNode
}

export const Layout = ({ sidebar, children, ...props }: LayoutProps) => {
  return (
    <Box display="flex" minHeight="100vh" {...props}>
      {sidebar && (
        <Box
          component="aside"
          width={280}
          bgcolor="background.paper"
          borderRight={1}
          borderColor="divider"
          overflow="auto"
        >
          {sidebar}
        </Box>
      )}
      <Box component="main" flex={1} overflow="auto">
        {children}
      </Box>
    </Box>
  )
}
