export async function fetchTcmConstitution(token) {
  const res = await fetch('/api/tcm-constitution', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '体质辨识加载失败')
  return data
}

export async function saveTcmConstitution(token, payload) {
  const res = await fetch('/api/tcm-constitution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || '保存失败')
    err.code = data.code || ''
    throw err
  }
  return data
}

export async function suggestTongueFeatures(token, image) {
  const res = await fetch('/api/tcm-constitution-tongue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(image),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '舌象识别失败')
  return data
}
