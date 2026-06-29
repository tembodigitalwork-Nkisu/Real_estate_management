import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#dceafe',
          200: '#bcd5fd',
          300: '#8eb6fb',
          400: '#598cf6',
          500: '#3366ef',
          600: '#1f4ce4',
          700: '#1a3bd1',
          800: '#1c33aa',
          900: '#1d3086',
          950: '#161f52',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
