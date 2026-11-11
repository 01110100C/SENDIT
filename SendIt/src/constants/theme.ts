// Raw palette
const PALETTE = {
  forestDeep: '#132A1F',
  forest: '#1F3B2C',
  forestLight: '#2A4A37',
  forestSunken: '#183022',
  beige: '#E3D5B3',
  beigeLight: '#EDE6D1',
  stone: '#A3A196',
  stoneDark: '#4C5C52',
  clay: '#C46A3C',
};

// What the app uses. Change the theme here, not in individual screens.
export const COLORS = {
  background: PALETTE.forest, // screen background
  surface: PALETTE.forestLight, // cards, inputs, buttons
  surfaceSunken: PALETTE.forestSunken, // insets inside cards
  text: PALETTE.beigeLight, // main text and icons
  textMuted: PALETTE.stone, // secondary text, placeholders
  border: PALETTE.stoneDark, // card and input outlines
  primary: PALETTE.beige, // main buttons, active tab, grade badges
  onPrimary: PALETTE.forestDeep, // text/icons drawn on top of primary
  accent: PALETTE.stone, // avatars, placeholder icons
  like: PALETTE.clay, // liked heart
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const BOULDER_GRADES = Array.from({ length: 18 }, (_, i) => `V${i}`);

export const ROUTE_GRADES = [
  '5.6', '5.7', '5.8', '5.9',
  ...['10', '11', '12', '13', '14', '15'].flatMap((n) =>
    ['a', 'b', 'c', 'd'].map((l) => `5.${n}${l}`),
  ),
];
