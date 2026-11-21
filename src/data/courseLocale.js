import { CATEGORIES } from './courses.js'

const CATEGORY_LABELS = {
  en: {
    basics: 'Longevity basics',
    nutrition: 'Nutrition',
    exercise: 'Exercise',
    sleep: 'Sleep and recovery',
    stress: 'Stress',
    chronic: 'Chronic-disease prevention',
    immunity: 'Immune health',
    hormone: 'Hormone balance',
    mental: 'Mental health',
  },
}

const DURATION = {
  en: {
    '1 周': '1 week',
    '2 周': '2 weeks',
    '3 周': '3 weeks',
    '4 周': '4 weeks',
    '5 周': '5 weeks',
    '6 周': '6 weeks',
    '视频系列': 'Video series',
  },
}

const LEVEL = {
  en: { '初级': 'Beginner', '中级': 'Intermediate' },
}

const COURSE_TEXT = {
  en: {
    13: {
      title: 'Longevity basics',
      desc: 'A first framework for longevity science, for people new to the topic.',
      content: 'Core ideas, risk factors, everyday steps, and how to check progress over time.',
    },
    1: {
      title: 'Eating for longevity',
      desc: 'How nutrients fit together, anti-inflammatory eating, and longevity dietary patterns.',
      content: 'Macronutrients and micronutrients, Mediterranean and Blue Zone patterns, anti-inflammatory foods, and sample menus.',
    },
    2: {
      title: 'Introduction to intermittent fasting',
      desc: 'How fasting works, how to try it, and what to watch for.',
      content: '16:8 and 5:2, metabolic changes while fasting, and who these patterns do not suit.',
    },
    3: {
      title: 'Strength training basics',
      desc: 'Resistance training from the start, for strength and metabolism.',
      content: 'Movement demos, how to lay out a plan, progressive overload, and safety.',
    },
    4: {
      title: 'Cardio and heart-lung fitness',
      desc: 'HIIT, easy running, and ways to build cardiorespiratory fitness.',
      content: 'Aerobic zones, HIIT versus steady cardio, heart-rate checks, and recovery.',
    },
    5: {
      title: 'Sleep science and practice',
      desc: 'Sleep setting, schedule, and sleep quality.',
      content: 'Sleep cycles, light and melatonin, sleep habits, and ways to wind down.',
    },
    6: {
      title: 'Recovery training',
      desc: 'Stretching, massage, and active recovery.',
      content: 'Dynamic stretching, foam rolling, heat and cold, and rest-day plans.',
    },
    7: {
      title: 'Mindfulness for stress',
      desc: 'Meditation, breathing, and the basics of regulating emotion.',
      content: 'Mindfulness practice, belly breathing, a body scan, and everyday stress skills.',
    },
    8: {
      title: 'Energy and time',
      desc: 'How to place work against your energy.',
      content: 'Energy curves, Pomodoro, deep work, and a rhythm of rest.',
    },
    9: {
      title: 'Heart and vessel health',
      desc: 'Watching and working on blood pressure, lipids, and glucose.',
      content: 'Risk factors, lifestyle steps, how to read common measures, and when to see a clinician.',
    },
    10: {
      title: 'Bone and joint care',
      desc: 'Preventing osteoporosis and keeping joints working.',
      content: 'Calcium and vitamin D, weight-bearing exercise, joint range, and injury prevention.',
    },
    14: {
      title: 'The immune system',
      desc: 'How immunity works, lifestyle, and everyday infection precautions.',
      content: 'Immune basics, how nutrition and sleep relate, everyday precautions, and when to seek care. This is public education, not personal medical advice.',
    },
    15: {
      title: 'Vaccines and seasonal health',
      desc: 'How vaccines are explained, common mix-ups, and seasonal self-care.',
      content: 'How vaccines help build immune memory, common vaccine types, asking a professional before vaccination, and self-care in flu season.',
    },
    11: {
      title: 'Cognitive health',
      desc: 'Memory, attention, and cognitive reserve.',
      content: 'Cognitive reserve, memory strategies, attention practice, and stimulating activities.',
    },
    12: {
      title: 'Emotion and resilience',
      desc: 'Naming emotions, regulating them, and staying connected.',
      content: 'The ABC model, reframing, social support, and resilience.',
    },
    16: {
      title: '7-minute strength training for older adults',
      desc: 'A short-video collection of 7-minute strength sessions for older adults. Episodes are added one by one.',
      content: 'Short videos filed in this series appear in the list below. Members watch episode by episode.',
    },
    17: {
      title: 'Seven principles of fat loss',
      desc: 'Explanations and follow-along videos for fat-loss training principles.',
      content: 'Each video is one principle or one practice session.',
    },
    18: {
      title: 'Hormone balance basics',
      desc: 'How hormones relate to metabolism, sleep, and stress, plus lifestyle points that can be practiced. Videos can be added by episode.',
      content: 'Short videos filed in this series appear in the list below. This is health education, not a diagnosis or treatment.',
    },
  },
}

