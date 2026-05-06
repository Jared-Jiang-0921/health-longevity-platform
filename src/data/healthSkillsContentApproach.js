/**
 * 长寿知识技能模块：内容呈现与编排思路（供列表 / 详情 / 学习页一致展示）
 */
export const HEALTH_SKILLS_CONTENT_APPROACH = {
  zh: '内容呈现思路：知识卡片 + 实操清单 + 证据等级 + 适用人群 + 风险提示。',
  en: 'Content approach: knowledge cards · actionable checklists · evidence grading · who it applies to · risk notes.',
  ar: 'أسلوب المحتوى: بطاقات معرفية · قوائم عملية · تصنيف الأدلة · الجمهور المناسب · تنبيهات المخاطر.',
}

export function getHealthSkillsContentApproach(lang) {
  const key = lang === 'en' || lang === 'ar' ? lang : 'zh'
  return HEALTH_SKILLS_CONTENT_APPROACH[key] || HEALTH_SKILLS_CONTENT_APPROACH.zh
}
