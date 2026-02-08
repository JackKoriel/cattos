import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAuthError, useAuthRegister } from '@/stores/authStore'

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])/, 'Must include upper and lower case letters')
    .required('Required'),
})

export type RegisterFormValues = {
  email: string
  password: string
}

export const useRegisterForm = () => {
  const register = useAuthRegister()
  const authError = useAuthError()
  const navigate = useNavigate()

  const formik = useFormik<RegisterFormValues>({
    initialValues: { email: '', password: '' },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register(values)
        navigate('/onboarding', { replace: true })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return { formik, authError }
}
