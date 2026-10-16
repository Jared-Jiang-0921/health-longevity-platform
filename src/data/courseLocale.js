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
  ar: {
    basics: 'أساسيات طول العمر',
    nutrition: 'التغذية',
    exercise: 'الحركة واللياقة',
    sleep: 'النوم والتعافي',
    stress: 'إدارة الضغط',
    chronic: 'الوقاية من الأمراض المزمنة',
    immunity: 'صحة المناعة',
    hormone: 'توازن الهرمونات',
    mental: 'الصحة النفسية',
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
  ar: {
    '1 周': 'أسبوع',
    '2 周': 'أسبوعان',
    '3 周': '3 أسابيع',
    '4 周': '4 أسابيع',
    '5 周': '5 أسابيع',
    '6 周': '6 أسابيع',
    '视频系列': 'سلسلة فيديو',
  },
}

const LEVEL = {
  en: { '初级': 'Beginner', '中级': 'Intermediate' },
  ar: { '初级': 'مبتدئ', '中级': 'متوسط' },
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
  ar: {
    13: {
      title: 'أساسيات طول العمر',
      desc: 'إطار أول لعلم طول العمر، لمن يبدأ في هذا الموضوع.',
      content: 'الأفكار الأساسية، وعوامل الخطر، وخطوات يومية، وطريقة لمراجعة التقدّم.',
    },
    1: {
      title: 'الأكل من أجل طول العمر',
      desc: 'كيف تتكامل المغذيات، والأكل المضاد للالتهاب، وأنماط الغذاء المرتبطة بطول العمر.',
      content: 'المغذيات الكبرى والصغرى، ونمط البحر المتوسط والمناطق الزرقاء، والأطعمة المضادة للالتهاب، وأمثلة قوائم.',
    },
    2: {
      title: 'مدخل إلى الصيام المتقطع',
      desc: 'كيف يعمل الصيام، وكيف تجرّبه، وما الذي تنتبه إليه.',
      content: 'نمطا 16:8 و5:2، وتغيّر الأيض أثناء الصيام، ومن لا يناسبه هذا النمط.',
    },
    3: {
      title: 'أساسيات تدريب القوة',
      desc: 'تدريب مقاومة من البداية، للقوة والأيض.',
      content: 'عرض الحركات، وترتيب الخطة، والزيادة التدريجية، والسلامة.',
    },
    4: {
      title: 'القلب والرئتان واللياقة',
      desc: 'التدريب المتقطع والجري الخفيف وطرق رفع لياقة القلب والرئتين.',
      content: 'مناطق الشدة، والتدريب المتقطع مقابل الثابت، ومتابعة النبض، والتعافي.',
    },
    5: {
      title: 'علم النوم والممارسة',
      desc: 'بيئة النوم، وموعد النوم، وجودة النوم.',
      content: 'دورات النوم، والضوء والميلاتونين، وعادات النوم، وطرق التهدئة.',
    },
    6: {
      title: 'تدريب التعافي',
      desc: 'الإطالة والتدليك والتعافي النشط.',
      content: 'الإطالة الديناميكية، وأسطوانة الفوم، والحرارة والبرودة، وخطة يوم الراحة.',
    },
    7: {
      title: 'اليقظة لتخفيف الضغط',
      desc: 'التأمل والتنفس وأساس تنظيم المشاعر.',
      content: 'تمرين اليقظة، والتنفس البطني، ومسح الجسم، ومهارات يومية لتخفيف الضغط.',
    },
    8: {
      title: 'الطاقة والوقت',
      desc: 'كيف تضع العمل حيث تكون طاقتك.',
      content: 'منحنى الطاقة، وطريقة بومودورو، والعمل العميق، وإيقاع الراحة.',
    },
    9: {
      title: 'صحة القلب والأوعية',
      desc: 'متابعة ضغط الدم والدهون والسكر والعمل عليها.',
      content: 'عوامل الخطر، وخطوات أسلوب الحياة، وقراءة المقاييس الشائعة، ومتى تراجع طبيبًا.',
    },
    10: {
      title: 'العظام والمفاصل',
      desc: 'الوقاية من هشاشة العظام والحفاظ على عمل المفاصل.',
      content: 'الكالسيوم وفيتامين د، والتمرين الحامل للوزن، ومدى حركة المفصل، والوقاية من الإصابة.',
    },
    14: {
      title: 'جهاز المناعة',
      desc: 'كيف تعمل المناعة، وأسلوب الحياة، واحتياطات العدوى اليومية.',
      content: 'أساس المناعة، وعلاقة الغذاء والنوم، والاحتياطات اليومية، ومتى تطلب الرعاية. هذا تثقيف عام وليس نصيحة طبية شخصية.',
    },
    15: {
      title: 'اللقاحات والصحة الموسمية',
      desc: 'شرح اللقاحات، والالتباسات الشائعة، والعناية الذاتية الموسمية.',
      content: 'كيف تساعد اللقاحات على بناء ذاكرة مناعية، والأنواع الشائعة، وسؤال مختص قبل التطعيم، والعناية في موسم الإنفلونزا.',
    },
    11: {
      title: 'الصحة المعرفية',
      desc: 'الذاكرة والانتباه والاحتياطي المعرفي.',
      content: 'نظرية الاحتياطي المعرفي، واستراتيجيات الذاكرة، وتدريب الانتباه، والأنشطة المحفّزة.',
    },
    12: {
      title: 'المشاعر والمرونة',
      desc: 'تسمية المشاعر وتنظيمها والبقاء على صلة بالآخرين.',
      content: 'نموذج ABC، وإعادة التأطير، والدعم الاجتماعي، والمرونة.',
    },
    16: {
      title: 'تدريب قوة لسبع دقائق لكبار السن',
      desc: 'مجموعة فيديوهات قصيرة لتدريب قوة مدته 7 دقائق لكبار السن. تُضاف الحلقات واحدة واحدة.',
      content: 'الفيديوهات القصيرة في هذه السلسلة تظهر في القائمة أدناه. يشاهد الأعضاء حلقة حلقة.',
    },
    17: {
      title: 'سبعة مبادئ لحرق الدهون',
      desc: 'شرح ومقاطع متابعة لمبادئ تدريب حرق الدهون.',
      content: 'كل فيديو مبدأ واحد أو حصة تدريب واحدة.',
    },
    18: {
      title: 'مدخل إلى توازن الهرمونات',
      desc: 'علاقة الهرمونات بالأيض والنوم والضغط، مع نقاط أسلوب حياة يمكن ممارستها. يمكن إضافة الفيديو حلقة حلقة.',
      content: 'الفيديوهات القصيرة في هذه السلسلة تظهر في القائمة أدناه. هذا تثقيف صحي وليس تشخيصًا أو علاجًا.',
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
  ar: {
    '长寿科学导论': {
      title: 'مدخل إلى علم طول العمر',
      content: 'يُفهم طول العمر من الوراثة وأسلوب الحياة والبيئة. هذا الدرس يضع هذا الإطار.',
    },
    '健康长寿三大支柱': { title: 'ركائز الصحة وطول العمر الثلاث' },
    '长寿饮食概述': { title: 'نظرة على حمية طول العمر' },
    '宏量与微量营养素': {
      title: 'المغذيات الكبرى والصغرى',
      content: 'البروتين والكربوهيدرات والدهون مغذيات كبرى. الفيتامينات والمعادن مغذيات صغرى. التوازن أساس حمية طول العمر.',
    },
    '抗炎饮食实操': { title: 'الأكل المضاد للالتهاب عمليًا' },
    '蓝区饮食模式': {
      title: 'أنماط أكل المناطق الزرقاء',
      content: 'أغلبها نبات، وبعض البقول، وقليل من اللحم الأحمر، وطعام قريب من صورته الطبيعية.',
    },
    '断食机制简述': {
      title: 'كيف يعمل الصيام',
      content: 'يطيل الصيام المتقطع وقت الامتناع عن الطعام. يُذكر في سياق الالتهام الذاتي والأيض. الأنماط الشائعة: 16:8 و5:2 والصيام يومًا بعد يوم.',
    },
    '16:8 实操指南': { title: 'دليل عملي لنمط 16:8' },
    '基础动作示范': { title: 'عرض الحركات الأساسية' },
    '训练计划编排': {
      title: 'بناء خطة التدريب',
      content: 'نحو 2–3 جلسات في الأسبوع، 45–60 دقيقة لكل جلسة. الزيادة التدريجية تعني رفع الحمل أو التكرار شيئًا فشيئًا.',
    },
    'HIIT 入门': { title: 'مدخل إلى التدريب المتقطع' },
    '心率区间与恢复': {
      title: 'مناطق النبض والتعافي',
      content: 'تقدير تقريبي لأقصى نبض هو 220 ناقص العمر. العمل الهوائي السهل نحو 60–70% من ذلك.',
    },
    '睡眠周期': {
      title: 'دورات النوم',
      content: 'الدورة نحو 90 دقيقة وتشمل النوم الخفيف والعميق وحركة العين السريعة. ثبّت الموعد وقلّل الضوء الأزرق قبل النوم.',
    },
    '睡眠环境优化': { title: 'تهيئة بيئة النوم' },
    '拉伸与泡沫轴': { title: 'الإطالة وأسطوانة الفوم' },
    '正念冥想入门': {
      title: 'البدء في تأمل اليقظة',
      content: 'ضع الانتباه على النفس. إذا ظهر خاطر، أعد الانتباه بلطف. خمس إلى عشر دقائق يوميًا تكفي للبدء.',
    },
    '身体扫描练习': { title: 'تمرين مسح الجسم' },
    '精力曲线': {
      title: 'منحنى الطاقة',
      content: 'كثير من الناس طاقتهم أعلى صباحًا وأقل بعد الظهر. ضع العمل المهم عند القمة.',
    },
    '心血管风险因素': {
      title: 'عوامل خطر القلب والأوعية',
      content: 'ضغط الدم والدهون والسكر والتدخين والبدانة. تغيير أسلوب الحياة هو لب الوقاية.',
    },
    '监测与就医': { title: 'المتابعة ومتى تطلب الرعاية' },
    '骨骼健康': {
      title: 'صحة العظام',
      content: 'الكالسيوم وفيتامين د، والتمرين الحامل للوزن، وتجنّب التبغ والإفراط في الكحول.',
    },
    '记忆策略': { title: 'استراتيجيات الذاكرة' },
    '认知刺激': {
      title: 'التنشيط المعرفي',
      content: 'تعلّم مهارة، ولقاء الناس، والقراءة يمكن أن تضيف إلى الاحتياطي المعرفي.',
    },
    '情绪 ABC 模型': {
      title: 'نموذج ABC للمشاعر',
      content: 'A الحدث، وB الاعتقاد، وC الشعور. تغيير B يمكن أن يغيّر C.',
    },
    '心理韧性练习': { title: 'تمرين المرونة' },
    '免疫系统概览': {
      title: 'نظرة على جهاز المناعة',
      content: 'تعمل المناعة الفطرية والتكيفية معًا: حاجز الجلد والأغشية، والخلايا البلعمية، والأجسام المضادة، والذاكرة المناعية. النوم المنتظم والغذاء المتوازن يدعمان استقرار المناعة. حالة المناعة لدى شخص بعينه يقيّمها الطبيب.',
    },
    '作息、营养与免疫': { title: 'النوم والتغذية والمناعة' },
    '常见感染与日常防护': {
      title: 'العدوى الشائعة والوقاية اليومية',
      content: 'نظافة اليدين، وآداب السعال، وسلامة الغذاء، وصحة السفر. الحمى العالية المستمرة أو ضيق النفس أو تغيّر الوعي تحتاج رعاية عاجلة. هذا تثقيف وليس تشخيصًا.',
    },
    '疫苗知识入门': { title: 'مدخل إلى اللقاحات' },
  },
}

function localeKey(lang) {
  return lang === 'en' || lang === 'ar' ? lang : 'zh'
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
