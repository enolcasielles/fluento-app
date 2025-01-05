export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
} as const;

export type SpacingName = keyof typeof spacing;
export type BorderRadiusName = keyof typeof borderRadius; 