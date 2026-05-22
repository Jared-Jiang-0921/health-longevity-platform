/** 模块资料直链；登录用户附带 access_token 供 <video>/<audio> 鉴权 */
export function moduleAssetUrl(id, token) {
  const base = `/api/module-assets/${encodeURIComponent(String(id || '').trim())}`
  const t = String(token || '').trim()
  if (!t) return base
  return `${base}?access_token=${encodeURIComponent(t)}`
}
