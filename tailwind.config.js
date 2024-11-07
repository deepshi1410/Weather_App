/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'temp': ['8rem', { lineHeight: '1' }],
        'huge': ['6rem', { lineHeight: '1' }],
      },
      colors: {
        weather: {
          overlay: 'rgba(255, 255, 255, 0.08)',
          'overlay-hover': 'rgba(255, 255, 255, 0.12)',
          'overlay-active': 'rgba(255, 255, 255, 0.16)',
        },
      },
    },
  },
  plugins: [],
}