import { Box, TextField, Button, Alert } from '@mui/material'
import type { FormikProps } from 'formik'
import type { RegisterFormValues } from '@/hooks/auth/useRegisterForm'
import { AuthCard } from '../../components/AuthCard'

export const RegisterScreenPresentation = ({
  formik,
  authError,
}: {
  formik: FormikProps<RegisterFormValues>
  authError: string | null
}) => {
  return (
    <AuthCard mode="register">
      <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
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
          autoComplete="new-password"
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
          {formik.isSubmitting ? 'Joining...' : 'Enter the Catverse'}
        </Button>
      </Box>
    </AuthCard>
  )
}
