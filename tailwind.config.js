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
      backgroundImage: theme => ({
        'gradient-to-b': 'linear-gradient(to top, var(--tw-gradient-stops))',
      }),
      gradientColorStops: theme => ({
        'primary': 'rgba(0, 0, 0, 0.6)', // customize your colors
        'secondary': 'rgba(115, 115, 115, 0)',
      }),
    },
    variants: {
      display: ['group-hover']
    }
  },
  plugins: [],
}