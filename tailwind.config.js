/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D5AFE',
        secondary: '#00E5FF',
        accent: '#7C4DFF',
        dark: '#0A0E1A',
        light: '#F5F7FA',
        'custom-bg': '#F8FAFF',
        'custom-card': '#FFFFFF',
        'custom-border': '#E6F0FF'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'custom-card': '0 4px 20px rgba(61, 90, 254, 0.08)',
        'custom-button': '0 4px 12px rgba(61, 90, 254, 0.2)'
      }
    },
  },
  plugins: [],
}
