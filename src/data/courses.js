/**
 * 课程视频两种写法（二选一，视频课时至少填一种）：
 * - videoUrl：MP4 等直链，推荐阿里云 OSS 公开读地址，学习页用 <video> 播放。
 * - embedUrl：嵌入页（如 YouTube），学习页用 iframe。
 * 阿里云 OSS：请在控制台为该 Bucket 配置跨域 CORS，允许你的网站来源（如 https://xxx.vercel.app），
 * 否则浏览器可能拦截跨域视频请求导致无法播放。
 */

/** 占位示例（可全局替换为你的 OSS 根路径或逐条改 videoUrl） */
const DEMO_MP4 =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

export const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'nutrition', label: '营养与饮食' },
  { id: 'exercise', label: '运动与体能' },
  { id: 'sleep', label: '睡眠与恢复' },
  { id: 'stress', label: '压力管理' },
  { id: 'chronic', label: '慢性病预防' },
  { id: 'mental', label: '心理健康' },
]

// 课程模块：type: 'video' | 'document'；video 优先 videoUrl（MP4 直链），否则 embedUrl（嵌入页）
const courseModules = {
  1: [
    {
      type: 'video',
      title: '长寿饮食概述',
      duration: '12:00',
      // 将下方替换为你的阿里云 OSS 等 MP4 直链（需可公网访问且已配置 CORS）
      videoUrl: DEMO_MP4,
    },
    { type: 'document', title: '宏量与微量营养素', content: '宏量营养素包括蛋白质、碳水、脂肪，微量营养素包括维生素与矿物质。平衡摄入是长寿饮食的基础。' },
    {
      type: 'video',
      title: '抗炎饮食实操',
      duration: '18:00',
      videoUrl: DEMO_MP4,
    },
    { type: 'document', title: '蓝区饮食模式', content: '蓝区居民饮食特点：以植物为主、适量豆类、少量红肉、天然食物为主。' },
  ],
  2: [
    { type: 'document', title: '断食机制简述', content: '间歇性断食通过延长空腹时间，促进自噬、改善代谢。常见模式：16:8、5:2、隔日断食。' },
    { type: 'video', title: '16:8 实操指南', duration: '15:00', videoUrl: DEMO_MP4 },
  ],
  3: [
    { type: 'video', title: '基础动作示范', duration: '20:00', videoUrl: DEMO_MP4 },
    { type: 'document', title: '训练计划编排', content: '建议每周 2–3 次，每次 45–60 分钟。渐进超负荷：逐步增加重量或次数。' },
  ],
  4: [{ type: 'video', title: 'HIIT 入门', duration: '10:00', videoUrl: DEMO_MP4 }, { type: 'document', title: '心率区间与恢复', content: '最大心率约 220 减年龄。有氧区约 60–70% 最大心率。' }],
  5: [{ type: 'document', title: '睡眠周期', content: '每周期约 90 分钟，含浅睡、深睡、REM。建议固定作息，睡前避免蓝光。' }, { type: 'video', title: '睡眠环境优化', duration: '8:00', videoUrl: DEMO_MP4 }],
  6: [{ type: 'video', title: '拉伸与泡沫轴', duration: '15:00', videoUrl: DEMO_MP4 }],
  7: [{ type: 'document', title: '正念冥想入门', content: '关注呼吸，念头出现时温和带回。每天 5–10 分钟即可起步。' }, { type: 'video', title: '身体扫描练习', duration: '12:00', videoUrl: DEMO_MP4 }],
  8: [{ type: 'document', title: '精力曲线', content: '多数人上午精力较高，午后下降。重要任务安排在精力峰值。' }],
  9: [{ type: 'document', title: '心血管风险因素', content: '血压、血脂、血糖、吸烟、肥胖等。生活方式干预是预防核心。' }, { type: 'video', title: '监测与就医', duration: '10:00', videoUrl: DEMO_MP4 }],
  10: [{ type: 'document', title: '骨骼健康', content: '钙与维生素 D、负重运动、避免烟酒。' }],
  11: [{ type: 'video', title: '记忆策略', duration: '14:00', videoUrl: DEMO_MP4 }, { type: 'document', title: '认知刺激', content: '学习新技能、社交、阅读等可增强认知储备。' }],
  12: [{ type: 'document', title: '情绪 ABC 模型', content: 'A 事件 → B 信念 → C 情绪。改变 B 可调节 C。' }, { type: 'video', title: '心理韧性练习', duration: '11:00', videoUrl: DEMO_MP4 }],
}

