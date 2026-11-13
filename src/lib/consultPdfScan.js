/** 与原先「抽不出 40 字就当扫描件」的门槛一致。文字层达到这个长度就不再 OCR。 */
export const MIN_PDF_TEXT_CHARS = 40
/** 识别不清时最多附上的页图。长报告不会整本变成图片。 */
export const SCAN_FALLBACK_PAGES = 3
/** OCR 最多读这么多页，并在正文够用时提前停。所有账号一样，避免把整本扫描件送进模型。 */
export const SCAN_OCR_PAGE_CAP = 20

const USEFUL_CHAR = /[\u3400-\u9fffA-Za-z0-9]/g

export function pdfTextLayerIsEnough(text) {
  return String(text || '').length >= MIN_PDF_TEXT_CHARS
}

/**
 * OCR 正文是否值得当作文档发送。
 * 字数不够，或大多是符号噪声，都视为不可用。
 * 置信度很低时再要求更高的有效字符比例。
 */
export function ocrTextIsUsable(text, confidence = null) {
  const compact = String(text || '').replace(/\s+/g, '')
  if (compact.length < MIN_PDF_TEXT_CHARS) return false
  const useful = compact.match(USEFUL_CHAR)?.length || 0
  const ratio = useful / compact.length
  if (ratio < 0.6) return false
  const score = confidence == null ? null : Number(confidence)
  if (score != null && Number.isFinite(score) && score < 35 && ratio < 0.8) return false
  return true
}

export function scanFallbackPageCount(pageCount) {
  const n = Math.max(0, Number(pageCount) || 0)
  return Math.min(n, SCAN_FALLBACK_PAGES)
}

export function scanOcrPageCount(pageCount) {
  const n = Math.max(0, Number(pageCount) || 0)
  return Math.min(n, SCAN_OCR_PAGE_CAP)
}

/**
 * 文字层够用则只用文字层。否则优先 OCR 文本，不可用再退回少量页图。
 * ocrText 为 null 表示还没跑 OCR，不能当成识别成功。
 */
export function choosePdfDelivery({
  textLayer = '',
  ocrText = null,
  ocrConfidence = null,
  pageCount = 0,
} = {}) {
  if (pdfTextLayerIsEnough(textLayer)) return { mode: 'text-layer' }
  if (ocrText != null && ocrTextIsUsable(ocrText, ocrConfidence)) return { mode: 'ocr-text' }
  const pages = scanFallbackPageCount(pageCount)
  if (pages > 0) return { mode: 'page-images', pages }
  return { mode: 'fail' }
}
