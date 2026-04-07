/**
 * Airwallex 占位路由：POST /api/airwallex/webhook
 * 当前阶段仅保留端点与签名位；后续接入空中云汇回调验签与会员写入。
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const signature = req.headers['x-airwallex-signature']
  const webhookSecret = process.env.AIRWALLEX_WEBHOOK_SECRET?.trim()

  if (!signature || !webhookSecret) {
    return res.status(501).json({
      error: 'Airwallex webhook scaffold exists but signature validation is not implemented',
      provider: 'airwallex',
    })
  }

  return res.status(501).json({
    error: 'Airwallex webhook signature verification TODO',
    provider: 'airwallex',
  })
}
