import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { theme } from '@cattos/ui'

/**
 * Custom render function that wraps components with ThemeProvider.
 * Use this instead of render() in tests that use MUI components.
 */
export function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
    ...options,
  })
}

export * from '@testing-library/react'
