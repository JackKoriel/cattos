import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { CssBaseline } from '@cattos/ui'
import { initAuth } from '@/stores/authStore'

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    void initAuth()
  }, [])

  return <>{children}</>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthInitializer>
        <CssBaseline />
        <App />
      </AuthInitializer>
    </BrowserRouter>
  </React.StrictMode>
)
