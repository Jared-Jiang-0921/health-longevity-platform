/**
 * 表观遗传时钟解读（教育计算）
 *
 * 本站不从 CpG β 值重跑时钟。用户录入合规实验室报告上的结果，
 * 再按公开文献做加速/速率分层。不能诊断或替代临床预后。
 *
 * 第一代生物学年龄
 * - Horvath pan-tissue clock：Horvath, Genome Biology 2013;14:R115（353 CpG）
 * - iCAS-DNAmAge：中国队列训练，Protein & Cell 2024（pwae011，65 CpG），更适合中国人日历年龄
 *
 * 第二代死亡风险
 * - DNAm GrimAge2：Lu et al., Aging 2022（在 GrimAge 2019 上增加 CRP、HbA1c 甲基化替代指标）
 *
 * 第三代衰老速度
 * - DunedinPACE：Belsky et al., eLife 2022;11:e73420（173 CpG；1.0 = 一年日历时间老一年）
 */

function toNumber(value, fallback = NaN) {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').trim())
  return Number.isFinite(n) ? n : fallback
}

function round1(n) {
  return Math.round(n * 10) / 10
}

export const AGING_KINDS = ['horvath', 'icas', 'grimage2', 'dunedinpace']

export const AGING_META = {
  horvath: {
    generation: 1,
    role: 'bioage',
    unit: 'years',
    suitableForChinese: false,
    model: 'Horvath pan-tissue clock (2013)',
  },
  icas: {
    generation: 1,
    role: 'bioage',
    unit: 'years',
    suitableForChinese: true,
    model: 'iCAS-DNAmAge (Protein & Cell 2024)',
  },
  grimage2: {
    generation: 2,
    role: 'mortality',
    unit: 'years',
    suitableForChinese: false,
    model: 'DNAm GrimAge2 (Lu 2022)',
  },
  dunedinpace: {
    generation: 3,
    role: 'pace',
    unit: 'pace',
    suitableForChinese: false,
    model: 'DunedinPACE (Belsky 2022)',
  },
}

export function isAgingKind(kind) {
  return AGING_KINDS.includes(kind)
}

function yearBand(accel) {
  if (accel >= 10) return { id: 'high', label: '明显偏高', adviseClinician: true }
  if (accel >= 5) return { id: 'intermediate', label: '轻度偏高', adviseClinician: false }
  if (accel <= -10) return { id: 'low', label: '明显偏低', adviseClinician: false }
  if (accel <= -5) return { id: 'low', label: '轻度偏低', adviseClinician: false }
  return { id: 'low', label: '与日历年龄接近', adviseClinician: false }
}

function paceBand(pace) {
  if (pace >= 1.1) return { id: 'high', label: '衰老偏快', adviseClinician: true }
  if (pace >= 1.03) return { id: 'intermediate', label: '略快于参照', adviseClinician: false }
  if (pace <= 0.9) return { id: 'low', label: '衰老偏慢', adviseClinician: false }
  if (pace <= 0.97) return { id: 'low', label: '略慢于参照', adviseClinician: false }
  return { id: 'low', label: '接近每年老一年', adviseClinician: false }
}

export function normalizeAgingInput(raw = {}) {
  return {
    sex: raw.sex === 'female' ? 'female' : raw.sex === 'male' ? 'male' : '',
    chronologicalAge: toNumber(raw.chronologicalAge ?? raw.age),
    clockAge: toNumber(raw.clockAge),
    pace: toNumber(raw.pace),
    sampleType: raw.sampleType === 'other' ? 'other' : 'blood',
    arrayType: ['450k', 'epic', 'epic2', 'unknown'].includes(raw.arrayType) ? raw.arrayType : 'unknown',
    labName: String(raw.labName || '').trim().slice(0, 120),
    reportDate: String(raw.reportDate || '').trim().slice(0, 32),
  }
}

function validateShared(input) {
  if (input.sex !== 'male' && input.sex !== 'female') return '请选择生理性别'
  if (!Number.isFinite(input.chronologicalAge) || input.chronologicalAge < 18 || input.chronologicalAge > 110) {
    return '请填写 18–110 岁日历年龄（与检测时一致）'
  }
  return ''
}

export function computeAgingAssessment(kind, raw = {}) {
  if (!isAgingKind(kind)) return { ok: false, error: '未知衰老评估类型', kind }
  const input = normalizeAgingInput(raw)
  const sharedError = validateShared(input)
  if (sharedError) return { ok: false, error: sharedError, kind }

  const meta = AGING_META[kind]
  const disclaimer = '仅供健康教育。结果来自你录入的实验室报告，本站不重跑甲基化算法，不能诊断、预测个体死亡或指导处方。'

  if (kind === 'dunedinpace') {
    if (!Number.isFinite(input.pace) || input.pace < 0.5 || input.pace > 2.5) {
      return { ok: false, error: '请填写实验室报告上的 DunedinPACE（常见约 0.6–1.5）', kind }
    }
    const rounded = Math.round(input.pace * 100) / 100
    const band = paceBand(rounded)
    const deltaPct = Math.round((rounded - 1) * 100)
    return {
      ok: true,
      kind,
      ...meta,
      pace: rounded,
      deltaPct,
      band,
      summary: `DunedinPACE ${rounded}（${band.label}），相对每年老一年约 ${deltaPct >= 0 ? '+' : ''}${deltaPct}%。`,
      disclaimer,
      input,
    }
  }

  if (!Number.isFinite(input.clockAge) || input.clockAge < 1 || input.clockAge > 120) {
    return { ok: false, error: '请填写实验室报告上的时钟年龄（岁）', kind }
  }
  const clockAge = round1(input.clockAge)
  const chrono = round1(input.chronologicalAge)
  const accel = round1(clockAge - chrono)
  const band = yearBand(accel)
  const chineseNote = kind === 'icas' ? '该模型在中国队列训练，更适合中国人生物学年龄解读。' : ''
  const roleLabel = kind === 'grimage2' ? '死亡相关表观年龄' : '生物学年龄'
  const name = kind === 'horvath' ? 'Horvath' : kind === 'icas' ? 'iCAS-DNAmAge' : 'GrimAge2'
  return {
    ok: true,
    kind,
    ...meta,
    clockAge,
    chronologicalAge: chrono,
    accel,
    band,
    summary: `${name} ${roleLabel} ${clockAge} 岁，日历年龄 ${chrono} 岁，差值 ${accel >= 0 ? '+' : ''}${accel} 岁（${band.label}）。${chineseNote}`.trim(),
    disclaimer,
    input,
  }
}

export function resultToSummary(result) {
  if (!result?.ok) return ''
  return String(result.summary || '').slice(0, 400)
}
