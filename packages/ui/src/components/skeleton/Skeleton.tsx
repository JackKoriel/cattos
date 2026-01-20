import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps } from '@mui/material'

export type SkeletonProps = MuiSkeletonProps

export const Skeleton = (props: SkeletonProps) => {
  return <MuiSkeleton {...props} />
}
