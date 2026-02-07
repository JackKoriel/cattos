import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { PawIcon } from './PawIcon'

export type PawLoaderSize = 'xSmall' | 'small' | 'medium' | 'large'

export type PawLoaderSizeProp = PawLoaderSize | number

const SIZE_PX: Record<PawLoaderSize, number> = {
  xSmall: 32,
  small: 64,
  medium: 128,
  large: 256,
}

const FONT_SIZE: Record<PawLoaderSize, string> = {
  xSmall: '0.75rem',
  small: '0.9rem',
  medium: '1.25rem',
  large: '1.75rem',
}

export interface PawLoaderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Box>,
  'children'
> {
  /**
   * Size preset or an explicit pixel value.
   * Defaults to 'medium' (128px).
   */
  size?: PawLoaderSizeProp
  /**
   * Label shown under the paw. Use "" or null to hide.
   * Defaults to 'Loading…'.
   */
  text?: string | null
  /**
   * Sets the color of both the paw and the text.
   * Defaults to 'white'.
   */
  color?: string

  /**
   * Alignment of the paw and text.
   * Defaults to 'vertical'.
   */
  alignment?: 'vertical' | 'horizontal'
}

export function PawLoader({
  size = 'medium',
  text,
  color = 'white',
  alignment = 'vertical',
  sx,
  ...boxProps
}: PawLoaderProps) {
  const isPreset = typeof size === 'string'
  const px = isPreset ? SIZE_PX[size] : size
  const fontSize = isPreset ? FONT_SIZE[size] : '1rem'

  return (
    <Box
      {...boxProps}
      sx={{
        display: 'inline-flex',
        flexDirection: alignment === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: alignment === 'vertical' ? 1 : 2,
        userSelect: 'none',
        color,
        ...sx,
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <PawIcon
        width={px}
        height={px}
        aria-hidden="true"
        focusable="false"
        style={{ display: 'block' }}
      />

      {text ? (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            lineHeight: 1.2,
            fontWeight: 500,
            fontSize,
          }}
        >
          {text}
        </Typography>
      ) : null}
    </Box>
  )
}
