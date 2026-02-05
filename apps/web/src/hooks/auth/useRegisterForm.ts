import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Must be at least 3 characters')
    .max(20, 'Must be 20 characters or less')
    .matches(/^[a-zA-Z0-9_]+$/, 'Can only contain letters, numbers, and underscores')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
})

export type RegisterFormValues = {
  username: string
  email: string
  password: string
}

export const useRegisterForm = () => {
  const { register, error: authError } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik<RegisterFormValues>({
    initialValues: { username: '', email: '', password: '' },
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
