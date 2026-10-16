import { hasChinese } from '../data/productLocale.js'

/** 上架商品中英阿展示字段。阿语无专用列时用英文；缺译文时保留中文并标 zhOnly。 */
export function pickCatalogLocale(item, lang) {
  const titleZh = item.title_zh ?? item.title ?? ''
  const titleEn = item.title_en ?? ''
  const descZh = item.description_zh ?? item.description ?? item.desc ?? ''
  const descEn = item.description_en ?? ''
  const originZh = item.origin_zh ?? item.origin ?? ''
  const originEn = item.origin_en ?? ''

  if (lang === 'en' || lang === 'ar') {
    const title = titleEn || titleZh
    const desc = descEn || descZh
    const origin = originEn || originZh
    return {
      title,
      desc,
      origin,
      zhOnly: hasChinese(`${title} ${desc} ${origin}`),
    }
  }
  return {
    title: titleZh,
    desc: descZh,
    origin: originZh,
    zhOnly: false,
  }
}

export function pickSkuLocale(sku, lang) {
  const zh = sku.spec_zh || sku.specZh || ''
  const en = sku.spec_en || sku.specEn || ''
  if (lang === 'en') return en || zh
  if (lang === 'ar') return en || zh
  return zh || en
}
