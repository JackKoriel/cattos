import { Box, Typography, TextField, Button, Container, Paper, Alert } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'

const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required('Email or username is required'),
  password: Yup.string().required('Required'),
})

export const LoginPage = () => {
  const { login, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values)
        navigate(from, { replace: true })
      } catch (err) {
        // Error is already set in the auth context
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in to Cattos 🐱
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="identifier"
            label="Email or Username"
            name="identifier"
            autoComplete="username"
            autoFocus
            value={formik.values.identifier}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.identifier && Boolean(formik.errors.identifier)}
            helperText={formik.touched.identifier && formik.errors.identifier}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          {authError && <Alert severity="error">{authError}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
          <Box textAlign="center">
            <RouterLink to="/register">{"Don't have an account? Sign Up"}</RouterLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
