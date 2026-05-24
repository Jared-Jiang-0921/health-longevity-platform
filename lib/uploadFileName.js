export function getFileExtension(name) {
  const parts = String(name || '').toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

export function sanitizeUploadFileName(fileName, fallbackPrefix = 'asset') {
  const cleaned = String(fileName || '')
    .replace(/[^\w.\-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120)
  return cleaned || `${fallbackPrefix}_${Date.now()}`
}
