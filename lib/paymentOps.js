import { sql } from './db.js'

let tableReady = false

export async function ensurePaymentOpsTable() {
  if (tableReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS payment_event_logs (
      id BIGSERIAL PRIMARY KEY,
      provider TEXT NOT NULL,
      event_key TEXT NOT NULL,
      source TEXT,
      user_id TEXT,
      session_id TEXT,
      plan TEXT,
      currency TEXT,
      status TEXT NOT NULL,
      error_code TEXT,
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(provider, event_key)
    )
  `
  tableReady = true
}

export async function upsertPaymentLog({
  provider,
  eventKey,
  source = null,
  userId = null,
  sessionId = null,
  plan = null,
  currency = null,
  status,
  errorCode = null,
  errorMessage = null,
}) {
  await ensurePaymentOpsTable()
  await sql`
    INSERT INTO payment_event_logs (
      provider, event_key, source, user_id, session_id, plan, currency, status, error_code, error_message, updated_at
    ) VALUES (
      ${provider}, ${eventKey}, ${source}, ${userId}, ${sessionId}, ${plan}, ${currency}, ${status}, ${errorCode}, ${errorMessage}, NOW()
    )
    ON CONFLICT (provider, event_key)
    DO UPDATE SET
      source = COALESCE(EXCLUDED.source, payment_event_logs.source),
      user_id = COALESCE(EXCLUDED.user_id, payment_event_logs.user_id),
      session_id = COALESCE(EXCLUDED.session_id, payment_event_logs.session_id),
      plan = COALESCE(EXCLUDED.plan, payment_event_logs.plan),
      currency = COALESCE(EXCLUDED.currency, payment_event_logs.currency),
      status = EXCLUDED.status,
      error_code = EXCLUDED.error_code,
      error_message = EXCLUDED.error_message,
      updated_at = NOW()
  `
}

export async function claimSessionPaid(provider, sessionId, source, info = {}) {
  await ensurePaymentOpsTable()
  const eventKey = `checkout_session_paid:${sessionId}`
  const inserted = await sql`
    INSERT INTO payment_event_logs (
      provider, event_key, source, user_id, session_id, plan, currency, status, updated_at
    ) VALUES (
      ${provider},
      ${eventKey},
      ${source},
      ${info.userId || null},
      ${sessionId},
      ${info.plan || null},
      ${info.currency || null},
      'processing',
      NOW()
    )
    ON CONFLICT (provider, event_key) DO NOTHING
    RETURNING id
  `
  return { claimed: inserted.length > 0, eventKey }
}
