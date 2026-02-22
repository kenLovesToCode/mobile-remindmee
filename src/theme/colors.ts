export const palette = {
  primary: '#258cf4',
  backgroundLight: '#f5f7f8',
  backgroundDark: '#101922',
  slateSurface: '#1c2632',
  slateBorder: '#2d3a4b',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  red500: '#ef4444',
  orange500: '#f97316',
  green500: '#22c55e',
  amber500: '#f59e0b',
  cyan500: '#06b6d4',
  pink500: '#ec4899',
  indigo500: '#6366f1',
} as const;

export const theme = {
  isDark: true,
  colors: {
    background: palette.backgroundDark,
    surface: palette.slateSurface,
    surfaceSoft: palette.slate800,
    border: palette.slateBorder,
    textPrimary: '#f8fafc',
    textSecondary: palette.slate400,
    textMuted: palette.slate500,
    primary: palette.primary,
    primarySoft: 'rgba(37, 140, 244, 0.15)',
    danger: palette.red500,
  },
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;
