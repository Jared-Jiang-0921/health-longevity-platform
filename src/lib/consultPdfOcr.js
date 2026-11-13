import workerPath from 'tesseract.js/dist/worker.min.js?url'
import corePath from 'tesseract.js-core/tesseract-core-simd-lstm.wasm.js?url'
import { createWorker } from 'tesseract.js'

/**
 * 中英识别数据在 public/ocr/，和页面同一域名，不依赖 jsDelivr。
 * worker 与 wasm 由构建产物按需加载，不打进首屏包。
 */
function ocrLangPath() {
  const base = import.meta.env?.BASE_URL || '/'
  const prefix = base.endsWith('/') ? base : `${base}/`
  return new URL(`${prefix}ocr/`, window.location.origin).href.replace(/\/$/, '')
}

export async function startConsultOcr() {
  const worker = await createWorker('chi_sim+eng', 1, {
    workerPath,
    corePath,
    langPath: ocrLangPath(),
    gzip: true,
  })
  return {
    async recognize(canvas) {
      const { data } = await worker.recognize(canvas)
      return {
        text: String(data?.text || ''),
        confidence: Number(data?.confidence) || 0,
      }
    },
    async terminate() {
      try { await worker.terminate() } catch { /* 识别器关掉失败不影响回退 */ }
    },
  }
}
