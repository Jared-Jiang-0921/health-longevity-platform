// 阿里云函数计算入口（仅导出 handler，不会在 ECS 上监听端口）。
// ECS / 自建服务器请用 pm2 启动：server/api-server.mjs（不要将此文件当作 HTTP 入口）。
export { handler } from './fc/backend-entry.mjs'

