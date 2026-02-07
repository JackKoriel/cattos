import { Box, FormTextField, Button, Alert, EmailIcon, LockIcon, PawLoader } from '@cattos/ui'
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
        <FormTextField
          margin="normal"
          required
          fullWidth
          outsideLabel
          id="email"
          label="Email Address"
          placeholder="e.g. catty@example.com"
          name="email"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorText={formik.touched.email && formik.errors.email}
          startIcon={<EmailIcon color="action" fontSize="small" />}
        />
        <FormTextField
          margin="normal"
          required
          fullWidth
          outsideLabel
          name="password"
          label="Password"
          placeholder="Create a strong password"
          type="password"
          id="password"
          autoComplete="new-password"
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
          {formik.isSubmitting ? <PawLoader size="xSmall" color="inherit" /> : 'Enter Cattos'}
        </Button>
      </Box>
    </AuthCard>
  )
}
