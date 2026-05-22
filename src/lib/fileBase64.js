/**
 * 将 File/Blob 转为 base64（不含 data: 前缀），供模块资料等 JSON 上传使用。
 * 使用 FileReader，避免对大视频逐字节拼接导致浏览器卡死或 Failed to fetch。
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const s = String(reader.result || '')
      const comma = s.indexOf(',')
      resolve(comma >= 0 ? s.slice(comma + 1) : s)
    }
    reader.onerror = () => reject(reader.error || new Error('read failed'))
    reader.readAsDataURL(file)
  })
}
