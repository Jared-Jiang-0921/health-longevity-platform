/**
 * 所有风险评估的共同问题只问一次，再映射到各模型。
 * 以后新增评估：共同项放 EMPTY_SHARED；疾病 / 衰老 / 生活方式独有项放对应 EXTRA，不要再问年龄、性别、血压等。
 */

export const EMPTY_SHARED = {
  sex: '',
  age: '',
  heightCm: '',
  weightKg: '',
  waistCm: '',
  sbp: '',
  dbp: '',
  north: '',
  urban: '',
  treatedHypertension: '',
  nicotine: '',
  glucose: '',
  sleepHours: '',
  activityMinutes: '',
}

export const EMPTY_PAR_EXTRA = {
  tc: '',
  tcUnit: 'mmol',
  hdl: '',
  hdlUnit: 'mmol',
  familyAscvd: '',
}

export const EMPTY_DM_EXTRA = {
  familyDiabetes: '',
  familyFindrisc: 'none',
  dailyVegetables: '',
}

export const EMPTY_LIFE_EXTRA = {
  activityLevel: 'light',
  diet: '',
  lipids: 'unknown',
}

function take(target, source, keys) {
  const out = { ...target }
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== '') {
      out[key] = source[key]
    }
  }
  return out
}

export function deriveSharedFlags(shared) {
  const minutes = Number(shared.activityMinutes)
  return {
    smoking: shared.nicotine === 'current',
    diabetes: shared.glucose === 'diabetes',
    treatedHypertension: shared.treatedHypertension,
    bpMedication: shared.treatedHypertension,
    historyHighGlucose: shared.glucose === 'prediabetes' || shared.glucose === 'diabetes',
    dailyActivity30: Number.isFinite(minutes) && minutes >= 150,
  }
}

export function extractShared(input = {}) {
  let nicotine = input.nicotine || ''
  if (!nicotine && input.smoking === true) nicotine = 'current'
  if (!nicotine && input.smoking === false) nicotine = 'never'

  let glucose = input.glucose || ''
  if (!glucose && input.diabetes === true) glucose = 'diabetes'

  const treated = input.treatedHypertension !== '' && input.treatedHypertension != null
    ? input.treatedHypertension
    : input.bpMedication

  return take({ ...EMPTY_SHARED }, {
    ...input,
    nicotine,
    glucose,
    treatedHypertension: treated,
  }, Object.keys(EMPTY_SHARED))
}

export function extractParExtra(input = {}) {
  return take({ ...EMPTY_PAR_EXTRA }, input, Object.keys(EMPTY_PAR_EXTRA))
}

export function extractDmExtra(input = {}) {
  return take({ ...EMPTY_DM_EXTRA }, input, Object.keys(EMPTY_DM_EXTRA))
}

export function extractLifeExtra(input = {}) {
  return take({ ...EMPTY_LIFE_EXTRA }, input, Object.keys(EMPTY_LIFE_EXTRA))
}

export function hydrateSharedFromLatest(latest = {}) {
  const rows = ['china_par', 'diabetes', 'lifestyle']
    .map((kind) => latest[kind])
    .filter((row) => row?.input)
    .sort((a, b) => {
      const ta = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const tb = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return ta - tb
    })
  let shared = { ...EMPTY_SHARED }
  for (const row of rows) shared = { ...shared, ...extractShared(row.input) }
  return shared
}

export function buildChinaParInput(shared, extra) {
  const flags = deriveSharedFlags(shared)
  return {
    ...shared,
    ...flags,
    ...extra,
  }
}

export function buildDiabetesInput(shared, extra) {
  const flags = deriveSharedFlags(shared)
  return {
    ...shared,
    ...flags,
    familyDiabetes: extra.familyDiabetes,
    familyFindrisc: extra.familyFindrisc,
    dailyVegetables: extra.dailyVegetables,
  }
}

export function buildLifestyleInput(shared, extra) {
  return {
    ...shared,
    ...extra,
    nicotine: shared.nicotine,
    glucose: shared.glucose || 'unknown',
  }
}
