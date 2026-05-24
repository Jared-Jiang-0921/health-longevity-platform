/** 从 req.query 读取动态路由参数（如 [id].js） */
export function getQueryParam(req, key) {
  const v = req.query?.[key]
  if (Array.isArray(v)) return String(v[0] || '').trim()
  return String(v || '').trim()
}
