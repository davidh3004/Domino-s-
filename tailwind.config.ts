import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          oak: '#C8A96E',
          walnut: '#5C3A1E',
          mahogany: '#8B2E16',
          black: '#1A1A1A',
        },
        brand: {
          gold: '#C9A84C',
          dark: '#0F0F0F',
          surface: '#F5F0E8',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
