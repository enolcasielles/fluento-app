// Paleta de colores base
const palette = {
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  green: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  yellow: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
} as const;

// Tokens semánticos de color
export const colors = {
  // Colores Principales
  primary: palette.blue[600],
  primaryLight: palette.blue[500],
  primaryDark: palette.blue[700],
  secondary: palette.green[500],
  secondaryLight: palette.green[400],
  secondaryDark: palette.green[600],

  // Colores Neutros
  background: palette.gray[50],
  surface: palette.gray[100],
  surfaceHover: palette.gray[200],
  surfaceActive: palette.gray[300],
  border: palette.gray[200],
  borderFocus: palette.blue[500],

  // Texto
  textPrimary: palette.gray[800],
  textSecondary: palette.gray[500],
  textTertiary: palette.gray[400],
  textInverted: palette.gray[50],
  textLink: palette.blue[600],
  textLinkHover: palette.blue[700],

  // Estados
  success: palette.green[500],
  successLight: palette.green[100],
  error: palette.red[500],
  errorLight: palette.red[100],
  warning: palette.yellow[500],
  warningLight: palette.yellow[100],
  info: palette.blue[500],
  infoLight: palette.blue[100],

  // Estados de componentes
  disabled: palette.gray[200],
  disabledText: palette.gray[400],
  placeholder: palette.gray[400],
  overlay: palette.gray[900],
  shadow: palette.gray[900],
} as const;

export type ColorName = keyof typeof colors;
export type PaletteColor = keyof typeof palette;
export type PaletteShade = keyof typeof palette.blue; // Todas las paletas tienen las mismas shades 