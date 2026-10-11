/**
 * 各模块底部「管理员上传」的栏目 / 条目，与页面现有结构共用同一套名称。
 */
import { CATEGORIES, COURSES } from './courses.js'
import { getSeriesTitlesForCategory } from './healthSkillsSeries.js'
import { PRODUCT_CATEGORIES } from './products.js'
import { LONGEVITY_NEWS_COLUMN_LABELS } from './longevityNewsColumns.js'
import { getTcmPreventionModuleCopy } from './tcmPreventionModuleI18n.js'
import { TCM_HERBS, TCM_PRESCRIPTIONS } from './tcmPrevention.js'
import { TCM_CONSTITUTIONS } from './tcmConstitutions.js'
import { getTranslationOpportunitiesModuleCopy } from './translationOpportunitiesModuleI18n.js'

const TCM_LIBRARY_TABS = ['中草药单药', '经典处方']
const TCM_PLANNED = getTcmPreventionModuleCopy('zh').columnRows.map((row) => row.module)
const TRANSLATION_COLUMNS = getTranslationOpportunitiesModuleCopy('zh').columnRows.map((row) => row.column)

const FIELD_LABELS = {
  'health-skills': {
    zh: { subcategory: '课程大类（亚类）', subtopic: '系列合集（如：老年人7分钟力量训练）', subcategoryContent: '按课程大类查看资料', hint: '上传视频时请选择与课程系列一致的「系列合集」，视频会显示在该系列课程页。' },
    en: { subcategory: 'Course category', subtopic: 'Series collection', subcategoryContent: 'Browse by course category', hint: 'Pick the series name; videos appear on that series course page.' },
    ar: { subcategory: 'فئة الدورة', subtopic: 'المجموعة', subcategoryContent: 'حسب فئة الدورة', hint: '' },
  },
  products: {
    zh: { subcategory: '产品类型', subtopic: '资料类型', subcategoryContent: '按产品类型查看资料', hint: '资料会归入上方商品分类（营养补充剂、健康设备等）。' },
    en: { subcategory: 'Product type', subtopic: 'Asset type', subcategoryContent: 'Browse by product type', hint: '' },
    ar: { subcategory: 'نوع المنتج', subtopic: 'نوع المادة', subcategoryContent: 'حسب نوع المنتج', hint: '' },
  },
  'tcm-prevention': {
    zh: { subcategory: '治未病栏目', subtopic: '对应条目（单药 / 处方 / 专题）', subcategoryContent: '按治未病栏目查看资料', hint: '请选与本页栏目一致的分类：规划栏目或「中草药单药 / 经典处方」。' },
    en: { subcategory: 'Preventive TCM column', subtopic: 'Matching item', subcategoryContent: 'Browse by TCM column', hint: '' },
    ar: { subcategory: 'عمود الوقاية', subtopic: 'البند', subcategoryContent: 'حسب العمود', hint: '' },
  },
  'longevity-news': {
    zh: { subcategory: '资讯栏目', subtopic: '稿件类型', subcategoryContent: '按资讯栏目查看资料', hint: '请选与本页栏目一致的分类后再发布链接或上传文件。' },
    en: { subcategory: 'News column', subtopic: 'Item type', subcategoryContent: 'Browse by news column', hint: '' },
    ar: { subcategory: 'عمود الأخبار', subtopic: 'نوع المادة', subcategoryContent: 'حسب العمود', hint: '' },
  },
  'translation-opportunities': {
    zh: { subcategory: '转化栏目', subtopic: '资料类型', subcategoryContent: '按转化栏目查看资料', hint: '请选与上表栏目一致的分类。' },
    en: { subcategory: 'Column', subtopic: 'Asset type', subcategoryContent: 'Browse by column', hint: '' },
    ar: { subcategory: 'العمود', subtopic: 'نوع المادة', subcategoryContent: 'حسب العمود', hint: '' },
  },
  solutions: {
    zh: { subcategory: '能力栏目', subtopic: '资料类型', subcategoryContent: '按能力栏目查看资料', hint: '请归入本页能力：专业咨询、自我促进咨询、内容资源或健康问卷。' },
    en: { subcategory: 'Capability', subtopic: 'Asset type', subcategoryContent: 'Browse by capability', hint: '' },
    ar: { subcategory: 'القدرة', subtopic: 'نوع المادة', subcategoryContent: 'حسب القدرة', hint: '' },
  },
}

const DEFAULT_LABELS = {
  zh: { subcategory: '栏目', subtopic: '条目', subcategoryContent: '按栏目查看资料', hint: '' },
  en: { subcategory: 'Column', subtopic: 'Item', subcategoryContent: 'Browse by column', hint: '' },
  ar: { subcategory: 'العمود', subtopic: 'البند', subcategoryContent: 'حسب العمود', hint: '' },
}

export function getModuleAssetFieldLabels(moduleKey, lang = 'zh') {
  const locale = lang === 'en' || lang === 'ar' ? lang : 'zh'
  const pack = FIELD_LABELS[moduleKey] || DEFAULT_LABELS
  return pack[locale] || pack.zh || DEFAULT_LABELS.zh
}

export function getModuleAssetSubcategories(moduleKey) {
  const courseCategories = CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.label)
  const productCategories = PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((c) => c.label)
  const map = {
    'health-skills': courseCategories,
    products: productCategories,
    'longevity-news': LONGEVITY_NEWS_COLUMN_LABELS,
    'tcm-prevention': [...TCM_PLANNED, ...TCM_LIBRARY_TABS],
    'translation-opportunities': TRANSLATION_COLUMNS,
    solutions: ['专业健康长寿咨询', '自我健康促进咨询', '内容资源', '健康问卷与评估'],
    'health-questionnaire': ['基础信息', '健康目标与关注', '病史与用药', '生活方式', '法律同意'],
    favorites: ['长寿知识技能收藏', '产品收藏', '资讯收藏', '精选推荐'],
    payment: ['会员套餐', '支付指引', '账单与发票', '退款与售后'],
    account: ['账号资料', '安全设置', '双因素认证', '登录与设备'],
    tax: ['税务说明', '税率规则', '申报模板', '地区政策'],
  }
  return map[moduleKey] || ['通用资料']
}

export function getModuleAssetSubtopics(moduleKey, subcategoryLabel) {
  const label = String(subcategoryLabel || '').trim()
  if (!label) return []

  if (moduleKey === 'health-skills') {
    const category = CATEGORIES.find((c) => c.label === label || c.id === label)
    if (!category) return []
    const courseTitles = COURSES
      .filter((course) => course.category === category.id)
      .map((course) => course.title)
    return getSeriesTitlesForCategory(category.id, courseTitles)
  }

  if (moduleKey === 'products') return ['产品详情资料']
  if (moduleKey === 'longevity-news') return ['文章']

  if (moduleKey === 'tcm-prevention') {
    if (label === '体质识别') return TCM_CONSTITUTIONS.map((item) => item.name.zh)
    if (label === '中草药单药') return TCM_HERBS.map((h) => h.name)
    if (label === '经典处方') return TCM_PRESCRIPTIONS.map((p) => p.name)
    if (TCM_PLANNED.includes(label)) return ['专题资料']
    return []
  }

  if (moduleKey === 'translation-opportunities') return ['专题资料']

  if (moduleKey === 'solutions') {
    if (label === '专业健康长寿咨询' || label === '自我健康促进咨询') return ['咨询说明']
    if (label === '内容资源') return ['内容通道']
    if (label === '健康问卷与评估') return ['问卷指引']
    return []
  }

  return []
}
