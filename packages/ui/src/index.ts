export * from './components'
export * from './theme'
export { ThemeProvider } from '@mui/material'

import { useTheme } from '@mui/material/styles'
import type { Theme } from './theme'

export const useAppTheme = () => useTheme<Theme>()
export type { Theme as AppTheme } from './theme'
