import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import {
  CONSULT_TRANSPORT_MAX_BYTES,
  MAX_DOC_BYTES,
  MAX_IMAGES,
  MAX_DOCS,
  MAX_IMAGE_BYTES,
  attachmentByteLimitCode,
  canAddAttachment,
  fileToAttachment,
  withinTransportLimit,
} from './consultAttachments.js'
import {
  consultAttachmentPolicy,
  isConsultUnlimitedUploadEmail,
} from './consultUploadAllowlist.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const REAL_EMAIL = 'fsjy_2001@163.com'
const TYPO_EMAIL = 'fsjy_2001@163.cm'
const OTHER_EMAIL = 'member@example.com'
const MB = 1024 * 1024

function file(name, type, size) {
  return { name, type, size }
}

function image(n = 1) {
  return { kind: 'image', name: `scan-${n}.jpg`, data: 'abc' }
}

function pdf(n = 1) {
  return { kind: 'document', name: `report-${n}.pdf`, text: 'hello' }
}

function docx(n = 1) {
  return { kind: 'document', name: `note-${n}.docx`, text: 'hello' }
}

test('allowlist matches the real address, the owner typo, and case or space variants', () => {
  assert.equal(isConsultUnlimitedUploadEmail(REAL_EMAIL), true)
  assert.equal(isConsultUnlimitedUploadEmail('FSJY_2001@163.COM'), true)
  assert.equal(isConsultUnlimitedUploadEmail('  fsjy_2001@163.com  '), true)
  assert.equal(isConsultUnlimitedUploadEmail(TYPO_EMAIL), true)
  assert.equal(isConsultUnlimitedUploadEmail('Fsjy_2001@163.CM'), true)
  assert.equal(isConsultUnlimitedUploadEmail(OTHER_EMAIL), false)
  assert.equal(isConsultUnlimitedUploadEmail('fsjy_2001@163.cn'), false)
  assert.equal(isConsultUnlimitedUploadEmail('fsjy_2001@163.com.cn'), false)
  assert.equal(isConsultUnlimitedUploadEmail(''), false)
  assert.equal(isConsultUnlimitedUploadEmail(null), false)
})

test('policy lifts image and PDF count and size only for the allowlisted account', () => {
  const exempt = consultAttachmentPolicy({ email: ' FSJY_2001@163.Com ' })
  assert.equal(exempt.exempt, true)
  assert.equal(exempt.unlimitedImages, true)
  assert.equal(exempt.unlimitedPdfs, true)
  assert.equal(exempt.unlimitedImageBytes, true)
  assert.equal(exempt.unlimitedPdfBytes, true)

  const typo = consultAttachmentPolicy({ email: TYPO_EMAIL })
  assert.equal(typo.unlimitedImageBytes, true)
  assert.equal(typo.unlimitedPdfBytes, true)

  const member = consultAttachmentPolicy({ email: OTHER_EMAIL })
  assert.equal(member.exempt, false)
  assert.equal(member.unlimitedImages, false)
  assert.equal(member.unlimitedPdfs, false)
  assert.equal(member.unlimitedImageBytes, false)
  assert.equal(member.unlimitedPdfBytes, false)

  const admin = consultAttachmentPolicy({ email: OTHER_EMAIL, siteAdmin: true })
  assert.equal(admin.exempt, false)
  assert.equal(admin.unlimitedImages, true)
  assert.equal(admin.unlimitedPdfs, true)
  assert.equal(admin.unlimitedImageBytes, false)
  assert.equal(admin.unlimitedPdfBytes, false)
})

test('non-allowlisted accounts still stop at the previous image and PDF byte limits', () => {
  assert.equal(MAX_IMAGE_BYTES, 12 * MB)
  assert.equal(MAX_DOC_BYTES, 5 * MB)
  assert.equal(attachmentByteLimitCode(file('a.jpg', 'image/jpeg', 12 * MB)), null)
  assert.equal(attachmentByteLimitCode(file('a.png', 'image/png', 12 * MB + 1)), 'attachTooLarge')
  assert.equal(attachmentByteLimitCode(file('a.pdf', 'application/pdf', 5 * MB)), null)
  assert.equal(attachmentByteLimitCode(file('a.pdf', 'application/pdf', 5 * MB + 1)), 'attachTooLarge')
  assert.equal(attachmentByteLimitCode(file('a.docx', '', 5 * MB + 1)), 'attachTooLarge')
  assert.equal(attachmentByteLimitCode(file('a.txt', 'text/plain', 5 * MB + 1)), 'attachTooLarge')
})

