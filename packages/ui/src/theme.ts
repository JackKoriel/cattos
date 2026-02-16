import { createTheme, Theme as MuiTheme } from '@mui/material/styles'

// Extend the MUI Theme interface to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    gradients: {
      main: string
      orange: string
    }
    customShadows: {
      card: string
      ring: string
    }
    surface: {
      card: string
      elevated: string
      background: string
    }
    radii: {
      radix1: number
      radix2: number
      radix3: number
      radix4: number
      radix5: number
      radix6: number
    }
  }
  interface ThemeOptions {
    gradients?: {
      main?: string
      orange?: string
    }
    customShadows?: {
      card?: string
      ring?: string
    }
    surface?: {
      card?: string
      elevated?: string
      background?: string
    }
    radii?: {
      radix1?: number
      radix2?: number
      radix3?: number
      radix4?: number
      radix5?: number
      radix6?: number
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
  customShadows: {
    card: '0 4px 12px rgba(0,0,0,0.1)',
    ring: '0 8px 24px rgba(0,0,0,0.12)',
  },
  surface: {
    card: '#ffffff',
    elevated: '#ffffff',
    background: '#f7f7f8',
  },
  radii: {
    radix1: 2,
    radix2: 3,
    radix3: 4,
    radix4: 8,
    radix5: 12,
    radix6: 20,
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
