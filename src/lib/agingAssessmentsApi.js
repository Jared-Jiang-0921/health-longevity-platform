export async function fetchAgingAssessments(token) {
  const res = await fetch('/api/aging-assessments', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '衰老评估加载失败')
  return data
}

export async function saveAgingAssessment(token, payload) {
  const res = await fetch('/api/aging-assessments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '保存失败')
  return data
}
