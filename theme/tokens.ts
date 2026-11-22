// Design tokens for the redesign (#73). Colours come from the UX proposal mockups.
// Screens read colours through useTheme(), never directly from this palette.

export const palette = {
  cream: '#FFF4E6',
  white: '#FFFFFF',
  sand: '#FBEBD6',
  line: '#EAD9C3',
  ink: '#2B1E16',
  inkMuted: '#6B5A4E',
  inkFaint: '#BFAFA2',
  tomato: '#D9402F',
  tomatoSoft: '#FBDCD5',
  mintBackground: '#EAF7F0',
  mintSoft: '#D7F0E3',
  mint: '#1F7A55',
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  line: string;
  text: string;
  textMuted: string;
  textDisabled: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
};

// Cream look used while focusing and when idle.
export const lightColors: ThemeColors = {
  background: palette.cream,
  surface: palette.white,
  surfaceMuted: palette.sand,
  line: palette.line,
  text: palette.ink,
  textMuted: palette.inkMuted,
  textDisabled: palette.inkFaint,
  accent: palette.tomato,
  accentSoft: palette.tomatoSoft,
  onAccent: palette.white,
};

// Applied automatically during short and long breaks (not a selectable theme).
export const breakColors: ThemeColors = {
  ...lightColors,
  background: palette.mintBackground,
  accent: palette.mint,
  accentSoft: palette.mintSoft,
};

// Icon tiles in settings rows: tomato for focus-related rows, mint for break-related ones.
export const tileTones = {
  focus: { background: palette.tomatoSoft, icon: palette.tomato },
  break: { background: palette.mintSoft, icon: palette.mint },
} as const;

export type TileTone = keyof typeof tileTones;

// Mascot colours: default ginger tabby coat.
export const mascotColors = {
  fur: '#FCE6C8',
  stripes: '#EE9A45',
  ears: '#F6B3A6',
  ink: palette.ink,
  rim: palette.line,
} as const;

export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  pill: 999,
} as const;

export const buttonSize = {
  primary: 72,
  secondary: 56,
  header: 48,
} as const;

// Soft shadow used by cards and round buttons.
export const elevation = {
  card: {
    elevation: 3,
    shadowColor: palette.ink,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
} as const;
