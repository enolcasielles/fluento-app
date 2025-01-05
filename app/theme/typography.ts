export const typography = {
  // Títulos
  h1: {
    fontSize: 24,
    fontWeight: '600',
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },

  // Texto Regular
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
  },

  // Variantes de peso
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type TypographyVariant = keyof typeof typography; 