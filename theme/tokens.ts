// Sombras
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 5,
  },
} as const;

// Opacidades
export const opacities = {
  disabled: 0.5,
  hover: 0.8,
  overlay: 0.5,
} as const;

// Dimensiones
export const dimensions = {
  touchableHeight: 48,
  touchableMinWidth: 44,
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
  },
  maxContentWidth: 480,
} as const;

// Animaciones
export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
  },
} as const;

// Z-Index
export const zIndex = {
  modal: 1000,
  overlay: 900,
  drawer: 800,
  header: 700,
  toast: 600,
} as const;

// Bordes
export const borders = {
  width: {
    thin: 1,
    medium: 2,
    thick: 3,
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
} as const; 