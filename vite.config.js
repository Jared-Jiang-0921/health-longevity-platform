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
      // AI 健康咨询后端（默认 3001，避免与主站 api-server:3000 冲突）
      '/api/ai': {
        target: process.env.VITE_AI_PROXY_TARGET || 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      // 主站 api-server（商品目录 / 证据卡等）
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})
