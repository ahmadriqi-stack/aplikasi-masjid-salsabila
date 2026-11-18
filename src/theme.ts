export type ThemeKey = 'emerald' | 'midnight' | 'rose' | 'amber'

export interface Theme {
  key: ThemeKey
  name: string
  desc: string
  isDark: boolean
  swatch: [string, string, string]
  raw: {
    primary: string
    primaryDeep: string
    ink: string
    inkSoft: string
    gold: string
    goldDeep: string
    bg: string
    surface: string
    accent: string
    onAccent: string
    heroFrom: string
    heroVia: string
    heroTo: string
  }
}

export const THEMES: Theme[] = [
  {
    key: 'emerald',
    name: 'Emerald Classic',
    desc: 'Hijau masjid yang teduh dengan aksen emas',
    isDark: false,
    swatch: ['#0f766e', '#134e4a', '#fbbf24'],
    raw: {
      primary: '#0f766e',
      primaryDeep: '#134e4a',
      ink: '#1f2937',
      inkSoft: '#475569',
      gold: '#d4a017',
      goldDeep: '#92400e',
      bg: '#f5f2ea',
      surface: '#ffffff',
      accent: '#0d9488',
      onAccent: '#ffffff',
      heroFrom: '#134e4a',
      heroVia: '#0f766e',
      heroTo: '#115e59',
    },
  },
  {
    key: 'midnight',
    name: 'Midnight Azur',
    desc: 'Biru malam elegan untuk tampilan papan informasi',
    isDark: true,
    swatch: ['#1e3a8a', '#0f172a', '#60a5fa'],
    raw: {
      primary: '#1e3a8a',
      primaryDeep: '#1e293b',
      ink: '#e2e8f0',
      inkSoft: '#94a3b8',
      gold: '#fbbf24',
      goldDeep: '#b45309',
      bg: '#0b1220',
      surface: '#111a2e',
      accent: '#3b82f6',
      onAccent: '#ffffff',
      heroFrom: '#0f172a',
      heroVia: '#1e3a8a',
      heroTo: '#172554',
    },
  },
  {
    key: 'rose',
    name: 'Rose Garden',
    desc: 'Sage & rose yang hangat dan menenangkan',
    isDark: false,
    swatch: ['#9d5c63', '#5b7f6e', '#e8b4b8'],
    raw: {
      primary: '#5b7f6e',
      primaryDeep: '#3f5f4f',
      ink: '#3d2c2c',
      inkSoft: '#6b5555',
      gold: '#b76e5c',
      goldDeep: '#8c4a3c',
      bg: '#faf6f2',
      surface: '#ffffff',
      accent: '#9d5c63',
      onAccent: '#ffffff',
      heroFrom: '#3f5f4f',
      heroVia: '#5b7f6e',
      heroTo: '#9d5c63',
    },
  },
  {
    key: 'amber',
    name: 'Golden Amber',
    desc: 'Hangat seperti cahaya senja di kubah masjid',
    isDark: false,
    swatch: ['#b45309', '#78350f', '#fbbf24'],
    raw: {
      primary: '#b45309',
      primaryDeep: '#78350f',
      ink: '#44403c',
      inkSoft: '#78716c',
      gold: '#d97706',
      goldDeep: '#92400e',
      bg: '#fdf8ec',
      surface: '#ffffff',
      accent: '#d97706',
      onAccent: '#ffffff',
      heroFrom: '#78350f',
      heroVia: '#b45309',
      heroTo: '#92400e',
    },
  },
]

export const themeBy = (key: string): Theme =>
  THEMES.find((t) => t.key === key) ?? THEMES[0]
