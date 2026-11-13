const IMAGE_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
/** 图片选源上限（会先压缩再发送）。白名单账号不走这条。 */
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024
/** 文档大小上限。白名单账号的 PDF 不走这条；Word/TXT 仍走。 */
export const MAX_DOC_BYTES = 5 * 1024 * 1024
const MAX_DOC_CHARS = 12000
export const MAX_IMAGES = 5
export const MAX_DOCS = 3
const MAX_PDF_PAGES = 20
/**
 * 普通账号压缩后的 base64 上限，需小于咨询后端约 1.8MB 的静默丢弃阈值。
 * 白名单账号不再因该阈值拒绝；发出去的请求体仍受 CONSULT_TRANSPORT_MAX_BYTES 约束。
 */
const MAX_IMAGE_B64 = 1800000
/**
 * 与 deploy/nginx-healthlongevity.conf.example 里 location /api/ai/ 的
 * client_max_body_size 25m 对齐。Nginx 不能按账号拆开，所以不能只给白名单放开。
 * 调大这里之前要同时改那一行，否则界面会收下网关随后拒绝的文件。
 */
export const CONSULT_TRANSPORT_MAX_BYTES = 25 * 1024 * 1024
/** 给 JSON 键名和其余字段留出的余量，避免贴着 25m 被 Nginx 截断。 */
const TRANSPORT_JSON_MARGIN = 1024 * 1024

function extOf(name = '') {
  const m = String(name).toLowerCase().match(/\.([a-z0-9]+)$/)
  return m ? m[1] : ''
}

const RECORDER_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
]

export function micSupported() {
  if (typeof window === 'undefined') return false
  return Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined'
}

export function pickRecorderMime() {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') return ''
  return RECORDER_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) || ''
}

export function recorderMediaType(mime) {
  return String(mime || 'audio/webm').split(';')[0].trim() || 'audio/webm'
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const s = String(reader.result || '')
      const i = s.indexOf(',')
      resolve(i >= 0 ? s.slice(i + 1) : s)
    }
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsDataURL(blob)
  })
}

export function stopMediaStream(stream) {
  if (!stream) return
  for (const track of stream.getTracks()) {
    try { track.stop() } catch { /* noop */ }
  }
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsText(file)
  })
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsDataURL(blob)
  })
}

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('compress failed'))
      else resolve(blob)
    }, 'image/jpeg', quality)
  })
}

/**
 * 多档压缩。普通账号必须压到 MAX_IMAGE_B64 以内（过大曾被咨询后端静默丢弃）。
 * allowOversize 只给白名单账号：压不进该阈值时仍返回最小的一版，不再当失败。
 */
