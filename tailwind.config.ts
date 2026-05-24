import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 20px 120px rgba(16, 185, 129, 0.18)',
      },
      colors: {
        brand: {
          dark: '#020617',
          surface: '#111827',
        },
      },
    },
  },
  plugins: [],
}

export default config
