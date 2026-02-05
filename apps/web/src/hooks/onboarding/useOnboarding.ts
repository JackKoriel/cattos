import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { handleApiError } from '@/services/client'
import { uploadAvatar } from '@/services/uploads'
import { usersService } from '@/services/users'
import { postsService } from '@/services/posts'

const steps = ['Profile', 'Avatar', 'First post']

const presetAvatars = [
  'https://placekitten.com/256/256',
  'https://placekitten.com/257/257',
  'https://placekitten.com/258/258',
  'https://placekitten.com/259/259',
] as const

type OnboardingValues = {
  displayName: string
  location: string
  avatarUrl: string
  firstPostContent: string
}

export const useOnboarding = () => {
  const navigate = useNavigate()
  const { user, setCurrentUser } = useAuth()

  const [activeStep, setActiveStep] = useState(0)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const finishIntentRef = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    }
  }, [avatarPreviewUrl])

  const validationSchema = useMemo(() => {
    if (activeStep === 0) {
      return Yup.object({
        displayName: Yup.string()
          .trim()
          .min(2, 'Too short')
          .max(40, 'Too long')
          .required('Required'),
        location: Yup.string().trim().max(60, 'Too long'),
      })
    }

    if (activeStep === 1) {
      return Yup.object({
        avatarUrl: Yup.string()
          .trim()
          .test('avatar-required', 'Pick an avatar or upload one', (value) => {
            if (avatarFile) return true
            return Boolean(value)
          })
          .test('avatar-url', 'Must be a valid URL', (value) => {
            if (avatarFile) return true
            if (!value) return false
            try {
              const u = new URL(value)
              return u.protocol === 'http:' || u.protocol === 'https:'
            } catch {
              return false
            }
          }),
      })
    }

    return Yup.object({
      firstPostContent: Yup.string().trim().max(500, 'Too long'),
    })
  }, [activeStep, avatarFile])

  const formik = useFormik<OnboardingValues>({
    initialValues: {
      displayName: user?.displayName || user?.username || '',
      location: user?.location || '',
      avatarUrl: user?.avatar || '',
      firstPostContent: '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, helpers) => {
      if (!user?.id) return

      if (activeStep !== steps.length - 1) {
        const errors = await helpers.validateForm()

        const currentStepFields: Array<keyof OnboardingValues> =
          activeStep === 0
            ? ['displayName', 'location']
            : activeStep === 1
              ? ['avatarUrl']
              : ['firstPostContent']

        const hasStepErrors = currentStepFields.some((field) => Boolean(errors[field]))
        if (hasStepErrors) {
          currentStepFields.forEach((field) => helpers.setFieldTouched(field, true, false))
          return
        }

        setActiveStep((s) => Math.min(s + 1, steps.length - 1))
        return
      }

      if (!finishIntentRef.current) return
      finishIntentRef.current = false

      setSubmitting(true)
      setError(null)

      try {
        let avatarUrl = values.avatarUrl

        if (avatarFile) {
          const uploaded = await uploadAvatar(avatarFile)
          avatarUrl = uploaded.url
        }

        const updatedUser = await usersService.update(user.id, {
          displayName: values.displayName.trim(),
          location: values.location.trim() || undefined,
          avatar: avatarUrl,
        })

        setCurrentUser(updatedUser)

        if (values.firstPostContent.trim()) {
          await postsService.create({
            content: values.firstPostContent.trim(),
            visibility: 'public',
            mediaUrls: [],
          })
        }

        navigate('/', { replace: true })
      } catch (err) {
        const apiError = handleApiError(err)
        setError(apiError.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const goNext = async () => {
    const errors = await formik.validateForm()

    const currentStepFields: Array<keyof OnboardingValues> =
      activeStep === 0
        ? ['displayName', 'location']
        : activeStep === 1
          ? ['avatarUrl']
          : ['firstPostContent']

    const hasStepErrors = currentStepFields.some((field) => Boolean(errors[field]))

    if (hasStepErrors) {
      currentStepFields.forEach((field) => formik.setFieldTouched(field, true, false))
      return
    }

    setActiveStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const goBack = () => {
    setActiveStep((s) => Math.max(s - 1, 0))
  }

  const pickPresetAvatar = (url: string) => {
    setAvatarFile(null)
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    setAvatarPreviewUrl(null)
    formik.setFieldValue('avatarUrl', url)
  }

  const onAvatarUploadClick = () => {
    avatarInputRef.current?.click()
  }

  const onAvatarInputClick = (e: MouseEvent<HTMLInputElement>) => {
    e.currentTarget.value = ''
  }

  const onAvatarFileChange = (file: File | null) => {
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)

    setAvatarFile(file)
    if (file) {
      const preview = URL.createObjectURL(file)
      setAvatarPreviewUrl(preview)
      formik.setFieldValue('avatarUrl', '')
    } else {
      setAvatarPreviewUrl(null)
    }
  }

  const markFinishIntent = () => {
    finishIntentRef.current = true
  }

  return {
    user,
    steps,
    presetAvatars,
    activeStep,
    submitting,
    error,
    avatarPreviewUrl,
    avatarInputRef,
    formik,
    goNext,
    goBack,
    pickPresetAvatar,
    onAvatarUploadClick,
    onAvatarInputClick,
    onAvatarFileChange,
    markFinishIntent,
  }
}
