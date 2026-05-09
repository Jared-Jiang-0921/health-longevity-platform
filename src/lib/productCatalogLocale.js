/** 上架商品中英阿展示字段（阿语暂无专用字段时回退英文→中文） */
export function pickCatalogLocale(item, lang) {
  const titleZh = item.title_zh ?? item.title ?? ''
  const titleEn = item.title_en ?? ''
  const descZh = item.description_zh ?? item.description ?? item.desc ?? ''
  const descEn = item.description_en ?? ''
  const originZh = item.origin_zh ?? item.origin ?? ''
  const originEn = item.origin_en ?? ''

  if (lang === 'en') {
    return {
      title: titleEn || titleZh,
      desc: descEn || descZh,
      origin: originEn || originZh,
    }
  }
  if (lang === 'ar') {
    return {
      title: titleEn || titleZh,
      desc: descEn || descZh,
      origin: originEn || originZh,
    }
  }
  return {
    title: titleZh,
    desc: descZh,
    origin: originZh,
  }
}

export function pickSkuLocale(sku, lang) {
  const zh = sku.spec_zh || sku.specZh || ''
  const en = sku.spec_en || sku.specEn || ''
  if (lang === 'en') return en || zh
  if (lang === 'ar') return en || zh
  return zh || en
}
