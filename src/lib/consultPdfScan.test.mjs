import assert from 'node:assert/strict'
import test from 'node:test'
import {
  MIN_PDF_TEXT_CHARS,
  SCAN_FALLBACK_PAGES,
  SCAN_OCR_PAGE_CAP,
  choosePdfDelivery,
  ocrTextIsUsable,
  pdfTextLayerIsEnough,
  scanFallbackPageCount,
  scanOcrPageCount,
} from './consultPdfScan.js'

const labText = '空腹血糖 5.6 mmol/L，白细胞 6.2，血红蛋白 138 g/L。尿常规未见异常。建议复查。'

test('a text layer of 40 characters is enough and does not need OCR', () => {
  assert.equal(MIN_PDF_TEXT_CHARS, 40)
  assert.equal(pdfTextLayerIsEnough('a'.repeat(39)), false)
  assert.equal(pdfTextLayerIsEnough('a'.repeat(40)), true)
  const plan = choosePdfDelivery({
    textLayer: 'a'.repeat(40),
    ocrText: '????',
    ocrConfidence: 0,
    pageCount: 12,
  })
  assert.deepEqual(plan, { mode: 'text-layer' })
})

test('usable Chinese OCR text is sent as text instead of page images', () => {
  assert.equal(ocrTextIsUsable(labText, 70), true)
  assert.equal(ocrTextIsUsable('血糖'.repeat(30), null), true)
  const plan = choosePdfDelivery({
    textLayer: '   ',
    ocrText: labText,
    ocrConfidence: 62,
    pageCount: 8,
  })
  assert.deepEqual(plan, { mode: 'ocr-text' })
})

test('unusable OCR falls back to at most three compressed pages', () => {
  assert.equal(ocrTextIsUsable('|'.repeat(80), 90), false)
  assert.equal(ocrTextIsUsable('血糖', 90), false)
  assert.equal(ocrTextIsUsable(`${'甲'.repeat(30)}${'|'.repeat(30)}`, 10), false)
  assert.equal(ocrTextIsUsable('甲'.repeat(40), 10), true)
  assert.equal(SCAN_FALLBACK_PAGES, 3)
  assert.equal(scanFallbackPageCount(12), 3)
  assert.equal(scanFallbackPageCount(2), 2)
  assert.equal(scanFallbackPageCount(0), 0)
  assert.deepEqual(
    choosePdfDelivery({ textLayer: 'x'.repeat(10), ocrText: '|'.repeat(80), ocrConfidence: 80, pageCount: 12 }),
    { mode: 'page-images', pages: 3 },
  )
  assert.deepEqual(
    choosePdfDelivery({ textLayer: '', ocrText: '', pageCount: 1 }),
    { mode: 'page-images', pages: 1 },
  )
  assert.deepEqual(
    choosePdfDelivery({ textLayer: '', ocrText: null, pageCount: 0 }),
    { mode: 'fail' },
  )
})

test('OCR page cap stays bounded for every account', () => {
  assert.equal(SCAN_OCR_PAGE_CAP, 20)
  assert.equal(scanOcrPageCount(4), 4)
  assert.equal(scanOcrPageCount(80), 20)
})
