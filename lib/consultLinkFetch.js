import http from 'node:http'
import https from 'node:https'
import zlib from 'node:zlib'
import { lookup as dnsLookup } from 'node:dns/promises'
import {
  CONSULT_LINK_HTML_BYTES,
  CONSULT_LINK_PDF_BYTES,
  CONSULT_LINK_RAW_BYTES,
  CONSULT_LINK_REDIRECTS,
  CONSULT_LINK_TEXT_BUDGET,
  CONSULT_LINK_TIMEOUT_MS,
} from './consultLinkLimits.js'
import {
  ConsultLinkError,
  assertPublicAddresses,
  assertPublicUrl,
  isHttpsDowngrade,
  redactConsultUrl,
} from './consultLinkPolicy.js'
import { extractHtmlArticle } from './consultLinkText.js'
import { extractPdfBufferText } from './consultLinkPdf.js'

const REDIRECT = new Set([301, 302, 303, 307, 308])

export async function defaultLookup(hostname) {
  return dnsLookup(hostname, { all: true, verbatim: true })
}

function headerValue(headers, name) {
  const value = headers?.[name] ?? headers?.[name.toLowerCase()]
  if (Array.isArray(value)) return String(value[0] || '')
  return String(value || '')
}

export function readLimitedBuffer(chunks, maxBytes) {
  let size = 0
  const out = []
  for (const chunk of chunks) {
    size += chunk.length
    if (size > maxBytes) throw new ConsultLinkError('TOO_LARGE')
    out.push(chunk)
  }
  return Buffer.concat(out)
}

function decompress(buffer, encoding, maxBytes) {
  const enc = String(encoding || '').toLowerCase()
  if (!enc || enc === 'identity') return buffer.length > maxBytes ? Promise.reject(new ConsultLinkError('TOO_LARGE')) : Promise.resolve(buffer)
  let stream
  if (enc.includes('br')) stream = zlib.createBrotliDecompress()
  else if (enc.includes('gzip')) stream = zlib.createGunzip()
  else if (enc.includes('deflate')) stream = zlib.createInflate()
  else return Promise.reject(new ConsultLinkError('UNSUPPORTED_TYPE'))
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    stream.on('data', (chunk) => {
      size += chunk.length
      if (size > maxBytes) {
        stream.destroy()
        reject(new ConsultLinkError('TOO_LARGE'))
        return
      }
      chunks.push(chunk)
    })
    stream.on('error', () => reject(new ConsultLinkError('FETCH_FAIL')))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.end(buffer)
  })
}

