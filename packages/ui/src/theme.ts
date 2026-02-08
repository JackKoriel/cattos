import { createTheme, Theme as MuiTheme } from '@mui/material/styles'

// Extend the MUI Theme interface to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    gradients: {
      main: string
      orange: string
    }
  }
  interface ThemeOptions {
    gradients?: {
      main?: string
      orange?: string
    }
  }
}

export const GRADIENTS = {
  main: 'linear-gradient(180deg, #A088F9 0%, #FFBA93 100%)',
  orange: 'linear-gradient(90deg, #FF8E53 0%, #FF6B6B 100%)',
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#A088F9',
    },
    secondary: {
      main: '#FFBA93',
    },
  },
  gradients: {
    main: GRADIENTS.main,
    orange: GRADIENTS.orange,
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
})

export type Theme = MuiTheme
