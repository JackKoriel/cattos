import { LoginScreenPresentation } from './presentation'
import { useLoginForm } from '@/hooks/auth/useLoginForm'

export const LoginScreen = () => {
  const { formik, authError } = useLoginForm()
  return <LoginScreenPresentation formik={formik} authError={authError} />
}
