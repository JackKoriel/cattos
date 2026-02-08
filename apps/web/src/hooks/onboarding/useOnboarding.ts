import { useEffect, useMemo, useRef, useState, type MouseEvent, type FocusEvent } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAuthLogout, useAuthSetCurrentUser, useAuthUser } from '@/stores/authStore'
import { apiClient, handleApiError } from '@/services/client'
import { uploadAvatar } from '@/services/uploads'
import { postsService } from '@/services/posts'
import type { ApiResponse, User } from '@cattos/shared'

import avatar01 from '@/assets/avatars/avatar_01.png'
import avatar02 from '@/assets/avatars/avatar_02.png'
import avatar03 from '@/assets/avatars/avatar_03.png'
import avatar04 from '@/assets/avatars/avatar_04.png'
import avatar05 from '@/assets/avatars/avatar_05.png'
import avatar06 from '@/assets/avatars/avatar_06.png'
import avatar07 from '@/assets/avatars/avatar_07.png'
import avatar08 from '@/assets/avatars/avatar_08.png'

const steps = ['Profile', 'Avatar', 'First post']

const presetAvatars = [
  avatar01,
  avatar02,
  avatar03,
  avatar04,
  avatar05,
  avatar06,
  avatar07,
  avatar08,
] as const

type OnboardingValues = {
  username: string
  displayName: string
  location: string
  avatarUrl: string
  firstPostContent: string
}

type UsernameAvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error'

export const useOnboarding = () => {
  const navigate = useNavigate()
  const user = useAuthUser()
  const setCurrentUser = useAuthSetCurrentUser()
  const logout = useAuthLogout()

  const [activeStep, setActiveStep] = useState(0)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const finishIntentRef = useRef(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [usernameAvailability, setUsernameAvailability] =
    useState<UsernameAvailabilityStatus>('idle')
  const [usernameAvailabilityMessage, setUsernameAvailabilityMessage] = useState<string | null>(
    null
  )
  const usernameCheckSeqRef = useRef(0)

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    }
  }, [avatarPreviewUrl])

  const validationSchema = useMemo(() => {
    if (activeStep === 0) {
      return Yup.object({
        username: Yup.string()
          .trim()
          .min(3, 'Must be at least 3 characters')
          .max(30, 'Must be 30 characters or less')
          .matches(/^[a-zA-Z0-9_]+$/, 'Can only contain letters, numbers, and underscores')
          .required('Required'),
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

            // Accept http(s) URLs (uploaded avatars) and Vite asset paths (preset avatars).
            if (
              value.startsWith('http://') ||
              value.startsWith('https://') ||
              value.startsWith('/') ||
              value.startsWith('./') ||
              value.startsWith('../') ||
              value.startsWith('data:') ||
              value.startsWith('blob:')
            ) {
              return true
            }

            return false
          }),
      })
    }

    return Yup.object({
      firstPostContent: Yup.string().trim().max(500, 'Too long'),
    })
  }, [activeStep, avatarFile])

  const formik = useFormik<OnboardingValues>({
    initialValues: {
      username: user?.username || '',
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

        const response = await apiClient.patch<ApiResponse<User>>('/auth/onboarding', {
          username: values.username.trim(),
          displayName: values.displayName.trim(),
          location: values.location.trim() || undefined,
          avatar: avatarUrl,
        })

        if (!response.data.data) {
          throw new Error(response.data.error || 'Failed to complete onboarding')
        }

        setCurrentUser(response.data.data)

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

  const checkUsernameAvailability = async (rawUsername: string): Promise<boolean> => {
    const username = rawUsername.trim()
    if (!username) return false

    // Skip availability check if it doesn't meet basic constraints yet.
    if (username.length < 3 || username.length > 30 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameAvailability('idle')
      setUsernameAvailabilityMessage(null)
      return true
    }

    const seq = ++usernameCheckSeqRef.current
    setUsernameAvailability('checking')
    setUsernameAvailabilityMessage(null)

    try {
      const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
        '/auth/username-available',
        {
          params: { username },
        }
      )

      if (seq !== usernameCheckSeqRef.current) return true

      const available = Boolean(response.data.data?.available)

      if (available) {
        setUsernameAvailability('available')
        setUsernameAvailabilityMessage(null)
        return true
      }

      setUsernameAvailability('taken')
      setUsernameAvailabilityMessage('Username already taken')
      return false
    } catch {
      if (seq !== usernameCheckSeqRef.current) return true
      setUsernameAvailability('error')
      setUsernameAvailabilityMessage('Unable to verify username right now')
      return false
    }
  }

  useEffect(() => {
    if (activeStep !== 0) return

    const username = formik.values.username.trim()
    if (!username) {
      setUsernameAvailability('idle')
      setUsernameAvailabilityMessage(null)
      return
    }

    // Don't ping the server until it meets basic format rules.
    if (username.length < 3 || username.length > 30 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameAvailability('idle')
      setUsernameAvailabilityMessage(null)
      return
    }

    const handle = window.setTimeout(() => {
      void checkUsernameAvailability(username)
    }, 450)

    return () => {
      window.clearTimeout(handle)
    }
  }, [activeStep, formik.values.username])

  const goNext = async () => {
    const errors = await formik.validateForm()

    const currentStepFields: Array<keyof OnboardingValues> =
      activeStep === 0
        ? ['username', 'displayName', 'location']
        : activeStep === 1
          ? ['avatarUrl']
          : ['firstPostContent']

    const hasStepErrors = currentStepFields.some((field) => Boolean(errors[field]))

    if (hasStepErrors) {
      currentStepFields.forEach((field) => formik.setFieldTouched(field, true, false))
      return
    }

    if (activeStep === 0) {
      const ok = await checkUsernameAvailability(formik.values.username)
      if (!ok) {
        formik.setFieldTouched('username', true, false)
        return
      }
    }

    setActiveStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const goBack = () => {
    setActiveStep((s) => Math.max(s - 1, 0))
  }

  const onUsernameBlur = async (e: FocusEvent<HTMLInputElement>) => {
    formik.handleBlur(e)
    await checkUsernameAvailability(e.currentTarget.value)
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
    usernameAvailability,
    usernameAvailabilityMessage,
    goNext,
    goBack,
    pickPresetAvatar,
    onAvatarUploadClick,
    onAvatarInputClick,
    onAvatarFileChange,
    markFinishIntent,
    onUsernameBlur,
    logout,
  }
}
