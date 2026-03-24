import { sql } from '../lib/db.js'
import { ensurePaymentOpsTable } from '../lib/paymentOps.js'
import { authorizePaymentLogsAdmin } from '../lib/paymentAdminAuth.js'

function parseLimit(raw) {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return 50
  return Math.min(200, Math.floor(n))
}

function parseHours(raw) {
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return 24
  return Math.min(24 * 30, Math.floor(n))
}

function isFailedStatus(status) {
  const st = String(status || '').toLowerCase()
  return st.includes('failed') || st.includes('invalid') || st.includes('forbidden') || st.includes('error')
}

export default async function handler(req, res) {
  const fail = (status, code, error) => res.status(status).json({ code, error })
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return fail(405, 'METHOD_NOT_ALLOWED', '请求方式不支持')
  }

  try {
    const authz = await authorizePaymentLogsAdmin(req)
    if (!authz.ok) {
      return fail(authz.status, authz.code, authz.error)
    }

    await ensurePaymentOpsTable()
    const mode = String(req.query.mode || '').trim().toLowerCase()
    if (mode === 'summary') {
      const hours = parseHours(req.query.hours)
      const providerQ = String(req.query.provider || '').trim().toLowerCase()
      const providerLike = providerQ || null
      const rows = await sql`
        SELECT provider, status, created_at
        FROM payment_event_logs
        WHERE created_at >= NOW() - (${hours} * INTERVAL '1 hour')
          AND (${providerLike} IS NULL OR provider = ${providerLike})
        ORDER BY id DESC
        LIMIT 5000
      `
      const summary = {
        ok: true,
        admin: authz.admin,
        window_hours: hours,
        provider: providerLike,
        total: rows.length,
        failed: 0,
        success: 0,
        idempotent_skip: 0,
        by_provider: {},
        by_status: {},
      }
      for (const r of rows) {
        const provider = String(r.provider || 'unknown').toLowerCase()
        const status = String(r.status || 'unknown').toLowerCase()
        if (!summary.by_provider[provider]) {
          summary.by_provider[provider] = { total: 0, failed: 0, success: 0, idempotent_skip: 0 }
        }
        summary.by_provider[provider].total += 1
        summary.by_status[status] = (summary.by_status[status] || 0) + 1
        if (status === 'idempotent_skip') {
          summary.idempotent_skip += 1
          summary.by_provider[provider].idempotent_skip += 1
        }
        if (status === 'membership_applied' || status === 'session_created' || status === 'event_processed') {
          summary.success += 1
          summary.by_provider[provider].success += 1
        }
        if (isFailedStatus(status)) {
          summary.failed += 1
          summary.by_provider[provider].failed += 1
        }
      }
      return res.status(200).json(summary)
    }

    const limit = parseLimit(req.query.limit)
    const rows = await sql`
      SELECT id, provider, event_key, source, user_id, session_id, plan, currency, status, error_code, error_message, created_at, updated_at
      FROM payment_event_logs
      ORDER BY id DESC
      LIMIT ${limit}
    `

    const providerQ = String(req.query.provider || '').trim().toLowerCase()
    const statusQ = String(req.query.status || '').trim().toLowerCase()
    const sessionIdQ = String(req.query.session_id || '').trim()
    const userIdQ = String(req.query.user_id || '').trim()
    const failedOnlyQ = String(req.query.failed_only || '').trim() === '1'

    const logs = rows.filter((r) => {
      if (providerQ && String(r.provider || '').toLowerCase() !== providerQ) return false
      if (statusQ && String(r.status || '').toLowerCase() !== statusQ) return false
      if (sessionIdQ && String(r.session_id || '') !== sessionIdQ) return false
      if (userIdQ && String(r.user_id || '') !== userIdQ) return false
      if (failedOnlyQ) {
        const st = String(r.status || '').toLowerCase()
        if (!st.includes('failed') && !st.includes('invalid') && !st.includes('forbidden') && !st.includes('error')) {
          return false
        }
      }
      return true
    })

    return res.status(200).json({
      ok: true,
      admin: authz.admin,
      total: logs.length,
      logs,
    })
  } catch (e) {
    console.error('payment-event-logs', e)
    return fail(500, 'PAYMENT_LOGS_QUERY_FAILED', '支付日志查询失败，请稍后重试')
  }
}
