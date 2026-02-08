import { useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'
import { OnboardingStatus } from '@cattos/shared'
import { useAuthError, useAuthLogin } from '@/stores/authStore'

const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required('Email or username is required'),
  password: Yup.string().required('Required'),
})

export type LoginFormValues = {
  identifier: string
  password: string
}

export const useLoginForm = () => {
  const login = useAuthLogin()
  const authError = useAuthError()
  const navigate = useNavigate()
  const location = useLocation()

  const from = useMemo(() => location.state?.from?.pathname || '/', [location.state])

  const isAuthRoute = (pathname: string) =>
    pathname === '/login' || pathname === '/register' || pathname === '/onboarding'

  const formik = useFormik<LoginFormValues>({
    initialValues: { identifier: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const user = await login(values)

        if (user.onboardingStatus !== OnboardingStatus.Complete) {
          navigate('/onboarding', { replace: true })
          return
        }

        const target = !from || isAuthRoute(from) ? '/' : from
        navigate(target, { replace: true })
      } finally {
        setSubmitting(false)
      }
    },
  })

  return { formik, authError }
}
