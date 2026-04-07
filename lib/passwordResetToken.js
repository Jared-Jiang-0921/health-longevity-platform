import { createHash, randomBytes } from 'node:crypto'

export function generateRawResetToken() {
  return randomBytes(32).toString('hex')
}

export function hashResetToken(raw) {
  return createHash('sha256').update(String(raw), 'utf8').digest('hex')
}
