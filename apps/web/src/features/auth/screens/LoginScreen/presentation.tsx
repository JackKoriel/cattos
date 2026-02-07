import { Box, FormTextField, Button, Alert, EmailIcon, LockIcon, PawLoader } from '@cattos/ui'
import type { FormikProps } from 'formik'
import type { LoginFormValues } from '@/hooks/auth/useLoginForm'
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
        <FormTextField
          margin="normal"
          required
          fullWidth
          outsideLabel
          id="identifier"
          label="Email or Username"
          placeholder="e.g. catty@example.com or catty123"
          name="identifier"
          autoComplete="username"
          autoFocus
          value={formik.values.identifier}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorText={formik.touched.identifier && formik.errors.identifier}
          startIcon={<EmailIcon color="action" fontSize="small" />}
        />
        <FormTextField
          margin="normal"
          required
          fullWidth
          outsideLabel
          name="password"
          label="Password"
          placeholder="••••••••"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorText={formik.touched.password && formik.errors.password}
          startIcon={<LockIcon color="action" fontSize="small" />}
        />
        {authError && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {authError}
          </Alert>
        )}
        <Button type="submit" fullWidth variant="orange" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? <PawLoader size="xSmall" color="inherit" /> : 'Enter the Catverse'}
        </Button>
      </Box>
    </AuthCard>
  )
}
