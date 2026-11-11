export const COLORS = {
  forest: '#132A1F',
  green: '#2E5339',
  moss: '#6B8F71',
  gold: '#C9A227',
  clay: '#A6592F',
  offwhite: '#EDE6D1',
  card: '#F7F3E8',
  muted: '#7A7A6E',
  border: '#D8D0BA',
  white: '#FFFFFF',
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
