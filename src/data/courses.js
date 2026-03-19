import { ossVideoUrl } from './ossVideos'

export const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'aging', label: '衰老与抗衰老' },
  { id: 'clinic', label: '长寿医学和运营' },
  { id: 'nutrition', label: '营养与饮食' },
  { id: 'exercise', label: '运动与体能' },
  { id: 'sleep', label: '睡眠与恢复' },
  { id: 'stress', label: '压力管理' },
  { id: 'chronic', label: '慢性病预防' },
  { id: 'mental', label: '心理健康' },
  { id: 'immunity', label: '免疫力管理' },
  { id: 'hormone', label: '激素平衡管理' },
  { id: 'endocrine', label: '内分泌平衡管理' },
  { id: 'energy', label: '精力管理' },
]

// 课程模块：type: 'video' | 'document', video 用 embedUrl 占位，document 用 content
const courseModules = {
  1: [
    { type: 'video', title: '长寿饮食概述', duration: '12:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { type: 'document', title: '宏量与微量营养素', content: '宏量营养素包括蛋白质、碳水、脂肪，微量营养素包括维生素与矿物质。平衡摄入是长寿饮食的基础。' },
    { type: 'video', title: '抗炎饮食实操', duration: '18:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { type: 'document', title: '蓝区饮食模式', content: '蓝区居民饮食特点：以植物为主、适量豆类、少量红肉、天然食物为主。' },
  ],
  2: [
    { type: 'document', title: '断食机制简述', content: '间歇性断食通过延长空腹时间，促进自噬、改善代谢。常见模式：16:8、5:2、隔日断食。' },
    { type: 'video', title: '16:8 实操指南', duration: '15:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ],
  3: [
    { type: 'video', title: '基础动作示范', duration: '20:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { type: 'document', title: '训练计划编排', content: '建议每周 2–3 次，每次 45–60 分钟。渐进超负荷：逐步增加重量或次数。' },
  ],
  4: [{ type: 'video', title: 'HIIT 入门', duration: '10:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }, { type: 'document', title: '心率区间与恢复', content: '最大心率约 220 减年龄。有氧区约 60–70% 最大心率。' }],
  5: [{ type: 'document', title: '睡眠周期', content: '每周期约 90 分钟，含浅睡、深睡、REM。建议固定作息，睡前避免蓝光。' }, { type: 'video', title: '睡眠环境优化', duration: '8:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
  6: [{ type: 'video', title: '拉伸与泡沫轴', duration: '15:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
  7: [{ type: 'document', title: '正念冥想入门', content: '关注呼吸，念头出现时温和带回。每天 5–10 分钟即可起步。' }, { type: 'video', title: '身体扫描练习', duration: '12:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
  8: [{ type: 'document', title: '精力曲线', content: '多数人上午精力较高，午后下降。重要任务安排在精力峰值。' }],
  9: [{ type: 'document', title: '心血管风险因素', content: '血压、血脂、血糖、吸烟、肥胖等。生活方式干预是预防核心。' }, { type: 'video', title: '监测与就医', duration: '10:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
  10: [{ type: 'document', title: '骨骼健康', content: '钙与维生素 D、负重运动、避免烟酒。' }],
  11: [{ type: 'video', title: '记忆策略', duration: '14:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }, { type: 'document', title: '认知刺激', content: '学习新技能、社交、阅读等可增强认知储备。' }],
  12: [{ type: 'document', title: '情绪 ABC 模型', content: 'A 事件 → B 信念 → C 情绪。改变 B 可调节 C。' }, { type: 'video', title: '心理韧性练习', duration: '11:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }],
  13: [
    { type: 'video', title: '免疫系统与长寿概述', duration: '16:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { type: 'document', title: '天然免疫与获得性免疫', content: '区分先天免疫与获得性免疫，理解免疫记忆与慢性炎症在衰老中的作用。' },
    { type: 'document', title: '免疫力管理的循证策略', content: '睡眠、运动、营养与压力管理如何共同影响免疫功能，以及疫苗与高危人群管理要点。' },
  ],
  14: [
    { type: 'video', title: '性激素与代谢健康', duration: '18:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { type: 'document', title: '雌激素、睾酮与胰岛素', content: '概览主要激素在体重、情绪、骨骼与心血管中的作用，强调不可自行用药调整激素。' },
    { type: 'document', title: '生活方式与激素平衡', content: '睡眠节律、体脂分布、阻力训练与压力管理如何协同改善激素环境。' },
  ],
  15: [
    { type: 'video', title: '内分泌系统全景', duration: '20:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { type: 'document', title: '甲状腺、肾上腺与血糖调控', content: '从整体角度理解甲状腺功能、应激轴与糖脂代谢，识别需就医的高危信号。' },
    { type: 'document', title: '内分泌平衡的日常管理', content: '围绕作息、饮食结构与体重管理，建立面向内分泌健康的长期策略。' },
  ],
  16: [
    { type: 'video', title: '高级精力管理框架', duration: '15:00', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { type: 'document', title: '多维精力：体力、注意力与情绪', content: '区分不同维度的精力来源，识别个人高能时段与消耗型活动。' },
    { type: 'document', title: '精力周期与高效工作设计', content: '结合昼夜节律与任务类型，编排一周与一天的高效工作—恢复节奏。' },
  ],
  17: [
    {
      type: 'video',
      title: 'AI测算餐饮热卡和营养成分需求分析',
      duration: '70:00',
      embedUrl: ossVideoUrl('20250915_AI测算餐饮热卡和营养成分需求分析.mp4'),
    },
    {
      type: 'document',
      title: 'AI测算热量课程要点',
      content:
        '本模块聚焦于 AI 在营养评估中的综合应用：首先介绍 AI 算法驱动的数字健康 App 如何完成热量与营养评估；其次通过健康餐饮 App 报告解析，帮助理解不同营养指标的含义；再进一步展示 ChatGPT 作为数字化营养师，在饮食建议生成与个体化指导中的潜力；结合克利夫兰诊所案例研究与糖尿病患者的饮食建议专题，深化对特殊人群营养管理的理解；最后以苹果公司在健康领域的战略分析为例，讨论科技企业如何布局 AI+健康生态。',
    },
  ],
  18: [
    {
      type: 'video',
      title: '长寿诊所介绍',
      duration: '70:00',
      embedUrl: ossVideoUrl('20250524_什么是长寿诊所，提供哪些服务，用户体验感.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '长寿诊所概述、健康长寿处方、健康长寿实现、长寿诊所启动等。',
    },
  ],
  19: [
    {
      type: 'video',
      title: '长寿科技发展趋势',
      duration: '60:00',
      embedUrl: ossVideoUrl('20250509 Phil Newman长寿科技最新发展趋势video1225451144.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '发展趋势与投资导向、衰老的预防和逆转技术等。',
    },
  ],
  20: [
    {
      type: 'video',
      title: '干细胞与外泌体疗法促进长寿',
      duration: '80:00',
      embedUrl: ossVideoUrl('20250125_Yuta Lee_干细胞与外泌体疗法促进长寿.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '干细胞疗法与外泌体疗法对比、干细胞及其产物外泌体在抗衰老领域前沿进展、干细胞和外泌体疗法的核心优势、质量控制的关键性等。',
    },
  ],
  21: [
    {
      type: 'video',
      title: '甲基化检测衰老进程',
      duration: '70:00',
      embedUrl: ossVideoUrl('20251229_长寿医学系列讲座一——甲基化检测衰老进程(1).mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '表观遗传学、衰老的非线性特征、测试衰老的最精准检测方式、甲基化时钟核心优势等。',
    },
  ],
  22: [
    {
      type: 'video',
      title: '脑光疗法可穿戴设备',
      duration: '70:00',
      embedUrl: ossVideoUrl('20250315_长寿医学讲座——脑光疗法可穿戴设备.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '光疗法技术、光与人体、光疗机制、光疗应用等。',
    },
  ],
  23: [
    {
      type: 'video',
      title: '长寿诊所检测方法交流',
      duration: '60:00',
      embedUrl: ossVideoUrl('20251019_长寿诊所检测方法交流.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '衰老逆转、衰老衡量、衰老数据、衰老检测产品等。',
    },
  ],
  24: [
    {
      type: 'video',
      title: '外泌体产品的安全性和有效性',
      duration: '80:00',
      embedUrl: ossVideoUrl('20251227 20-00-28.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '外泌体的来源与决策、外泌体的应用与质控等。',
    },
  ],
  25: [
    {
      type: 'video',
      title: '血浆置换疗法',
      duration: '60:00',
      embedUrl: ossVideoUrl('20260118 08-58-08.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '衰老机制简介、血浆置换疗法概述、血浆置换疗法应用（免疫性疾病、微塑料颗粒清除、高脂血症等）、检测问题等。',
    },
  ],
  26: [
    {
      type: 'video',
      title: '走进长寿医学诊所模式',
      duration: '80:00',
      embedUrl: ossVideoUrl('20250531_AYUN Walk-in Longevity Clinic model.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        'AYUN长寿医学诊所介绍、走进去看长寿医学诊所模式、中国老龄化挑战、长寿检测、长寿治疗、长寿教育等。',
    },
  ],
  27: [
    {
      type: 'video',
      title: '2025年长寿科技获奖项目讲解',
      duration: '80:00',
      embedUrl: ossVideoUrl('20250517_XPRIZE长寿科技获奖项目讲解.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '长寿科技项目关注的领域、推荐的长寿科技等。',
    },
  ],
  28: [
    {
      type: 'video',
      title: '社区医生长寿诊所的经验和教训',
      duration: '80:00',
      embedUrl: ossVideoUrl('20250405_新加坡模式二——社区医生长寿诊所的经验和教训.mp4'),
    },
    {
      type: 'document',
      title: '课程要点',
      content:
        '长寿诊所的设立（医生的经历和背景、长寿医学理论、目标和愿景、创立和运营、外观和内部环境等）、长寿诊所的经验和教训（现有医疗体系挑战、监管挑战、整合医学的有效性和准确性、全面了解客户、个性化方案、标准程序和指南规范等）等。',
    },
  ],
}

export const COURSES = [
  { id: 1, title: '科学饮食与长寿', category: 'nutrition', duration: '4 周', level: '初级', accessLevel: 'free', desc: '掌握营养素搭配、抗炎饮食与长寿膳食模式。', content: '本课程涵盖宏量营养素与微量营养素、地中海饮食与蓝区饮食模式、抗炎食物选择及实操餐单设计。', modules: courseModules[1] },
  { id: 2, title: '间歇性断食入门', category: 'nutrition', duration: '2 周', level: '初级', accessLevel: 'standard', desc: '了解断食机制、实操方法与注意事项。', content: '介绍 16:8、5:2 等断食方式，断食期间代谢变化，以及适合人群与禁忌症。', modules: courseModules[2] },
  { id: 3, title: '力量训练基础', category: 'exercise', duration: '6 周', level: '初级', accessLevel: 'free', desc: '从零开始的抗阻训练，提升肌力与代谢。', content: '基础动作示范、训练计划编排、渐进超负荷原则及安全注意事项。', modules: courseModules[3] },
  { id: 4, title: '有氧与心肺健康', category: 'exercise', duration: '4 周', level: '初级', accessLevel: 'standard', desc: 'HIIT、慢跑与心肺功能提升技巧。', content: '有氧强度划分、HIIT 与稳态有氧安排、心率监测与恢复评估。', modules: courseModules[4] },
  { id: 5, title: '睡眠科学与实践', category: 'sleep', duration: '3 周', level: '初级', accessLevel: 'free', desc: '优化睡眠环境、作息与睡眠质量。', content: '睡眠周期、光照与褪黑素、睡眠卫生及助眠策略。', modules: courseModules[5] },
  { id: 6, title: '恢复与再生训练', category: 'sleep', duration: '2 周', level: '中级', accessLevel: 'standard', desc: '拉伸、按摩与主动恢复方法。', content: '动态拉伸、泡沫轴、冷热疗法及恢复日安排。', modules: courseModules[6] },
  { id: 7, title: '正念减压入门', category: 'stress', duration: '4 周', level: '初级', accessLevel: 'free', desc: '冥想、呼吸与情绪调节基础。', content: '正念冥想练习、腹式呼吸、身体扫描及日常减压技巧。', modules: courseModules[7] },
  { id: 8, title: '精力管理与时间规划', category: 'energy', duration: '2 周', level: '初级', accessLevel: 'standard', desc: '高效作息与能量分配策略。', content: '精力曲线识别、番茄工作法、深度工作与休息节奏。', modules: courseModules[8] },
  { id: 9, title: '心血管健康与预防', category: 'chronic', duration: '5 周', level: '中级', accessLevel: 'standard', desc: '血压、血脂、血糖的监测与干预。', content: '心血管风险因素、生活方式干预、监测指标解读及就医指征。', modules: courseModules[9] },
  { id: 10, title: '骨骼与关节保养', category: 'chronic', duration: '4 周', level: '初级', accessLevel: 'free', desc: '骨质疏松预防与关节功能维护。', content: '钙与维生素 D、负重运动、关节活动度训练与损伤预防。', modules: courseModules[10] },
  { id: 11, title: '认知健康与脑力训练', category: 'mental', duration: '6 周', level: '中级', accessLevel: 'standard', desc: '记忆力、专注力与认知储备提升。', content: '认知储备理论、记忆策略、注意力训练及认知刺激活动。', modules: courseModules[11] },
  { id: 12, title: '情绪与心理韧性', category: 'mental', duration: '4 周', level: '初级', accessLevel: 'free', desc: '情绪识别、调节与社会联结。', content: '情绪ABC模型、认知重构、社会支持与心理韧性培养。', modules: courseModules[12] },
  { id: 13, title: '免疫力管理与感染预防（高级）', category: 'immunity', duration: '6 周', level: '高级', accessLevel: 'premium', desc: '从免疫系统机制到生活方式干预的系统化免疫力管理课程。', content: '围绕衰老过程中的免疫功能变化，整合睡眠、营养、运动与疫苗策略，帮助高风险人群科学管理感染与炎症。', modules: courseModules[13] },
  { id: 14, title: '激素平衡与长寿健康（高级）', category: 'hormone', duration: '6 周', level: '高级', accessLevel: 'premium', desc: '关注性激素与代谢激素平衡，对接长寿与生活质量。', content: '系统梳理雌激素、睾酮、胰岛素与甲状腺激素在长寿中的作用边界，强调在医生指导下进行专业评估与治疗，课程仅用于健康教育。', modules: courseModules[14] },
  { id: 15, title: '内分泌整体平衡管理（高级）', category: 'endocrine', duration: '8 周', level: '高级', accessLevel: 'premium', desc: '以长寿视角审视内分泌系统的整体平衡。', content: '从甲状腺、肾上腺到糖脂代谢，结合体重管理与睡眠节律，帮助学习者建立循证的内分泌健康管理框架。', modules: courseModules[15] },
  { id: 16, title: '精力管理与高效表现（高级）', category: 'energy', duration: '4 周', level: '高级', accessLevel: 'premium', desc: '面向高责任、高压力人群的精力与表现优化课程。', content: '在基础精力管理的基础上，进一步引入多维精力模型、任务分层与恢复策略，帮助在不透支健康的前提下提升长期表现。', modules: courseModules[16] },
  {
    id: 17,
    title: 'AI测算热量与营养需求分析',
    category: 'nutrition',
    duration: '4 周',
    level: '高级',
    accessLevel: 'premium',
    desc: '系统学习如何利用 AI 工具评估餐饮热量与营养成分，并应用于慢病与特殊人群营养管理。',
    content:
      '课程围绕一个 70 分钟的核心模块展开，内容涵盖：AI 算法驱动的数字健康 App 评估流程、健康餐饮 App 报告解析方法、ChatGPT 作为数字化营养师的实用场景、克利夫兰诊所相关案例以及糖尿病患者饮食建议专题，并延伸至苹果公司在健康领域的战略分析，帮助学习者从技术、临床应用到产业布局多维度理解 AI + 营养。',
    modules: courseModules[17],
  },
  {
    id: 18,
    title: '长寿诊所介绍',
    category: 'all',
    duration: '约 1 小时',
    level: '初级',
    accessLevel: 'free',
    desc: '长寿诊所概述、健康长寿处方、健康长寿实现、长寿诊所启动等。',
    content:
      '介绍长寿诊所的概念、提供的服务类型、健康长寿处方与实现路径，以及长寿诊所的启动与用户体验。',
    modules: courseModules[18],
  },
  {
    id: 19,
    title: '长寿科技发展趋势',
    category: 'all',
    duration: '约 1 小时',
    level: '初级',
    accessLevel: 'free',
    desc: '发展趋势与投资导向、衰老的预防和逆转技术等。',
    content:
      '介绍长寿科技发展趋势与投资导向、衰老的预防和逆转技术等前沿内容。',
    modules: courseModules[19],
  },
  {
    id: 20,
    title: '干细胞与外泌体疗法促进长寿',
    category: 'all',
    duration: '约 80 分钟',
    level: '高级',
    accessLevel: 'premium',
    desc: '干细胞疗法与外泌体疗法对比、干细胞及其产物外泌体在抗衰老领域前沿进展、核心优势与质量控制。',
    content:
      '干细胞疗法与外泌体疗法对比、干细胞及其产物外泌体在抗衰老领域前沿进展、干细胞和外泌体疗法的核心优势、质量控制的关键性等。',
    modules: courseModules[20],
  },
  {
    id: 21,
    title: '甲基化检测衰老进程',
    category: 'aging',
    duration: '约 70 分钟',
    level: '高级',
    accessLevel: 'premium',
    desc: '表观遗传学、衰老的非线性特征、测试衰老的最精准检测方式、甲基化时钟核心优势等。',
    content:
      '介绍表观遗传学基础、衰老的非线性特征、测试衰老的最精准检测方式、甲基化时钟核心优势等。',
    modules: courseModules[21],
  },
  {
    id: 22,
    title: '脑光疗法可穿戴设备',
    category: 'aging',
    duration: '约 70 分钟',
    level: '中级',
    accessLevel: 'standard',
    desc: '光疗法技术、光与人体、光疗机制、光疗应用等。',
    content:
      '介绍光疗法技术、光与人体的关系、光疗机制与光疗应用等。',
    modules: courseModules[22],
  },
  {
    id: 23,
    title: '长寿诊所检测方法交流',
    category: 'aging',
    duration: '约 60 分钟',
    level: '初级',
    accessLevel: 'free',
    desc: '衰老逆转、衰老衡量、衰老数据、衰老检测产品等。',
    content:
      '介绍衰老逆转、衰老衡量、衰老数据、衰老检测产品等。',
    modules: courseModules[23],
  },
  {
    id: 24,
    title: '外泌体产品的安全性和有效性',
    category: 'aging',
    duration: '约 80 分钟',
    level: '高级',
    accessLevel: 'premium',
    desc: '外泌体的来源与决策、外泌体的应用与质控等。',
    content:
      '介绍外泌体的来源与决策、外泌体的应用与质控等。',
    modules: courseModules[24],
  },
  {
    id: 25,
    title: '血浆置换疗法',
    category: 'aging',
    duration: '约 60 分钟',
    level: '高级',
    accessLevel: 'premium',
    desc: '衰老机制简介、血浆置换疗法概述、血浆置换疗法应用（免疫性疾病、微塑料颗粒清除、高脂血症等）、检测问题等。',
    content:
      '介绍衰老机制、血浆置换疗法概述、血浆置换疗法在免疫性疾病、微塑料颗粒清除、高脂血症等方面的应用及检测问题。',
    modules: courseModules[25],
  },
  {
    id: 26,
    title: '走进长寿医学诊所模式',
    category: 'aging',
    duration: '约 80 分钟',
    level: '初级',
    accessLevel: 'free',
    desc: 'AYUN长寿医学诊所介绍、走进去看长寿医学诊所模式、中国老龄化挑战、长寿检测、长寿治疗、长寿教育等。',
    content:
      '介绍AYUN长寿医学诊所、长寿医学诊所模式、中国老龄化挑战、长寿检测、长寿治疗、长寿教育等。',
    modules: courseModules[26],
  },
  {
    id: 27,
    title: '2025年长寿科技获奖项目讲解',
    category: 'aging',
    duration: '约 80 分钟',
    level: '初级',
    accessLevel: 'free',
    desc: '长寿科技项目关注的领域、推荐的长寿科技等。',
    content:
      '介绍长寿科技项目关注的领域、推荐的长寿科技等。',
    modules: courseModules[27],
  },
  {
    id: 28,
    title: '社区医生长寿诊所的经验和教训',
    category: 'clinic',
    duration: '约 80 分钟',
    level: '高级',
    accessLevel: 'premium',
    desc: '长寿诊所的设立、运营及经验教训，涵盖医疗体系挑战、监管、整合医学、个性化方案等。',
    content:
      '长寿诊所的设立（医生的经历和背景、长寿医学理论、目标和愿景、创立和运营、外观和内部环境等）、长寿诊所的经验和教训（现有医疗体系挑战、监管挑战、整合医学的有效性和准确性、全面了解客户、个性化方案、标准程序和指南规范等）等。',
    modules: courseModules[28],
  },
]

export function getCourseById(id) {
  return COURSES.find((c) => c.id === Number(id))
}
