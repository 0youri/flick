/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'dark': '#272635',
        'primary-light': '#E8E9F3',
        'primary': '#A6A6A8',
        'accent-gray': '#CECECE',
        'accent-sky': '#B1E5F2',
      }
    },
  },
  plugins: [],
   
}