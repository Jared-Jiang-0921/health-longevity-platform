import { computeChinaPar, CHINA_PAR_PAPER_EXAMPLE } from '../../src/lib/riskModels/chinaPar.js'
import { computeDiabetesBundle } from '../../src/lib/riskModels/diabetes.js'
import { computeLifestyle } from '../../src/lib/riskModels/lifestyle.js'
import { computeFraminghamHypertension } from '../../src/lib/riskModels/hypertension.js'
import { computeCaide } from '../../src/lib/riskModels/dementia.js'
import { computeParkinson } from '../../src/lib/riskModels/parkinson.js'
import { computeOsta } from '../../src/lib/riskModels/osteoporosis.js'
import { computeSarcF } from '../../src/lib/riskModels/sarcopenia.js'

function assert(cond, message) {
  if (!cond) throw new Error(message)
}

const men = computeChinaPar({ ...CHINA_PAR_PAPER_EXAMPLE, sex: 'male' })
const women = computeChinaPar({ ...CHINA_PAR_PAPER_EXAMPLE, sex: 'female' })
assert(men.ok && women.ok, men.error || women.error)
assert(men.percent >= 10.6 && men.percent <= 11.2, `男性示例应为约 11.0%，实际 ${men.percent}`)
assert(women.percent >= 9.9 && women.percent <= 10.4, `女性示例应为约 10.1%，实际 ${women.percent}`)
assert(men.band.id === 'high' && women.band.id === 'high', '示例应判为高危')

const dm = computeDiabetesBundle({
  sex: 'male',
  age: 58,
  heightCm: 170,
  weightKg: 78,
  waistCm: 92,
  sbp: 138,
  familyDiabetes: true,
  familyFindrisc: 'first',
  dailyActivity30: false,
  dailyVegetables: false,
  bpMedication: true,
  historyHighGlucose: false,
})
assert(dm.ok, dm.error)
assert(dm.china.score >= 25, `中国评分高危示例应 ≥25，实际 ${dm.china.score}`)
assert(dm.findrisc.score >= 12, `FINDRISC 中高危示例应 ≥12，实际 ${dm.findrisc.score}`)

const life = computeLifestyle({
  sex: 'female',
  age: 45,
  heightCm: 160,
  weightKg: 56,
  waistCm: 74,
  activityMinutes: 180,
  activityLevel: 'moderate',
  nicotine: 'never',
  diet: 'good',
  sleepHours: 7.5,
  sbp: 118,
  dbp: 74,
  glucose: 'normal',
  lipids: 'optimal',
})
assert(life.ok, life.error)
assert(life.bmi >= 21 && life.bmi <= 23, `BMI 示例异常 ${life.bmi}`)
assert(life.bmiBand.id === 'normal', '中国 BMI 切点应为正常')
assert(life.energy.bmr > 1100 && life.energy.bmr < 1400, `BMR 异常 ${life.energy.bmr}`)
assert(life.le8 >= 80, `较理想生活方式 LE8 应 ≥80，实际 ${life.le8}`)

const htn = computeFraminghamHypertension({
  sex: 'male',
  age: 45,
  heightCm: 175,
  weightKg: 80,
  sbp: 132,
  dbp: 84,
  smoking: false,
  treatedHypertension: false,
  diabetes: false,
  parentalHypertension: 1,
})
assert(htn.ok && !htn.alreadyHypertensive, htn.error)
assert(htn.percent > 10 && htn.percent < 40, `Framingham 示例应在高危区间，实际 ${htn.percent}`)

const alreadyHtn = computeFraminghamHypertension({
  sex: 'female',
  age: 50,
  heightCm: 160,
  weightKg: 58,
  sbp: 150,
  dbp: 92,
  smoking: false,
  treatedHypertension: false,
  parentalHypertension: 0,
})
assert(alreadyHtn.ok && alreadyHtn.alreadyHypertensive, '血压已达阈值时应停止估算新发风险')

const caide = computeCaide({
  sex: 'male',
  age: 55,
  heightCm: 170,
  weightKg: 91,
  sbp: 150,
  educationYears: 8,
  tc: 7,
  tcUnit: 'mmol',
  activityMinutes: 60,
})
assert(caide.ok, caide.error)
assert(caide.score === 14, `CAIDE 高危示例应为 14，实际 ${caide.score}`)
assert(caide.percent === 16.4, `CAIDE 12–15 分应为 16.4%，实际 ${caide.percent}`)

const osta = computeOsta({ sex: 'female', age: 65, weightKg: 55 })
assert(osta.ok && osta.index === -2 && osta.band.id === 'intermediate', `OSTA 65岁55kg 应为 -2 中危，实际 ${osta.index}`)

const sarc = computeSarcF({
  sex: 'female',
  age: 72,
  sarcStrength: 1,
  sarcWalking: 1,
  sarcRise: 1,
  sarcClimb: 1,
  sarcFalls: 0,
})
assert(sarc.ok && sarc.score === 4 && sarc.band.id === 'high', `SARC-F 切点示例应为 4，实际 ${sarc.score}`)

const pd = computeParkinson({
  sex: 'female',
  nicotine: 'never',
  familyPd: false,
  constipation: false,
  drinksCoffee: true,
  pesticide: false,
  moodDisorder: false,
  rbd: false,
  hyposmia: false,
})
assert(pd.ok && pd.relativeRisk === 0.67, `喝咖啡参考组合应为 0.67，实际 ${pd.relativeRisk}`)

console.log('risk-models ok', {
  chinaParMen: men.percent,
  chinaParWomen: women.percent,
  chinaDiabetes: dm.china.score,
  findrisc: dm.findrisc.score,
  le8: life.le8,
  bmr: life.energy.bmr,
  tdee: life.energy.tdee,
  framinghamHtn: htn.percent,
  caide: caide.score,
  osta: osta.index,
  sarcF: sarc.score,
  parkinsonRr: pd.relativeRisk,
})