const MODULE_TEXT = {
  en: {
    '长寿科学导论': {
      title: 'Introduction to longevity science',
      content: 'Longevity is read through genes, lifestyle, and environment. This lesson sets up that frame.',
    },
    '健康长寿三大支柱': { title: 'Three pillars of healthy longevity' },
    '长寿饮食概述': { title: 'Overview of longevity diets' },
    '宏量与微量营养素': {
      title: 'Macronutrients and micronutrients',
      content: 'Protein, carbohydrate, and fat are macronutrients. Vitamins and minerals are micronutrients. Balance is the base of a longevity diet.',
    },
    '抗炎饮食实操': { title: 'Anti-inflammatory eating in practice' },
    '蓝区饮食模式': {
      title: 'Blue Zone eating patterns',
      content: 'Mostly plants, some beans, little red meat, and food close to its natural form.',
    },
    '断食机制简述': {
      title: 'How fasting works',
      content: 'Intermittent fasting lengthens the time without food. It is discussed for autophagy and metabolism. Common patterns are 16:8, 5:2, and alternate-day fasting.',
    },
    '16:8 实操指南': { title: 'A practical guide to 16:8' },
    '基础动作示范': { title: 'Basic movement demo' },
    '训练计划编排': {
      title: 'Building a training plan',
      content: 'About 2–3 sessions a week, 45–60 minutes each. Progressive overload means gradually adding load or repetitions.',
    },
    'HIIT 入门': { title: 'HIIT for beginners' },
    '心率区间与恢复': {
      title: 'Heart-rate zones and recovery',
      content: 'A rough maximum heart rate is 220 minus age. Easy aerobic work is about 60–70% of that.',
    },
    '睡眠周期': {
      title: 'Sleep cycles',
      content: 'A cycle is about 90 minutes and includes light sleep, deep sleep, and REM. Keep a steady schedule and limit blue light before bed.',
    },
    '睡眠环境优化': { title: 'Setting up the sleep environment' },
    '拉伸与泡沫轴': { title: 'Stretching and foam rolling' },
    '正念冥想入门': {
      title: 'Starting mindfulness meditation',
      content: 'Rest attention on the breath. When a thought appears, bring attention back gently. Five to ten minutes a day is enough to start.',
    },
    '身体扫描练习': { title: 'Body-scan practice' },
    '精力曲线': {
      title: 'The energy curve',
      content: 'Many people have more energy in the morning and less in the afternoon. Put important work at the peak.',
    },
    '心血管风险因素': {
      title: 'Cardiovascular risk factors',
      content: 'Blood pressure, lipids, glucose, smoking, and obesity. Lifestyle change is the core of prevention.',
    },
    '监测与就医': { title: 'Monitoring and when to seek care' },
    '骨骼健康': {
      title: 'Bone health',
      content: 'Calcium and vitamin D, weight-bearing exercise, and avoiding tobacco and excess alcohol.',
    },
    '记忆策略': { title: 'Memory strategies' },
    '认知刺激': {
      title: 'Cognitive stimulation',
      content: 'Learning a skill, seeing people, and reading can add to cognitive reserve.',
    },
    '情绪 ABC 模型': {
      title: 'The ABC model of emotion',
      content: 'A is the event, B the belief, C the feeling. Changing B can change C.',
    },
    '心理韧性练习': { title: 'Resilience practice' },
    '免疫系统概览': {
      title: 'Immune system overview',
      content: 'Innate and adaptive immunity work together: skin and mucosa, phagocytes, antibodies, and immune memory. Regular sleep and balanced food support immune steadiness. A clinician has to judge an individual immune status.',
    },
    '作息、营养与免疫': { title: 'Sleep, nutrition, and immunity' },
    '常见感染与日常防护': {
      title: 'Common infections and everyday precautions',
      content: 'Hand hygiene, respiratory etiquette, food safety, and travel health. Lasting high fever, trouble breathing, or a change in consciousness needs prompt care. This is education, not a diagnosis.',
    },
    '疫苗知识入门': { title: 'Vaccine basics' },
  },
}

function localeKey(lang) {
  return lang === 'en' ? lang : 'zh'
}

export function categoryDisplayLabel(categoryId, lang = 'zh') {
  const id = typeof categoryId === 'object' ? categoryId?.id : categoryId
  const cat = CATEGORIES.find((item) => item.id === id)
  if (!cat) return ''
  const key = localeKey(lang)
  if (key === 'zh') return cat.label
  return CATEGORY_LABELS[key]?.[id] || cat.label
}

export function courseDisplay(course, lang = 'zh') {
  if (!course) return { title: '', desc: '', content: '', duration: '', level: '' }
  const key = localeKey(lang)
  if (key === 'zh') {
    return {
      title: course.title || '',
      desc: course.desc || '',
      content: course.content || '',
      duration: course.duration || '',
      level: course.level || '',
    }
  }
  const pack = COURSE_TEXT[key]?.[course.id] || {}
  return {
    title: pack.title || course.title || '',
    desc: pack.desc || course.desc || '',
    content: pack.content || course.content || '',
    duration: DURATION[key]?.[course.duration] || course.duration || '',
    level: LEVEL[key]?.[course.level] || course.level || '',
  }
}

export function moduleDisplay(mod, lang = 'zh') {
  if (!mod) return { title: '', content: '' }
  const key = localeKey(lang)
  if (key === 'zh') return { title: mod.title || '', content: mod.content || '' }
  const pack = MODULE_TEXT[key]?.[mod.title] || {}
  return {
    title: pack.title || mod.title || '',
    content: pack.content || mod.content || '',
  }
}