export async function compressImage(file, maxEdge = 1280, quality = 0.72, options = {}) {
  const allowOversize = Boolean(options?.allowOversize)
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('image decode failed'))
      el.src = url
    })

    const attempts = [
      { edge: maxEdge, quality },
      { edge: 1024, quality: 0.65 },
      { edge: 900, quality: 0.55 },
      { edge: 720, quality: 0.48 },
    ]

    let lastErr = null
    let best = null
    for (const attempt of attempts) {
      try {
        const scale = Math.min(1, attempt.edge / Math.max(img.width, img.height, 1))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('compress failed')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const blob = await canvasToJpegBlob(canvas, attempt.quality)
        const dataUrl = await blobToDataUrl(blob)
        const data = dataUrl.split(',')[1] || ''
        if (!data) {
          lastErr = new Error('image still too large')
          continue
        }
        const packed = {
          kind: 'image',
          name: file.name || 'image.jpg',
          mediaType: 'image/jpeg',
          data,
          preview: dataUrl,
        }
        if (!best || data.length < best.data.length) best = packed
        if (data.length > MAX_IMAGE_B64) {
          lastErr = new Error('image still too large')
          continue
        }
        return packed
      } catch (err) {
        lastErr = err
      }
    }
    if (allowOversize && best?.data) return best
    throw lastErr || new Error('compress failed')
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function loadPdfDocument(pdfjs, fileBuffer, disableWorker) {
  // 每次用新副本：worker 失败后原 ArrayBuffer 可能已被 transfer 掏空
  const data = new Uint8Array(fileBuffer.slice(0))
  return pdfjs.getDocument({
    data,
    disableWorker: Boolean(disableWorker),
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise
}

async function extractPdfText(file) {
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs')
  try {
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
    if (workerUrl) pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  } catch {
    /* worker 可选；失败时走主线程解析 */
  }
  const fileBuffer = await file.arrayBuffer()
  let doc
  try {
    doc = await loadPdfDocument(pdfjs, fileBuffer, false)
  } catch {
    doc = await loadPdfDocument(pdfjs, fileBuffer, true)
  }
  const max = Math.min(doc.numPages, MAX_PDF_PAGES)
  const parts = []
  for (let i = 1; i <= max; i += 1) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    parts.push(content.items.map((it) => it.str || '').join(' '))
  }
  return parts.join('\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

async function extractDocxText(file) {
  const mod = await import('mammoth')
  const mammoth = mod.default || mod
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return String(result?.value || '').replace(/\n{3,}/g, '\n\n').trim()
}

function isImageFile(type, ext) {
  return IMAGE_MIME.has(type) || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
}

function isPdfFile(type, ext) {
  return ext === 'pdf' || type === 'application/pdf'
}

function isDocxFile(type, ext) {
  return ext === 'docx' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

/**
 * 单文件字节门槛。返回错误码，或 null 表示这一关通过。
 * 白名单只跳过图片和 PDF；Word/TXT 以及其它类型仍用原来的 5MB。
 */
export function attachmentByteLimitCode(file, options = {}) {
  const type = String(file?.type || '').toLowerCase()
  const ext = extOf(file?.name || '')
  const size = Number(file?.size || 0)
  if (isImageFile(type, ext)) {
    if (!options.unlimitedImageBytes && size > MAX_IMAGE_BYTES) return 'attachTooLarge'
    return null
  }
  if (isPdfFile(type, ext)) {
    if (!options.unlimitedPdfBytes && size > MAX_DOC_BYTES) return 'attachTooLarge'
    return null
  }
  if (isDocxFile(type, ext) || ext === 'txt' || type === 'text/plain') {
    if (size > MAX_DOC_BYTES) return 'attachTooLarge'
  }
  return null
}

export function attachmentWireBytes(item) {
  if (!item) return 0
  if (item.kind === 'image') return String(item.data || '').length
  return String(item.text || '').length
}

/** 已选附件再加上下一份之后，请求体是否仍低于 Nginx /api/ai/ 的 25m。 */
export function withinTransportLimit(list, next) {
  const used = (Array.isArray(list) ? list : []).reduce((sum, item) => sum + attachmentWireBytes(item), 0)
  return used + attachmentWireBytes(next) <= CONSULT_TRANSPORT_MAX_BYTES - TRANSPORT_JSON_MARGIN
}

export async function fileToAttachment(file, copy, options = {}) {
  const name = file?.name || 'file'
  const type = String(file?.type || '').toLowerCase()
  const ext = extOf(name)
  const fail = (key, fallback) => {
    const err = new Error(copy?.[key] || fallback)
    err.code = key
    throw err
  }

  const byteCode = attachmentByteLimitCode(file, options)
  if (byteCode) fail(byteCode, '文件过大')

  if (isImageFile(type, ext)) {
    try {
      return await compressImage(file, 1280, 0.72, {
        allowOversize: Boolean(options.unlimitedImageBytes),
      })
    } catch {
      fail('attachUnsupported', '图片无法读取，请改用 JPG/PNG')
    }
  }

  if (ext === 'heic' || ext === 'heif' || type === 'image/heic' || type === 'image/heif') {
    fail('attachHeic', '请将 HEIC 转为 JPG/PNG 后再上传')
  }

  if (isPdfFile(type, ext)) {
    let text = ''
    try {
      text = await extractPdfText(file)
    } catch {
      fail('attachPdfFail', '这份 PDF 暂时无法解析，请刷新后重试，或改用可复制的 Word，或把报告拍成清晰照片上传')
    }
    if (!text || text.length < 40) fail('attachScannedPdf', '未能从 PDF 抽出文字，请改用可复制的文档或拍摄清晰照片')
    return {
      kind: 'document',
      name,
      text: text.slice(0, MAX_DOC_CHARS),
    }
  }

  if (isDocxFile(type, ext)) {
    let text = ''
    try {
      text = await extractDocxText(file)
    } catch {
      fail('attachEmptyDoc', '文档里没有可读取的文字')
    }
    if (!text) fail('attachEmptyDoc', '文档里没有可读取的文字')
    return {
      kind: 'document',
      name,
      text: text.slice(0, MAX_DOC_CHARS),
    }
  }

  if (ext === 'txt' || type === 'text/plain') {
    const text = (await readAsText(file)).trim()
    if (!text) fail('attachEmptyDoc', '文档里没有可读取的文字')
    return {
      kind: 'document',
      name,
      text: text.slice(0, MAX_DOC_CHARS),
    }
  }

  if (ext === 'doc') fail('attachOldDoc', '旧版 .doc 请另存为 .docx 或 PDF')
  fail('attachUnsupported', '暂不支持该文件类型')
}

function isPdfName(name) {
  return extOf(name) === 'pdf'
}

/**
 * 普通会员：最多 5 张图片、3 份文档（PDF/Word/TXT 合计）。
 * 整站管理员：图片张数和 PDF 份数不设上限；Word/TXT 仍最多 3 份。单文件大小不变。
 * 咨询上传白名单：图片和 PDF 的张数另由调用方放开。Word/TXT 仍最多 3 份。
 */
export function canAddAttachment(list, next, options = {}) {
  const unlimitedImages = Boolean(options.unlimitedImages)
  const unlimitedPdfs = Boolean(options.unlimitedPdfs)
  const images = list.filter((a) => a.kind === 'image').length
  const docs = list.filter((a) => a.kind === 'document')
  const otherDocs = docs.filter((a) => !isPdfName(a.name)).length
  if (next.kind === 'image') {
    if (unlimitedImages) return true
    return images < MAX_IMAGES
  }
  if (next.kind === 'document') {
    if (isPdfName(next.name)) {
      if (unlimitedPdfs) return true
      return docs.length < MAX_DOCS
    }
    if (unlimitedPdfs) return otherDocs < MAX_DOCS
    return docs.length < MAX_DOCS
  }
  return false
}

export function toApiAttachments(list) {
  return (Array.isArray(list) ? list : []).map((a) => {
    if (a.kind === 'image') {
      return { kind: 'image', name: a.name, mediaType: a.mediaType, data: a.data }
    }
    return { kind: 'document', name: a.name, text: a.text }
  })
}
