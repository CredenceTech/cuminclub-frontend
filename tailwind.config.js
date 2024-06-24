/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'custom-font': ['Outfit', 'sans-serif'],
        'skillet': ['SkilletCondensed', 'sans-serif'],
        'futura': ['FuturaPTMedium', 'sans-serif'],
        'futuraBold': ['FuturaBold', 'sans-serif'],
      }, 
    },
  },
  plugins: [],
}