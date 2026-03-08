/**
 * 模拟：国际权威期刊高影响因子健康长寿研究资讯（可后续对接真实 API）
 * 字段：期刊、影响因子、标题、摘要、月份、链接
 */
export const RESEARCH_UPDATES = [
  {
    id: 1,
    journal: 'Nature Medicine',
    impactFactor: '82.9',
    title: 'Senolytic drugs reduce biomarkers of aging in humans',
    summary: 'First human trial showing clearance of senescent cells improves physical function and inflammatory markers.',
    month: '2025-01',
    url: '#',
  },
  {
    id: 2,
    journal: 'Cell',
    impactFactor: '64.5',
    title: 'Gut microbiome and longevity: meta-analysis of centenarian cohorts',
    summary: 'Consistent signatures of gut microbiota associated with extreme longevity across multiple populations.',
    month: '2025-01',
    url: '#',
  },
  {
    id: 3,
    journal: 'Lancet Healthy Longevity',
    impactFactor: '19.2',
    title: 'Intermittent fasting and cardiovascular outcomes: 5-year follow-up',
    summary: 'Time-restricted eating linked to lower incidence of major cardiovascular events in observational cohort.',
    month: '2024-12',
    url: '#',
  },
  {
    id: 4,
    journal: 'Science',
    impactFactor: '56.9',
    title: 'NAD+ precursors and muscle function in older adults',
    summary: 'Randomized trial of NR supplementation on mitochondrial function and physical performance.',
    month: '2024-12',
    url: '#',
  },
  {
    id: 5,
    journal: 'Aging Cell',
    impactFactor: '11.0',
    title: 'Epigenetic clocks and all-cause mortality prediction',
    summary: 'Comparison of second-generation clocks in large prospective cohorts.',
    month: '2024-12',
    url: '#',
  },
  {
    id: 6,
    journal: 'Nature Aging',
    impactFactor: '16.6',
    title: 'Rapamycin and immune function in healthy elderly',
    summary: 'Low-dose rapamycin improves vaccine response and reduces infection in older adults.',
    month: '2024-11',
    url: '#',
  },
]

export function getMonthLabel(monthStr) {
  const [y, m] = monthStr.split('-')
  const months = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return `${y}年${months[Number(m)]}`
}
