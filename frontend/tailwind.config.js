/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F7F4',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#8A633F',
          dark: '#6F4F32',
          light: '#EFE7DD',
          subtle: '#FAF6F0',
        },
        ink: {
          DEFAULT: '#26231F',
          secondary: '#716C64',
          muted: '#9E988E',
        },
        border: {
          DEFAULT: '#E6E0D8',
          light: '#F0ECE6',
          dark: '#D5CDC2',
        },
        success: {
          DEFAULT: '#5F8A70',
          light: '#EEF5F1',
          border: '#D2E5DA',
        },
        warning: {
          DEFAULT: '#B48645',
          light: '#FBF5EC',
          border: '#EED9BF',
        },
        danger: {
          DEFAULT: '#B65F5F',
          light: '#FAF1F1',
          border: '#ECCECE',
        },
        info: {
          DEFAULT: '#66839A',
          light: '#EFF4F8',
          border: '#D0DFEA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(38, 35, 31, 0.04), 0 1px 2px rgba(38, 35, 31, 0.02)',
        card: '0 1px 4px rgba(38, 35, 31, 0.05), 0 2px 8px rgba(38, 35, 31, 0.03)',
        dropdown: '0 4px 16px rgba(38, 35, 31, 0.08), 0 1px 3px rgba(38, 35, 31, 0.04)',
      },
      borderRadius: {
        card: '14px',
      }
    },
  },
  plugins: [],
}
