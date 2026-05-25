/**
 * 长寿知识技能 — 视频系列合集（与 module_assets.subtopic 字段一致）
 * 管理员上传时「系列合集」应选此处或 courses 中同名的课程标题。
 *
 * 磁盘目录（ECS）：storage/module-assets/health-skills/{系列合集名}/{文件id}.ext
 */
import { CATEGORIES, COURSES } from './courses.js'

/** 与 moduleAssetStorage 一致的目录名片段（纯函数，前后端共用） */
export function sanitizeSeriesDirName(subtopic) {
  const s = String(subtopic || '').trim().slice(0, 80)
  if (!s) return '_未分类'
  const cleaned = s.replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim()
  return cleaned || '_未分类'
}

/** @typedef {{ id: string, title: string, category: string, desc?: string }} VideoSeries */

/** @type {VideoSeries[]} */
export const HEALTH_SKILLS_VIDEO_SERIES = [
  {
    id: 'senior-7min-strength',
    title: '老年人7分钟力量训练',
    category: 'exercise',
    desc: '适合老年人的短时力量训练视频合集，按集上传至本系列。',
  },
  {
    id: 'fat-burn-7',
    title: '燃脂7原则',
    category: 'exercise',
    desc: '燃脂训练原则与跟练视频，按主题分集收录。',
  },
  {
    id: 'immunity-autoimmune',
    title: '自身免疫健康系列',
    category: 'immunity',
    courseIds: [14],
    aliases: ['免疫系统与健康防线'],
    desc: '与课程「免疫系统与健康防线」配套；上传时系列合集也可选课程名「免疫系统与健康防线」。',
  },
]

export function getCategoryLabel(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.label || ''
}

/** 某大类下所有系列标题（含 courses 同大类课程名，去重） */
export function getSeriesTitlesForCategory(categoryId, courseTitles = []) {
  const fromSeries = HEALTH_SKILLS_VIDEO_SERIES
    .filter((s) => s.category === categoryId)
    .map((s) => s.title)
  return Array.from(new Set([...fromSeries, ...courseTitles])).filter(Boolean)
}

export function findSeriesByTitle(title) {
  const t = String(title || '').trim()
  if (!t) return null
  const direct = HEALTH_SKILLS_VIDEO_SERIES.find((s) => s.title === t)
  if (direct) return direct
  return HEALTH_SKILLS_VIDEO_SERIES.find((s) => (s.aliases || []).includes(t)) || null
}

export function getSeriesForCourse(course) {
  if (!course) return null
  const byCourseId = HEALTH_SKILLS_VIDEO_SERIES.find((s) =>
    Array.isArray(s.courseIds) && s.courseIds.includes(course.id),
  )
  if (byCourseId) return byCourseId
  return findSeriesByTitle(course.title) || null
}

export function seriesSubtopicAliases(series) {
  if (!series) return []
  return Array.from(new Set([series.title, ...(series.aliases || [])])).filter(Boolean)
}

export function parseSeriesDirFromStoredName(storedName) {
  const sn = String(storedName || '').replace(/\\/g, '/').trim()
  const parts = sn.split('/').filter(Boolean)
  if (parts[0] !== 'health-skills' || parts.length < 3) return ''
  return parts[1]
}

function findSeriesByDirSegment(dirSeg) {
  const seg = String(dirSeg || '').trim()
  if (!seg || seg === '_未分类') return null
  return HEALTH_SKILLS_VIDEO_SERIES.find((s) => sanitizeSeriesDirName(s.title) === seg) || null
}

export function getCanonicalSeriesSubtopic(raw) {
  const t = String(raw || '').trim()
  if (!t || t === '待归类') return ''

  const bySeries = findSeriesByTitle(t)
  if (bySeries) return bySeries.title

  const course = COURSES.find((c) => c.title === t)
  if (course) {
    const linked = getSeriesForCourse(course)
    if (linked) return linked.title
    if (course.videoSeries) return course.title
  }

  const dirSeries = findSeriesByDirSegment(t)
  if (dirSeries) return dirSeries.title

  return t
}

/** 将已上传/新上传资料归到「亚类 + 系列合集」子模块 */
export function resolveHealthSkillsAssetGrouping({
  subtopic = '',
  subcategory = '',
  title = '',
  storedName = '',
} = {}) {
  const hints = [
    String(subtopic || '').trim(),
    String(title || '').trim(),
    parseSeriesDirFromStoredName(storedName),
  ].filter(Boolean)

  let series = null
  for (const hint of hints) {
    series = findSeriesByTitle(hint) || findSeriesByDirSegment(hint)
    if (series) break
    const course = COURSES.find((c) => c.title === hint)
    if (course) {
      series = getSeriesForCourse(course)
      if (series) break
      if (course.videoSeries) {
        return {
          subcategory: getCategoryLabel(course.category) || String(subcategory || '').trim(),
          subtopic: course.title,
          seriesId: null,
        }
      }
    }
  }

  if (series) {
    return {
      subcategory: getCategoryLabel(series.category) || String(subcategory || '').trim(),
      subtopic: series.title,
      seriesId: series.id,
    }
  }

  const catLabel = String(subcategory || '').trim()
  const catHit = CATEGORIES.find((c) => c.label === catLabel || c.id === catLabel)
  return {
    subcategory: catHit?.label || catLabel || CATEGORIES[0]?.label || '长寿基础知识',
    subtopic: getCanonicalSeriesSubtopic(subtopic) || String(subtopic || '').trim(),
    seriesId: null,
  }
}

/** 课程页：资料是否属于该系列子模块 */
export function assetMatchesCourseSeries(item, course, categoryLabel) {
  const topic = String(item?.subtopic || '').trim()
  if (!topic || !course) return false

  const sub = String(item?.subcategory || '').trim()
  const cat = String(categoryLabel || '').trim()
  if (cat && sub && sub !== cat) return false

  const series = getSeriesForCourse(course)
  if (series) {
    return seriesSubtopicAliases(series).includes(topic)
  }

  if (course.videoSeries) return topic === course.title
  return topic === course.title
}
