// tailwind.config.js
import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0E7490',     // Teal
        secondary: '#22C55E',   // Green
        accent: '#FACC15',      // Yellow
        background: '#F0F9FF',  // Light Blue
        darkText: '#1E293B',    // Dark Gray-Blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
})