test('allowlisted account can exceed image and PDF byte limits; Word and TXT cannot', () => {
  const open = { unlimitedImageBytes: true, unlimitedPdfBytes: true }
  assert.equal(attachmentByteLimitCode(file('big.jpg', 'image/jpeg', 80 * MB), open), null)
  assert.equal(attachmentByteLimitCode(file('big.pdf', 'application/pdf', 80 * MB), open), null)
  assert.equal(attachmentByteLimitCode(file('big.docx', '', 5 * MB + 1), open), 'attachTooLarge')
  assert.equal(attachmentByteLimitCode(file('big.txt', 'text/plain', 5 * MB + 1), open), 'attachTooLarge')
  assert.equal(
    attachmentByteLimitCode(file('big.jpg', 'image/jpeg', 80 * MB), { unlimitedPdfBytes: true }),
    'attachTooLarge',
  )
  assert.equal(
    attachmentByteLimitCode(file('big.pdf', 'application/pdf', 80 * MB), { unlimitedImageBytes: true }),
    'attachTooLarge',
  )
})

test('fileToAttachment keeps the old size error for other accounts and does not use it for the allowlist', async () => {
  const copy = {
    attachTooLarge: 'TOO_BIG',
    attachUnsupported: 'UNSUP',
    attachHeic: 'HEIC',
    attachOldDoc: 'OLD_DOC',
  }
  const bigImage = file('scan.jpg', 'image/jpeg', 12 * MB + 1)
  await assert.rejects(
    () => fileToAttachment(bigImage, copy),
    (err) => err.code === 'attachTooLarge' && err.message === 'TOO_BIG',
  )
  const bigPdf = file('report.pdf', 'application/pdf', 5 * MB + 1)
  await assert.rejects(
    () => fileToAttachment(bigPdf, copy),
    (err) => err.code === 'attachTooLarge' && err.message === 'TOO_BIG',
  )
  await assert.rejects(
    () => fileToAttachment(bigImage, copy, { unlimitedImageBytes: true, unlimitedPdfBytes: true }),
    (err) => err.code === 'attachUnsupported' && err.code !== 'attachTooLarge',
  )
  await assert.rejects(
    () => fileToAttachment(file('photo.heic', 'image/heic', 80 * MB), copy, {
      unlimitedImageBytes: true,
      unlimitedPdfBytes: true,
    }),
    (err) => err.code === 'attachHeic',
  )
  await assert.rejects(
    () => fileToAttachment(file('legacy.doc', '', 80 * MB), copy, {
      unlimitedImageBytes: true,
      unlimitedPdfBytes: true,
    }),
    (err) => err.code === 'attachOldDoc',
  )
})

test('count limits: allowlist can pass 5 images and 3 PDFs; others and Word/TXT cannot', () => {
  assert.equal(MAX_IMAGES, 5)
  assert.equal(MAX_DOCS, 3)
  const fiveImages = Array.from({ length: 5 }, (_, i) => image(i))
  const threePdfs = Array.from({ length: 3 }, (_, i) => pdf(i))
  const threeDocs = Array.from({ length: 3 }, (_, i) => docx(i))
  assert.equal(canAddAttachment(fiveImages, image(6)), false)
  assert.equal(canAddAttachment(threePdfs, pdf(4)), false)
  assert.equal(canAddAttachment(fiveImages, image(6), { unlimitedImages: true, unlimitedPdfs: true }), true)
  assert.equal(canAddAttachment(threePdfs, pdf(4), { unlimitedImages: true, unlimitedPdfs: true }), true)
  assert.equal(canAddAttachment(threeDocs, docx(4), { unlimitedImages: true, unlimitedPdfs: true }), false)
})

test('gateway body cap stays 25MB and matches the nginx consult location', () => {
  assert.equal(CONSULT_TRANSPORT_MAX_BYTES, 25 * MB)
  const nginx = fs.readFileSync(path.join(root, 'deploy/nginx-healthlongevity.conf.example'), 'utf8')
  const start = nginx.indexOf('location ^~ /api/ai/')
  const end = nginx.indexOf('location ^~ /api/', start + 1)
  const block = nginx.slice(start, end)
  assert.match(block, /client_max_body_size 25m;/)
  const budget = 24 * MB
  const under = { kind: 'image', name: 'a.jpg', data: 'a'.repeat(budget) }
  const over = { kind: 'image', name: 'b.jpg', data: 'a'.repeat(budget + 1) }
  assert.equal(withinTransportLimit([], under), true)
  assert.equal(withinTransportLimit([], over), false)
  assert.equal(withinTransportLimit([under], { kind: 'image', name: 'c.jpg', data: 'bbbb' }), false)
})

test('other accounts keep the existing limit copy', () => {
  const consult = fs.readFileSync(path.join(root, 'src/pages/Consult.jsx'), 'utf8')
  assert.match(consult, /最多 5 张图片和 3 份文档（每份文档不超过 5MB）。/)
  assert.match(consult, /文档请控制在 5MB 以内；图片过大请先压缩或换一张更清晰的照片。/)
  assert.match(consult, /Up to 5 images and 3 documents \(≤5MB each\)\./)
  assert.match(consult, /Keep each document under 5MB; compress large photos before uploading\./)
})
