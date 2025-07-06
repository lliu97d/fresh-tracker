import { createTamagui } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
import { createMedia } from '@tamagui/react-native-media-driver'

const headingFont = createInterFont()
const bodyFont = createInterFont()

const config = createTamagui({
  defaultFont: 'body',
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...themes,
    light: {
      background: '#ffffff',
      backgroundHover: '#f8f9fa',
      backgroundPress: '#e9ecef',
      backgroundFocus: '#ffffff',
      borderColor: '#dee2e6',
      color: '#212529',
      colorHover: '#495057',
      colorPress: '#6c757d',
      colorFocus: '#212529',
      placeholderColor: '#6c7280',
      primary: '#22c55e',
      secondary: '#2563eb',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    dark: {
      background: '#1a1a1a',
      backgroundHover: '#2d2d2d',
      backgroundPress: '#404040',
      backgroundFocus: '#1a1a1a',
      borderColor: '#404040',
      color: '#ffffff',
      colorHover: '#e5e5e5',
      colorPress: '#d4d4d4',
      colorFocus: '#ffffff',
      placeholderColor: '#a3a3a3',
      primary: '#22c55e',
      secondary: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  tokens: {
    ...tokens,
    color: {
      ...tokens.color,
      primary: '#22c55e',
      secondary: '#2563eb',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  shorthands,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config 