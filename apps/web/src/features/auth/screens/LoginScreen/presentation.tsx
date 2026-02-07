import { Box, TextField, Button, Alert, Link } from '@cattos/ui'
import type { FormikProps } from 'formik'
import type { LoginFormValues } from '@/hooks/auth/useLoginForm'
import { Link as RouterLink } from 'react-router-dom'
import { AuthCard } from '../../components/AuthCard'

export const LoginScreenPresentation = ({
  formik,
  authError,
}: {
  formik: FormikProps<LoginFormValues>
  authError: string | null
}) => {
  return (
    <AuthCard mode="login">
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        {authError && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {authError}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: '#f57c00',
            '&:hover': { bgcolor: '#e65100' },
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: 'none',
          }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Entering...' : 'Enter the Catverse'}
        </Button>
      </Box>
    </AuthCard>
  )
}
