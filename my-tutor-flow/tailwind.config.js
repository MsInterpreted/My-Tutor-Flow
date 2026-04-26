/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body: ['"Open Sans"', 'sans-serif'],
      },
      colors: {
        phonics: { DEFAULT: '#0D9488', light: '#CCFBF1', dark: '#0F766E' },
        comprehension: { DEFAULT: '#7C3AED', light: '#EDE9FE', dark: '#6D28D9' },
        language: { DEFAULT: '#2563EB', light: '#DBEAFE', dark: '#1D4ED8' },
        gold: { DEFAULT: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
      },
    },
  },
  plugins: [],
}

