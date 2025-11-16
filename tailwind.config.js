/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        male: {
          light: '#C084FC',
          DEFAULT: '#A855F7',
          dark: '#7E22CE'
        },
        female: {
          light: '#FDA4AF',
          DEFAULT: '#FB7185',
          dark: '#E11D48'
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
