/** GET /api/health — 用于 ECS/Nginx 自检：确认 Node API 已启动且路由可达 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  return res.status(200).json({ ok: true, service: 'health-longevity-api' })
}
