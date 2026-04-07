const PATTERNS = {
  zh: {
    requiresLevel: (level) => `需${level}及以上`,
    configureEnvVar: (name) => `请在 .env 中配置 ${name}`,
    legalVersion: (v) => `法律文案版本：${v}`,
    latestSavedAt: (v) => `您最近一次保存：${v}`,
  },
  en: {
    requiresLevel: (level) => `Requires ${level}+`,
    configureEnvVar: (name) => `Please configure ${name} in .env`,
    legalVersion: (v) => `Legal version: ${v}`,
    latestSavedAt: (v) => `Latest saved: ${v}`,
  },
  ar: {
    requiresLevel: (level) => `يتطلب ${level} أو أعلى`,
    configureEnvVar: (name) => `يرجى ضبط ${name} في .env`,
    legalVersion: (v) => `نسخة الشروط: ${v}`,
    latestSavedAt: (v) => `آخر حفظ: ${v}`,
  },
}

export function getPatterns(lang = 'zh') {
  return PATTERNS[lang] || PATTERNS.zh
}