export const COURSES = [
  // requiredMembership: 'free' | 'standard' | 'premium'
  // 不填默认按 free 处理。把目标课程改为 premium，即可限制为高级会员可学习。
  { id: 1, title: '科学饮食与长寿', category: 'nutrition', duration: '4 周', level: '初级', desc: '掌握营养素搭配、抗炎饮食与长寿膳食模式。', content: '本课程涵盖宏量营养素与微量营养素、地中海饮食与蓝区饮食模式、抗炎食物选择及实操餐单设计。', modules: courseModules[1] },
  { id: 2, title: '间歇性断食入门', category: 'nutrition', duration: '2 周', level: '初级', desc: '了解断食机制、实操方法与注意事项。', content: '介绍 16:8、5:2 等断食方式，断食期间代谢变化，以及适合人群与禁忌症。', modules: courseModules[2] },
  { id: 3, title: '力量训练基础', category: 'exercise', duration: '6 周', level: '初级', desc: '从零开始的抗阻训练，提升肌力与代谢。', content: '基础动作示范、训练计划编排、渐进超负荷原则及安全注意事项。', modules: courseModules[3] },
  { id: 4, title: '有氧与心肺健康', category: 'exercise', duration: '4 周', level: '初级', desc: 'HIIT、慢跑与心肺功能提升技巧。', content: '有氧强度划分、HIIT 与稳态有氧安排、心率监测与恢复评估。', modules: courseModules[4] },
  { id: 5, title: '睡眠科学与实践', category: 'sleep', duration: '3 周', level: '初级', desc: '优化睡眠环境、作息与睡眠质量。', content: '睡眠周期、光照与褪黑素、睡眠卫生及助眠策略。', modules: courseModules[5] },
  { id: 6, title: '恢复与再生训练', category: 'sleep', duration: '2 周', level: '中级', desc: '拉伸、按摩与主动恢复方法。', content: '动态拉伸、泡沫轴、冷热疗法及恢复日安排。', modules: courseModules[6] },
  { id: 7, title: '正念减压入门', category: 'stress', duration: '4 周', level: '初级', desc: '冥想、呼吸与情绪调节基础。', content: '正念冥想练习、腹式呼吸、身体扫描及日常减压技巧。', modules: courseModules[7] },
  { id: 8, title: '精力管理与时间规划', category: 'stress', duration: '2 周', level: '初级', desc: '高效作息与能量分配策略。', content: '精力曲线识别、番茄工作法、深度工作与休息节奏。', modules: courseModules[8] },
  { id: 9, title: '心血管健康与预防', category: 'chronic', duration: '5 周', level: '中级', desc: '血压、血脂、血糖的监测与干预。', content: '心血管风险因素、生活方式干预、监测指标解读及就医指征。', modules: courseModules[9] },
  { id: 10, title: '骨骼与关节保养', category: 'chronic', duration: '4 周', level: '初级', desc: '骨质疏松预防与关节功能维护。', content: '钙与维生素 D、负重运动、关节活动度训练与损伤预防。', modules: courseModules[10] },
  { id: 11, title: '认知健康与脑力训练', category: 'mental', duration: '6 周', level: '中级', desc: '记忆力、专注力与认知储备提升。', content: '认知储备理论、记忆策略、注意力训练及认知刺激活动。', modules: courseModules[11] },
  { id: 12, title: '情绪与心理韧性', category: 'mental', duration: '4 周', level: '初级', desc: '情绪识别、调节与社会联结。', content: '情绪ABC模型、认知重构、社会支持与心理韧性培养。', modules: courseModules[12] },
]

export function getCourseById(id) {
  return COURSES.find((c) => c.id === Number(id))
}
