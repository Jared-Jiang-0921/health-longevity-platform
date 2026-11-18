import net from 'node:net'

const BLOCKED_HOSTS = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata',
  'metadata.google.internal',
  'metadata.google.com',
  'instance-data',
])

export class ConsultLinkError extends Error {
  constructor(code) {
    super(code)
    this.name = 'ConsultLinkError'
    this.code = code
  }
}

function bareHost(hostname) {
  const host = String(hostname || '').trim().toLowerCase()
  if (host.startsWith('[') && host.endsWith(']')) return host.slice(1, -1)
  return host
}

function ipv4ToInt(parts) {
  return (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0
}

function ipv4Blocked(parts) {
  const [a, b] = parts
  if (a === 0 || a === 10 || a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  if (a === 192 && b === 0) return true
  if (a === 198 && (b === 18 || b === 19)) return true
  if (a >= 224) return true
  return false
}

/** 把十进制、十六进制、八进制和省略写法还原成 4 段 IPv4。URL 解析器没展开时也能拦住。 */
export function parseIPv4Literal(hostname) {
  const host = bareHost(hostname)
  if (!host || host.includes(':')) return null
  const parts = host.split('.')
  if (parts.some((part) => !/^(0x[0-9a-f]+|\d+)$/i.test(part))) return null
  const nums = parts.map((part) => {
    if (/^0x/i.test(part)) return Number.parseInt(part, 16)
    if (/^0\d/.test(part)) return Number.parseInt(part, 8)
    return Number.parseInt(part, 10)
  })
  if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null
  if (parts.length === 1) {
    const n = nums[0]
    if (n > 0xffffffff) return null
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
  }
  if (parts.length > 4) return null
  const head = nums.slice(0, -1)
  if (head.some((n) => n > 255)) return null
  const last = nums[nums.length - 1]
  const remain = 4 - head.length
  if (last >= 256 ** remain) return null
  const tail = []
  for (let i = remain - 1; i >= 0; i -= 1) tail.push((last >> (8 * i)) & 255)
  const bytes = head.concat(tail)
  return bytes.length === 4 ? bytes : null
}

function mappedIpv4(address) {
  const host = bareHost(address).toLowerCase()
  const dotted = host.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i)
  if (dotted) return parseIPv4Literal(dotted[1])
  const hex = host.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i)
  if (!hex) return null
  const hi = Number.parseInt(hex[1], 16)
  const lo = Number.parseInt(hex[2], 16)
  return [(hi >> 8) & 255, hi & 255, (lo >> 8) & 255, lo & 255]
}

export function isBlockedAddress(address) {
  const host = bareHost(address)
  if (!host) return true
  const v4 = parseIPv4Literal(host)
  if (v4) return ipv4Blocked(v4)
  const family = net.isIP(host)
  if (family === 4) {
    const parts = host.split('.').map((n) => Number(n))
    return ipv4Blocked(parts)
  }
  if (family === 6) {
    const mapped = mappedIpv4(host)
    if (mapped) return ipv4Blocked(mapped)
    if (host === '::' || host === '::1') return true
    if (host.startsWith('fe80:') || host.startsWith('fe8') || host.startsWith('fe9') || host.startsWith('fea') || host.startsWith('feb')) return true
    if (host.startsWith('fc') || host.startsWith('fd')) return true
    if (host.startsWith('ff')) return true
    if (host.startsWith('fec') || host.startsWith('fed') || host.startsWith('fee') || host.startsWith('fef')) return true
    return false
  }
  return false
}

function hostBlocked(hostname) {
  const host = bareHost(hostname)
  if (!host || BLOCKED_HOSTS.has(host)) return true
  if (host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.localdomain')) {
    return true
  }
  if (isBlockedAddress(host)) return true
  return false
}

export function assertPublicUrl(input) {
  let url
  try {
    url = input instanceof URL ? input : new URL(String(input || '').trim())
  } catch {
    throw new ConsultLinkError('INVALID_URL')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new ConsultLinkError('INVALID_URL')
  if (url.username || url.password) throw new ConsultLinkError('CREDENTIALS')
  const expectedPort = url.protocol === 'https:' ? '443' : '80'
  if (url.port && url.port !== expectedPort) throw new ConsultLinkError('BAD_PORT')
  if (hostBlocked(url.hostname)) throw new ConsultLinkError('BLOCKED_ADDRESS')
  return url
}

export function assertPublicAddresses(records) {
  const list = Array.isArray(records) ? records : []
  if (!list.length) throw new ConsultLinkError('DNS_FAIL')
  for (const record of list) {
    const address = typeof record === 'string' ? record : record?.address
    if (!address || isBlockedAddress(address)) throw new ConsultLinkError('BLOCKED_ADDRESS')
  }
  const first = list[0]
  const address = typeof first === 'string' ? first : first.address
  const family = typeof first === 'string' ? net.isIP(address) : (first.family || net.isIP(address))
  return { address, family: Number(family) === 6 ? 6 : 4 }
}

export function isHttpsDowngrade(fromUrl, toUrl) {
  return fromUrl.protocol === 'https:' && toUrl.protocol === 'http:'
}

const SECRET_QUERY = /^(token|key|secret|password|passwd|access_token|auth|signature|sig|session|jwt|apikey|api_key)$/i

/** 引用里保留可核验的网址，但去掉查询串中的密钥。 */
export function redactConsultUrl(input) {
  const url = input instanceof URL ? new URL(input.href) : new URL(String(input))
  for (const key of [...url.searchParams.keys()]) {
    if (SECRET_QUERY.test(key)) url.searchParams.delete(key)
  }
  url.hash = ''
  url.username = ''
  url.password = ''
  return url.href
}
