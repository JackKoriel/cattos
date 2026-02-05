import { RegisterScreenPresentation } from './presentation'
import { useRegisterForm } from '@/hooks/auth/useRegisterForm'

export const RegisterScreen = () => {
  const { formik, authError } = useRegisterForm()
  return <RegisterScreenPresentation formik={formik} authError={authError} />
}
