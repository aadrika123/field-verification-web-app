import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port : 5000
  },
  build: {
    chunkSizeWarningLimit: 1000 // increase the chunk size limit to 1000kb
  }
})
