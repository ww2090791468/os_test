/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0ff',
          100: '#d1e1ff',
          200: '#aac3ff',
          300: '#7fa5ff',
          400: '#4a90e2',
          500: '#266fe8',
          600: '#0052d9',
          700: '#003cab',
          800: '#002a7c',
          900: '#001a57',
        },
      },
      fontFamily: {
        sans: ['PingFang SC', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
