/**
 * 产品目录展示文案。PRODUCT_CATEGORIES.label 与 PRODUCTS 中文标题仍是存储键。
 */
import { PRODUCT_CATEGORIES } from './products.js'

const CATEGORY_LABELS = {
  en: {
    supplement: 'Dietary supplements',
    equipment: 'Health devices',
    food: 'Health foods',
    care: 'Daily care',
  },
  ar: {
    supplement: 'مكملات غذائية',
    equipment: 'أجهزة صحية',
    food: 'أغذية صحية',
    care: 'عناية يومية',
  },
}

const UNITS = {
  en: {
    瓶: 'bottle',
    只: 'unit',
    台: 'unit',
    袋: 'bag',
    盒: 'box',
    件: 'item',
  },
  ar: {
    瓶: 'زجاجة',
    只: 'قطعة',
    台: 'جهاز',
    袋: 'كيس',
    盒: 'علبة',
    件: 'قطعة',
  },
}

const STATIC_TEXT = {
  en: {
    1: {
      title: 'Vitamin D3 + K2',
      desc: 'Supports calcium absorption, and bone and cardiovascular health.',
    },
    2: {
      title: 'Omega-3 fish oil',
      desc: 'High-purity EPA/DHA for cardiovascular and cognitive health.',
    },
    3: {
      title: 'Multivitamin',
      desc: 'One tablet a day for baseline nutrient needs.',
    },
    4: {
      title: 'Melatonin tablets',
      desc: 'A low-dose formula meant to support sleep quality.',
    },
    5: {
      title: 'Fitness band',
      desc: 'Heart rate, sleep, and activity tracking, with about 7 days of battery.',
    },
    6: {
      title: 'Body-composition scale',
      desc: 'Several body measures, with sync to an app.',
    },
    7: {
      title: 'Massage gun',
      desc: 'Several speeds for relaxation and recovery after exercise.',
    },
    8: {
      title: 'Organic oats',
      desc: 'No added sugar, high in fiber, ready to eat or stir into liquid.',
    },
    9: {
      title: 'Dried blueberries',
      desc: 'An antioxidant food; a modest amount is discussed for cognition.',
    },
    10: {
      title: 'Almonds',
      desc: 'Fats and protein; a small handful a day.',
    },
    11: {
      title: 'Eye patches',
      desc: 'For eye fatigue after long periods of screen use.',
    },
    12: {
      title: 'Sleep essential oil',
      desc: 'Lavender and other plant ingredients, to support winding down for sleep.',
    },
  },
  ar: {
    1: {
      title: 'فيتامين D3 + K2',
      desc: 'يدعم امتصاص الكالسيوم وصحة العظام والقلب والأوعية.',
    },
    2: {
      title: 'زيت السمك أوميغا-3',
      desc: 'EPA/DHA عالي النقاء لصحة القلب والأوعية والإدراك.',
    },
    3: {
      title: 'فيتامينات متعددة',
      desc: 'قرص يومي للاحتياج الغذائي الأساسي.',
    },
    4: {
      title: 'أقراص الميلاتونين',
      desc: 'صيغة منخفضة الجرعة لدعم جودة النوم.',
    },
    5: {
      title: 'سوار لياقة',
      desc: 'تتبّع النبض والنوم والحركة، وبطارية لنحو 7 أيام.',
    },
    6: {
      title: 'ميزان تكوين الجسم',
      desc: 'عدة مقاييس للجسم، مع مزامنة إلى تطبيق.',
    },
    7: {
      title: 'مسدس تدليك',
      desc: 'عدة سرعات للاسترخاء والتعافي بعد الحركة.',
    },
    8: {
      title: 'شوفان عضوي',
      desc: 'بلا سكر مضاف، غني بالألياف، جاهز للأكل أو الخلط مع سائل.',
    },
    9: {
      title: 'توت أزرق مجفف',
      desc: 'غذاء مضاد للأكسدة؛ الكمية المعتدلة تُذكر في سياق الإدراك.',
    },
    10: {
      title: 'لوز',
      desc: 'دهون وبروتين؛ حفنة صغيرة في اليوم.',
    },
    11: {
      title: 'لصقات للعين',
      desc: 'لتعب العين بعد استخدام الشاشة مدة طويلة.',
    },
    12: {
      title: 'زيت عطري للنوم',
      desc: 'لافندر ومكونات نباتية أخرى، لدعم التهدئة قبل النوم.',
    },
  },
}

const CHROME = {
  zh: {
    listed: '上架',
    listedLong: '上架商品',
    zhOnly: '此条仅有中文',
    sep: '：',
    samePrice: '同基础价',
    baseNote: '（基础标价；SKU 可能有单独定价）',
  },
  en: {
    listed: 'Listed',
    listedLong: 'Listed product',
    zhOnly: 'This item is in Chinese only',
    sep: ': ',
    samePrice: 'Base price',
    baseNote: '(Base price; a SKU may have its own price)',
  },
  ar: {
    listed: 'معروض',
    listedLong: 'منتج معروض',
    zhOnly: 'هذا المحتوى بالصينية فقط',
    sep: ': ',
    samePrice: 'السعر الأساسي',
    baseNote: '(السعر الأساسي؛ قد يختلف سعر المواصفة)',
  },
}

export function hasChinese(value) {
  return /[\u4e00-\u9fff]/.test(String(value || ''))
}

export function productChrome(lang = 'zh') {
  return CHROME[lang] || CHROME.zh
}

export function categoryDisplayLabel(idOrLabel, lang = 'zh') {
  const key = String(idOrLabel || '').trim()
  const cat = PRODUCT_CATEGORIES.find((item) => item.id === key || item.label === key)
  if (!cat) return key
  if (!lang || lang === 'zh') return cat.label
  return CATEGORY_LABELS[lang]?.[cat.id] || cat.label
}

export function unitDisplay(unit, lang = 'zh') {
  const raw = String(unit || '').trim()
  if (!raw || !lang || lang === 'zh') return raw
  return UNITS[lang]?.[raw] || raw
}

export function staticProductDisplay(product, lang = 'zh') {
  if (!product) return { title: '', desc: '', unit: '', zhOnly: false }
  const unit = unitDisplay(product.unit, lang)
  if (!lang || lang === 'zh') {
    return { title: product.title || '', desc: product.desc || '', unit, zhOnly: false }
  }
  const pack = STATIC_TEXT[lang]?.[product.id]
  if (!pack) {
    return {
      title: product.title || '',
      desc: product.desc || '',
      unit,
      zhOnly: hasChinese(`${product.title || ''} ${product.desc || ''} ${unit}`),
    }
  }
  return {
    title: pack.title,
    desc: pack.desc,
    unit,
    zhOnly: false,
  }
}
