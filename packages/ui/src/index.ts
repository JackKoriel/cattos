export * from './components'
export * from './theme'
export { ThemeProvider } from '@mui/material'

import { useTheme, createTheme } from '@mui/material/styles'
import type { Theme } from './theme'

const _defaultTheme = createTheme()

export const useAppTheme = () => useTheme<Theme>() ?? (_defaultTheme as Theme)
export type { Theme as AppTheme } from './theme'
