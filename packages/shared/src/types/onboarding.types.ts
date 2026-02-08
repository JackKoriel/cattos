export const OnboardingStatus = {
  InProgress: 'inProgress',
  Complete: 'complete',
} as const

export type OnboardingStatus = (typeof OnboardingStatus)[keyof typeof OnboardingStatus]
