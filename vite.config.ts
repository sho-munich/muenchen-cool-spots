import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages serviert das Projekt unter /muenchen-cool-spots/
  base: '/muenchen-cool-spots/',
  plugins: [react()],
  server: {
    host: true,
  },
})
