export async function fetchRiskAssessments(token) {
  const res = await fetch('/api/risk-assessments', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || '风险评估加载失败')
  return data
}

export async function saveRiskAssessment(token, payload) {
  const res = await fetch('/api/risk-assessments', {
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
