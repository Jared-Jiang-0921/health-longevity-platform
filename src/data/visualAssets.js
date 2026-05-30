/**
 * 全站视觉素材注册表
 * - 本地 PNG：public/images/visual/
 * - 可选 Image2 CDN：设置 VITE_IMAGE2_BASE_URL 后按 image2Key 拉取
 *
 * 规范：16:9 模块封面 · 白蓝医疗风 · 无真人/医院照片
 */

const IMAGE2_BASE = (import.meta.env.VITE_IMAGE2_BASE_URL || '').replace(/\/$/, '')

/** @typedef {{ localPath: string, image2Key?: string, aspectRatio?: string, alt: Record<string,string>, prompt: string }} VisualAsset */

/** @type {Record<string, VisualAsset>} */
export const VISUAL_ASSETS = {
  heroCockpit: {
    localPath: '/images/visual/hero-cockpit.png',
    image2Key: 'hero-cockpit',
    aspectRatio: '4/3',
    alt: {
      zh: '长寿医学数字孪生驾驶舱：生物标志物、睡眠、代谢与认知健康可视化',
      en: 'Longevity medicine digital twin dashboard with biomarkers and health metrics',
      ar: 'لوحة تحكم طب طول العمر الرقمية',
    },
    prompt:
      'Futuristic longevity medicine dashboard, human health digital twin, biomarkers, sleep, metabolism, cognition, blue white medical UI, clean, scientific, minimalist, Apple style, clinical design',
  },
  bannerTcmPrevention: {
    localPath: '/images/visual/banners/tcm-prevention.png',
    image2Key: 'banner-tcm-prevention',
    aspectRatio: '21/9',
    alt: {
      zh: '中医治未病：顺四时而养生，调体质而防未病',
      en: 'TCM preventive care: seasonal wellness and constitution balance',
      ar: 'الطب الصيني الوقائي',
    },
    prompt:
      'Chinese preventive medicine, harmony between human and nature, four seasons wellness, modern oriental healthcare, ink landscape, subtle meridian lines, luxury healthcare platform, white jade green color palette',
  },
}

/** @type {Record<string, VisualAsset & { moduleId: string }>} */
export const MODULE_VISUAL_ASSETS = {
  'ai-longevity-coach': {
    moduleId: 'solutions',
    localPath: '/images/visual/modules/ai-longevity-coach.png',
    image2Key: 'module-ai-longevity-coach',
    aspectRatio: '16/9',
    alt: {
      zh: '数字健康孪生与 AI 健康分析',
      en: 'Digital health twin and AI health analysis',
      ar: 'التوأم الرقمي للصحة',
    },
    prompt:
      'Digital twin human body, AI health analysis, biomarker visualization, medical dashboard, clean blue white style, clinical technology, high-end SaaS design',
  },
  'health-skills': {
    moduleId: 'health-skills',
    localPath: '/images/visual/modules/health-skills.png',
    image2Key: 'module-health-skills',
    aspectRatio: '16/9',
    alt: {
      zh: '长寿知识图谱与神经学习网络',
      en: 'Longevity knowledge graph and neural learning',
      ar: 'رسم معرفي للمعرفة',
    },
    prompt:
      'Longevity knowledge graph, brain neural connections, learning system, scientific education, blue medical style, clean background',
  },
  'products-evidence': {
    moduleId: 'products',
    localPath: '/images/visual/modules/products-evidence.png',
    image2Key: 'module-products-evidence',
    aspectRatio: '16/9',
    alt: {
      zh: '循证医学研究与实验室数据可视化',
      en: 'Evidence-based medicine research and lab data',
      ar: 'الأدلة الطبية والبحث',
    },
    prompt:
      'Evidence based medicine, research laboratory, clinical studies, scientific data visualization, white blue minimal design',
  },
  'tcm-prevention': {
    moduleId: 'tcm-prevention',
    localPath: '/images/visual/modules/tcm-prevention.png',
    image2Key: 'module-tcm-prevention',
    aspectRatio: '16/9',
    alt: {
      zh: '现代化中医治未病与四季养生',
      en: 'Modern TCM preventive care and seasonal wellness',
      ar: 'الطب الصيني الوقائي الحديث',
    },
    prompt:
      'Modern traditional Chinese medicine, preventive healthcare, four seasons wellness, meridian energy visualization, elegant ink wash elements, minimalist medical design, white and jade green palette, premium healthcare style',
  },
  'longevity-news': {
    moduleId: 'longevity-news',
    localPath: '/images/visual/modules/longevity-news.png',
    image2Key: 'module-longevity-news',
    aspectRatio: '16/9',
    alt: {
      zh: '前沿医学研究与顶刊突破',
      en: 'Medical research breakthroughs and journal science',
      ar: 'أبحاث طبية رائدة',
    },
    prompt:
      'Medical research breakthrough, scientific journal visualization, future medicine, clinical innovation, clean editorial style',
  },
  'translation-opportunities': {
    moduleId: 'translation-opportunities',
    localPath: '/images/visual/modules/translation-opportunities.png',
    image2Key: 'module-translation-opportunities',
    aspectRatio: '16/9',
    alt: {
      zh: '医疗健康创新与产业转化生态',
      en: 'Healthcare innovation and industry ecosystem',
      ar: 'ابتكار الرعاية الصحية',
    },
    prompt:
      'Healthcare innovation ecosystem, AI healthcare applications, industry transformation, modern business illustration, minimal medical technology design',
  },
}

/** 模块 path → visualKey */
export const MODULE_PATH_TO_VISUAL_KEY = {
  '/solutions': 'ai-longevity-coach',
  '/health-skills': 'health-skills',
  '/products': 'products-evidence',
  '/tcm-prevention': 'tcm-prevention',
  '/longevity-news': 'longevity-news',
  '/translation-opportunities': 'translation-opportunities',
}

/**
 * @param {{ localPath: string, image2Key?: string }} asset
 * @returns {string}
 */
export function resolveVisualUrl(asset) {
  if (IMAGE2_BASE && asset.image2Key) {
    return `${IMAGE2_BASE}/${asset.image2Key}`
  }
  return asset.localPath
}

/** @param {keyof typeof VISUAL_ASSETS} id */
export function getVisualAsset(id) {
  return VISUAL_ASSETS[id]
}

/** @param {keyof typeof VISUAL_ASSETS} id */
export function getVisualAssetUrl(id) {
  const asset = VISUAL_ASSETS[id]
  if (!asset) return ''
  return resolveVisualUrl(asset)
}

/** @param {string} visualKey */
export function getModuleVisualUrl(visualKey) {
  const asset = MODULE_VISUAL_ASSETS[visualKey]
  if (!asset) return ''
  return resolveVisualUrl(asset)
}

/** @param {string} path - module route e.g. /solutions */
export function getModuleVisualByPath(path) {
  const key = MODULE_PATH_TO_VISUAL_KEY[path]
  return key ? getModuleVisualUrl(key) : ''
}

/** @param {string} path */
export function getModuleVisualAlt(path, lang = 'zh') {
  const key = MODULE_PATH_TO_VISUAL_KEY[path]
  const asset = key ? MODULE_VISUAL_ASSETS[key] : null
  if (!asset) return ''
  return asset.alt[lang] || asset.alt.zh
}

/** @param {keyof typeof VISUAL_ASSETS} id @param {string} lang */
export function getVisualAlt(id, lang = 'zh') {
  const asset = VISUAL_ASSETS[id]
  if (!asset) return ''
  return asset.alt[lang] || asset.alt.zh
}

export function isImage2Enabled() {
  return Boolean(IMAGE2_BASE)
}
