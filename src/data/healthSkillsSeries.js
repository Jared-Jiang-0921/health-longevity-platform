/**
 * 长寿知识技能 — 视频系列合集（与 module_assets.subtopic 字段一致）
 * 管理员上传时「系列合集」应选此处或 courses 中同名的课程标题。
 *
 * 磁盘目录（ECS）：storage/module-assets/health-skills/{系列合集名}/{文件id}.ext
 */
import { CATEGORIES } from './courses'

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
  return HEALTH_SKILLS_VIDEO_SERIES.find((s) => s.title === t) || null
}
