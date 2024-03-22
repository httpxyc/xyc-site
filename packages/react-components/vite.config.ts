import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),qiankun('react components',{useDevMode: process.env.NODE_ENV !== 'production'})],
})
