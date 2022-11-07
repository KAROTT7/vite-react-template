import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import router from 'vite-plugin-react-views'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), router()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
