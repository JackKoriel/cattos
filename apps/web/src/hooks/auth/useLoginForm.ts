import { useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required('Email or username is required'),
  password: Yup.string().required('Required'),
})

export type LoginFormValues = {
  identifier: string
  password: string
}

export const useLoginForm = () => {
  const { login, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = useMemo(() => location.state?.from?.pathname || '/', [location.state])

  const formik = useFormik<LoginFormValues>({
    initialValues: { identifier: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values)
        navigate(from, { replace: true })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return { formik, authError }
}