export function defaultRequest({ url, pinned, timeoutMs = CONSULT_LINK_TIMEOUT_MS, maxRawBytes = CONSULT_LINK_RAW_BYTES, signal }) {
  const lib = url.protocol === 'https:' ? https : http
  const hostname = url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname
  return new Promise((resolve, reject) => {
    const req = lib.request({
      protocol: url.protocol,
      hostname,
      port: url.port || undefined,
      path: `${url.pathname || '/'}${url.search || ''}`,
      method: 'GET',
      headers: {
        Host: hostname,
        'User-Agent': 'HealthLongevityConsult/1.0 (+https://www.healthlongevity.cn)',
        Accept: 'text/html,application/pdf,text/plain;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.6',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      servername: hostname,
      timeout: timeoutMs,
      signal,
      lookup(host, options, callback) {
        const cb = typeof options === 'function' ? options : callback
        const opts = typeof options === 'function' ? {} : (options || {})
        if (host !== hostname && host !== url.hostname) {
          cb(new ConsultLinkError('BLOCKED_ADDRESS'))
          return
        }
        if (opts.all) {
          cb(null, [{ address: pinned.address, family: pinned.family }])
          return
        }
        cb(null, pinned.address, pinned.family)
      },
    }, (res) => {
      const chunks = []
      let size = 0
      res.on('data', (chunk) => {
        size += chunk.length
        if (size > maxRawBytes) {
          res.destroy()
          reject(new ConsultLinkError('TOO_LARGE'))
          return
        }
        chunks.push(chunk)
      })
      res.on('error', () => reject(new ConsultLinkError('FETCH_FAIL')))
      res.on('end', () => {
        resolve({
          status: res.statusCode || 0,
          headers: {
            location: headerValue(res.headers, 'location'),
            'content-type': headerValue(res.headers, 'content-type'),
            'content-encoding': headerValue(res.headers, 'content-encoding'),
          },
          body: Buffer.concat(chunks),
        })
      })
    })
    req.on('timeout', () => {
      req.destroy()
      reject(new ConsultLinkError('TIMEOUT'))
    })
    req.on('error', (err) => {
      if (err instanceof ConsultLinkError) reject(err)
      else if (err?.name === 'AbortError') reject(new ConsultLinkError('TIMEOUT'))
      else {
        const wrapped = new ConsultLinkError('FETCH_FAIL')
        wrapped.cause = err
        reject(wrapped)
      }
    })
    req.end()
  })
}

function looksLikePdf(url, contentType) {
  return /pdf/i.test(contentType) || url.pathname.toLowerCase().endsWith('.pdf')
}

export async function fetchPublicResource(rawUrl, deps = {}) {
  const lookup = deps.lookup || defaultLookup
  const request = deps.request || defaultRequest
  let current = assertPublicUrl(rawUrl)
  for (let hop = 0; hop <= CONSULT_LINK_REDIRECTS; hop += 1) {
    const records = await resolveRecords(current.hostname, lookup)
    const pinned = assertPublicAddresses(records)
    const response = await request({
      url: current,
      pinned,
      timeoutMs: deps.timeoutMs || CONSULT_LINK_TIMEOUT_MS,
      maxRawBytes: CONSULT_LINK_RAW_BYTES,
      signal: deps.signal,
    })
    if (REDIRECT.has(response.status)) {
      if (hop === CONSULT_LINK_REDIRECTS) throw new ConsultLinkError('REDIRECT_LIMIT')
      if (!response.headers.location) throw new ConsultLinkError('REDIRECT_LIMIT')
      const next = assertPublicUrl(new URL(response.headers.location, current))
      if (isHttpsDowngrade(current, next)) throw new ConsultLinkError('DOWNGRADE')
      current = next
      continue
    }
    if (response.status === 401 || response.status === 402 || response.status === 403 || response.status === 407 || response.status === 429) {
      throw new ConsultLinkError(`HTTP_${response.status}`)
    }
    if (response.status >= 400 || response.status < 200) throw new ConsultLinkError('HTTP_ERROR')
    const maxBytes = looksLikePdf(current, response.headers['content-type']) ? CONSULT_LINK_PDF_BYTES : CONSULT_LINK_HTML_BYTES
    const body = await decompress(response.body || Buffer.alloc(0), response.headers['content-encoding'], maxBytes)
    return {
      url: current,
      status: response.status,
      contentType: response.headers['content-type'],
      body,
    }
  }
  throw new ConsultLinkError('REDIRECT_LIMIT')
}

async function resolveRecords(hostname, lookup) {
  const bare = hostname.startsWith('[') ? hostname.slice(1, -1) : hostname
  if (netIsIp(bare)) return [{ address: bare, family: bare.includes(':') ? 6 : 4 }]
  try {
    const records = await lookup(bare)
    return records
  } catch (err) {
    if (err instanceof ConsultLinkError) throw err
    throw new ConsultLinkError('DNS_FAIL')
  }
}

function netIsIp(host) {
  return host.includes(':') || /^\d+\.\d+\.\d+\.\d+$/.test(host)
}

export async function readPublicConsultLink(rawUrl, question, deps = {}) {
  const fetched = await fetchPublicResource(rawUrl, deps)
  const finalUrl = redactConsultUrl(fetched.url)
  if (looksLikePdf(fetched.url, fetched.contentType)) {
    let text = ''
    try {
      text = await extractPdfBufferText(fetched.body)
    } catch {
      throw new ConsultLinkError('PDF_FAIL')
    }
    if (!text || text.length < 40) throw new ConsultLinkError('SCANNED_PDF')
    const clipped = text.length > CONSULT_LINK_TEXT_BUDGET
    return {
      ok: true,
      kind: 'pdf',
      url: finalUrl,
      title: fetched.url.pathname.split('/').pop() || finalUrl,
      text: clipped ? `${text.slice(0, CONSULT_LINK_TEXT_BUDGET)}…` : text,
      truncated: clipped,
    }
  }
  const type = fetched.contentType.toLowerCase()
  if (type && !/html|xml|text\/plain|application\/xhtml/.test(type)) {
    throw new ConsultLinkError('UNSUPPORTED_TYPE')
  }
  const article = extractHtmlArticle(fetched.body.toString('utf8'), question)
  if (article.paywall || article.text.length < 40) {
    throw new ConsultLinkError(article.paywall ? 'PAYWALL' : 'EMPTY')
  }
  return {
    ok: true,
    kind: 'html',
    url: finalUrl,
    title: article.title,
    text: article.text,
    truncated: article.truncated,
  }
}
