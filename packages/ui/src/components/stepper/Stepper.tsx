import {
  Stepper as MuiStepper,
  StepperProps as MuiStepperProps,
  Step as MuiStep,
  StepProps as MuiStepProps,
  StepLabel as MuiStepLabel,
  StepLabelProps as MuiStepLabelProps,
} from '@mui/material'

export type StepperProps = MuiStepperProps
export type StepProps = MuiStepProps
export type StepLabelProps = MuiStepLabelProps

export const Stepper = (props: StepperProps) => {
  return <MuiStepper {...props} />
}

export const Step = (props: StepProps) => {
  return <MuiStep {...props} />
}

export const StepLabel = (props: StepLabelProps) => {
  return <MuiStepLabel {...props} />
}
