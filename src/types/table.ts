export type WoodPreset = 'oak' | 'walnut' | 'mahogany' | 'black'
export type FeltColor = 'green' | 'blue' | 'red' | 'burgundy' | 'black' | 'gray'
export type LegColor = 'match-wood' | 'black' | 'white' | 'chrome'

export interface TableConfig {
  felt: FeltColor
  wood: WoodPreset
  legColor: LegColor
  logoUrl: string | null
  accessories: {
    cupHolders: boolean
    leds: boolean
    ledColor: string
    decorativeSurface: boolean
  }
}

export const WOOD_COLORS: Record<WoodPreset, string> = {
  oak: '#C8A96E',
  walnut: '#5C3A1E',
  mahogany: '#8B2E16',
  black: '#1A1A1A',
}

export const FELT_COLORS: Record<FeltColor, string> = {
  green: '#2D6A4F',
  blue: '#1A5276',
  red: '#922B21',
  burgundy: '#6E2C49',
  black: '#1C1C1C',
  gray: '#616A6B',
}

export const LEG_COLORS: Record<LegColor, string> = {
  'match-wood': '',
  black: '#1A1A1A',
  white: '#F0F0F0',
  chrome: '#C0C0C0',
}

export const DEFAULT_CONFIG: TableConfig = {
  felt: 'green',
  wood: 'walnut',
  legColor: 'match-wood',
  logoUrl: null,
  accessories: {
    cupHolders: true,
    leds: false,
    ledColor: '#ffffff',
    decorativeSurface: false,
  },
}
