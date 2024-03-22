import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置编译入口文件
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: './src/mainQiankun.tsx',
  //     },
  //   },
  // },
})
