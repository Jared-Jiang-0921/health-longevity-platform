const IMAGE_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
/** 图片选源上限（会先压缩再发送） */
const MAX_IMAGE_BYTES = 12 * 1024 * 1024
/** 文档大小上限 */
export const MAX_DOC_BYTES = 5 * 1024 * 1024
const MAX_DOC_CHARS = 12000
export const MAX_IMAGES = 5
export const MAX_DOCS = 3
const MAX_PDF_PAGES = 20
/** 压缩后 base64 上限，需小于咨询后端 MAX_IMAGE_B64，避免被静默丢弃 */
const MAX_IMAGE_B64 = 1800000

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
 * 多档压缩，确保 base64 不超过后端可接受上限（过大曾被服务端静默丢弃）。
 */
export async function compressImage(file, maxEdge = 1280, quality = 0.72) {
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
        if (!data || data.length > MAX_IMAGE_B64) {
          lastErr = new Error('image still too large')
          continue
        }
        return {
          kind: 'image',
          name: file.name || 'image.jpg',
          mediaType: 'image/jpeg',
          data,
          preview: dataUrl,
        }
      } catch (err) {
        lastErr = err
      }
    }
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

export async function fileToAttachment(file, copy) {
  const name = file?.name || 'file'
  const type = String(file?.type || '').toLowerCase()
  const ext = extOf(name)
  const fail = (key, fallback) => {
    const err = new Error(copy?.[key] || fallback)
    err.code = key
    throw err
  }

  if (isImageFile(type, ext)) {
    if (file.size > MAX_IMAGE_BYTES) fail('attachTooLarge', '图片过大')
    try {
      return await compressImage(file)
    } catch {
      fail('attachUnsupported', '图片无法读取，请改用 JPG/PNG')
    }
  }

  if (ext === 'heic' || ext === 'heif' || type === 'image/heic' || type === 'image/heif') {
    fail('attachHeic', '请将 HEIC 转为 JPG/PNG 后再上传')
  }

  if (ext === 'pdf' || type === 'application/pdf') {
    if (file.size > MAX_DOC_BYTES) fail('attachTooLarge', '文件过大')
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

  if (ext === 'docx' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    if (file.size > MAX_DOC_BYTES) fail('attachTooLarge', '文件过大')
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
    if (file.size > MAX_DOC_BYTES) fail('attachTooLarge', '文件过大')
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

export function canAddAttachment(list, next) {
  const images = list.filter((a) => a.kind === 'image').length
  const docs = list.filter((a) => a.kind === 'document').length
  if (next.kind === 'image') return images < MAX_IMAGES
  if (next.kind === 'document') return docs < MAX_DOCS
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
