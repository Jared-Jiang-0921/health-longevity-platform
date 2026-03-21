import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 本地与 Payment.jsx 默认路径一致；需另开 terminal 运行 server/create-payment-intent.js（默认 4242）
      '/api/create-payment-intent': {
        target: 'http://localhost:4242',
        changeOrigin: true,
        rewrite: () => '/create-payment-intent',
      },
    },
  },
})
