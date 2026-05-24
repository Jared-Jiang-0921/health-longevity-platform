/** 解析 API JSON 请求体（与 api-server body 字符串约定一致） */
export function parseApiJsonBody(req, res) {
  try {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  } catch {
    res.status(400).json({ error: '请求数据格式不正确' })
    return null
  }
}
