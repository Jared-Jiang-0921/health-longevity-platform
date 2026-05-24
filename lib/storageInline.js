import fs from 'node:fs/promises'

/** 从 storage 读文件并以 inline 方式返回（视频/PDF 等） */
export async function sendStoredFileInline(res, { absPath, mimeType, fileName }) {
  const buf = await fs.readFile(absPath)
  res.setHeader('Content-Type', mimeType || 'application/octet-stream')
  res.setHeader(
    'Content-Disposition',
    `inline; filename="${encodeURIComponent(fileName || 'file')}"`,
  )
  return res.status(200).send(buf)
}
