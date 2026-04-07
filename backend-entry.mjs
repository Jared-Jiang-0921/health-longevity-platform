// Function Compute 入口：为了兼容 FC 的 Handler 配置格式（FileName.MethodName），
// 这里把真正逻辑放在 `fc/backend-entry.mjs`，并在根目录做转发导出。
export { handler } from './fc/backend-entry.mjs'

