/**
 * OSTA 亚洲骨质疏松自我评估工具（教育计算）
 *
 * Koh et al., Osteoporos Int 2001;12:699–705.
 * OSTA = trunc((体重 kg − 年龄) × 0.2)
 * > −1 低危；−1 至 −4 中危；< −4 高危。
 *
 * 原推导为亚洲绝经后女性；后续中国验证较多。男性结果仅供参考。
 */

function toNumber(value, fallback = NaN) {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').trim())
  return Number.isFinite(n) ? n : fallback
}

export function normalizeOsteoporosisInput(raw = {}) {
  return {
    sex: raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : '',
    age: toNumber(raw.age),
    weightKg: toNumber(raw.weightKg),
  }
}

export function validateOsteoporosisInput(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!Number.isFinite(input.age) || input.age < 45 || input.age > 90) return 'OSTA 主要用于 45 岁及以上'
  if (!Number.isFinite(input.weightKg) || input.weightKg < 30 || input.weightKg > 250) return '请填写合理体重（kg）'
  return ''
}

function bandForIndex(index) {
  if (index < -4) return { id: 'high', label: '高危', adviseClinician: true }
  if (index <= -1) return { id: 'intermediate', label: '中危', adviseClinician: true }
  return { id: 'low', label: '低危', adviseClinician: false }
}

export function computeOsta(raw = {}) {
  const input = normalizeOsteoporosisInput(raw)
  const error = validateOsteoporosisInput(input)
  if (error) return { ok: false, error, kind: 'osteoporosis' }

  const index = Math.trunc((input.weightKg - input.age) * 0.2)
  const band = bandForIndex(index)

  return {
    ok: true,
    kind: 'osteoporosis',
    model: 'OSTA (Koh 2001)',
    index,
    band,
    summary: `OSTA 指数 ${index}（${band.label}）。低危 >−1，中危 −1 至 −4，高危 <−4。`,
    disclaimer: input.sex === 'male'
      ? '仅供健康教育。OSTA 原为亚洲绝经后女性筛查 DXA，男性证据较弱，不能替代骨密度检查。'
      : '仅供健康教育。中高危建议讨论是否做 DXA 骨密度，不能单独诊断骨质疏松。',
    input,
  }
}
