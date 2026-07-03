import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // "Acacia" green — an earthier, more premium identity than stock blue.
        brand: {
          50: '#f1f7f2',
          100: '#dcebe0',
          200: '#bad7c3',
          300: '#8dbb9d',
          400: '#5c9975',
          500: '#3b7d57',
          600: '#2b6444',
          700: '#235038',
          800: '#1f402e',
          900: '#1b3527',
          950: '#0d1f15',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
