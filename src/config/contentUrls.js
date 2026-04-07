/**
 * 内容资源入口（知识库、文档站等，与咨询通道独立）。
 * 仅当 URL 为 http(s) 时生效；ima:// 等协议无法在浏览器内直接打开，请配置可访问的 https 落地页。
 */
const e = import.meta.env

export function getContentEntryUrl() {
  const u =
    String(e.VITE_CONTENT_ENTRY_URL || '').trim() ||
    String(e.VITE_CONTENT_HUB_URL || '').trim() ||
    String(e.VITE_IMA_WEB_URL || '').trim()
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  return ''
}
