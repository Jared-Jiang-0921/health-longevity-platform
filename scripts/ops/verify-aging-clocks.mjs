import { computeAgingAssessment } from '../../src/lib/agingClocks/index.js'

function assert(cond, message) {
  if (!cond) throw new Error(message)
}

const shared = { sex: 'male', chronologicalAge: 55, sampleType: 'blood', arrayType: 'epic' }

const horvath = computeAgingAssessment('horvath', { ...shared, clockAge: 61.2 })
assert(horvath.ok, horvath.error)
assert(horvath.accel === 6.2, `Horvath 加速应为 6.2，实际 ${horvath.accel}`)
assert(horvath.band.id === 'intermediate', 'Horvath +6.2 应为轻度偏高')
assert(!horvath.suitableForChinese, 'Horvath 不应标更适合中国人')

const icas = computeAgingAssessment('icas', { ...shared, clockAge: 54.4 })
assert(icas.ok && icas.suitableForChinese, 'iCAS 应标更适合中国人')
assert(icas.accel === -0.6, `iCAS 差值应为 -0.6，实际 ${icas.accel}`)
assert(icas.summary.includes('更适合中国人'), 'iCAS 摘要应写明更适合中国人')

const grim = computeAgingAssessment('grimage2', { ...shared, clockAge: 67 })
assert(grim.ok && grim.accel === 12, `GrimAge2 差值应为 12，实际 ${grim.accel}`)
assert(grim.band.id === 'high' && grim.band.adviseClinician, 'GrimAge2 +12 应提示与医师讨论')

const pace = computeAgingAssessment('dunedinpace', { ...shared, pace: 1.12 })
assert(pace.ok && pace.pace === 1.12, `PACE 应为 1.12，实际 ${pace.pace}`)
assert(pace.band.id === 'high', 'PACE 1.12 应为衰老偏快')
assert(pace.deltaPct === 12, `相对每年老一年应为 +12%，实际 ${pace.deltaPct}`)

const typical = computeAgingAssessment('dunedinpace', { ...shared, pace: 1.01 })
assert(typical.ok && typical.band.id === 'low', 'PACE 1.01 应接近每年老一年')

const missing = computeAgingAssessment('horvath', { sex: 'male', chronologicalAge: 40 })
assert(!missing.ok, '缺时钟年龄应失败')

console.log('aging-clocks ok', {
  horvathAccel: horvath.accel,
  icasAccel: icas.accel,
  grimAccel: grim.accel,
  pace: pace.pace,
})
