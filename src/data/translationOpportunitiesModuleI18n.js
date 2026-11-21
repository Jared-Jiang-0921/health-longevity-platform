/**
 * 「转化应用机遇」模块：受众、定位、栏目与商业化方向（中英）
 */
const COPY = {
  zh: {
    title: '转化应用机遇',
    audience:
      '面向创业者、投资人、研究者与企业团队：把前沿长寿与健康研究「翻译」为可评估的商业机会，而非只做泛科普。',
    core:
      '本模块强调「研究—产品—市场」链条：从论文、指南与临床需求中提炼可落地的技术、产品与服务形态，并提示监管、证据与获客等关键风险。',
    columnsTitle: '建议栏目（示例规划）',
    colColumn: '栏目',
    colContent: '内容',
    columnRows: [
      { column: '长寿产业趋势', content: '健康管理、银发经济、精准营养、慢病管理等赛道扫描与判断框架' },
      { column: '技术转化雷达', content: '新检测、新靶点、新产品、新服务等可转化信号与跟进要点' },
      { column: '商业模式拆解', content: '如 DTC 检测、会员制健康管理、AI 健康助手、内容电商等模式的结构与适用边界' },
      { column: '产品机会库', content: '从论文、指南与临床需求中沉淀可验证的产品假设与差异化切口' },
      { column: '创业风险提示', content: '监管与注册路径、证据不足、获客与转化成本、医疗与广告合规等' },
    ],
    monetizationTitle: '未来可延伸的商业化形态（规划）',
    monetizationBody:
      '在行业认知与信任积累后，可逐步延伸为：行业报告与数据产品、付费会员社群、定向咨询与路演辅导、企业定制研究服务等；具体产品与定价以独立页面及协议为准。',
    assetsNote:
      '下方资料区支持管理员上传音频、视频、文档与图片，可按上表栏目做分类沉淀；对外内容仍须遵守广告法、医疗宣传及证券信息等相关合规要求。',
  },
  en: {
    title: 'Translation & Commercialization',
    audience:
      'For founders, investors, researchers, and enterprise teams: translate frontier longevity and health research into assessable commercial opportunities—not generic science popularization alone.',
    core:
      'We focus on the research → product → market chain: extract actionable tech, product, and service shapes from papers, guidelines, and clinical needs, while flagging regulatory, evidence, and go-to-market risks.',
    columnsTitle: 'Suggested columns (planning sample)',
    colColumn: 'Column',
    colContent: 'Focus',
    columnRows: [
      { column: 'Industry trends', content: 'Health management, silver economy, precision nutrition, chronic-care tracks—frameworks to scan and judge.' },
      { column: 'Tech transfer radar', content: 'New assays, targets, products, and services—signals and follow-up prompts.' },
      { column: 'Business model teardowns', content: 'DTC testing, membership health programs, AI health copilots, content-commerce—structure and fit.' },
      { column: 'Product opportunity bank', content: 'Testable product hypotheses and differentiation wedges from literature and needs.' },
      { column: 'Startup risk notes', content: 'Regulatory paths, evidence gaps, CAC/LTV realities, medical and marketing compliance.' },
    ],
    monetizationTitle: 'Planned commercial extensions',
    monetizationBody:
      'After trust and audience depth grow: industry reports, paid communities, advisory and pitch coaching, bespoke corporate research—pricing and terms on dedicated pages and contracts.',
    assetsNote:
      'Admins can upload audio, video, documents, and images below, tagged to the columns above; all public-facing material must follow advertising, medical-claims, and securities rules where applicable.',
  },
}

export function getTranslationOpportunitiesModuleCopy(lang) {
  const key = lang === 'en' ? lang : 'zh'
  return COPY[key] || COPY.zh
}
