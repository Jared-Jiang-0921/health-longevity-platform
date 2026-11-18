/** 只抽取 PDF 文字层。没有文字层时由调用方告知用户改走咨询里的上传识别，这里不假装识别成功。 */
export async function extractPdfBufferText(buffer) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const data = new Uint8Array(buffer)
  const doc = await pdfjs.getDocument({
    data,
    disableWorker: true,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise
  try {
    const max = Math.min(doc.numPages || 0, 20)
    const parts = []
    for (let i = 1; i <= max; i += 1) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      parts.push(content.items.map((item) => item.str || '').join(' '))
    }
    return parts.join('\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  } finally {
    try { await doc.destroy() } catch { /* 已经释放 */ }
  }
}
