/**
 * 体质识别教育摘要。依据中华中医药学会《中医体质分类与判定》（ZYYXH/T157-2009）的九种分类，
 * 用本站自己的句子写总体特征、常见表现和调养方向。不是个人体质判定，不开方、不写剂量。
 */
export const TCM_CONSTITUTION_SOURCE = {
  zh: '依据中华中医药学会《中医体质分类与判定》（ZYYXH/T157-2009）整理。这是九种体质的教育摘要，不是对你本人的体质结论。',
  en: 'Educational summary of the nine constitution types in the China Association of Chinese Medicine standard ZYYXH/T157-2009. This is not a personal constitution judgment.',
}

export const TCM_CONSTITUTIONS = [
  {
    id: 'balanced',
    name: { zh: '平和质', en: 'Balanced' },
    summary: {
      zh: '阴阳气血比较调和，是九种体质里的参照状态。',
      en: 'Qi, blood, yin, and yang are relatively balanced. This is the reference type among the nine.',
    },
    signs: {
      zh: '体态适中，面色润泽，睡眠和精力较稳，对寒热的耐受力比较好。',
      en: 'Moderate build, fresh complexion, fairly steady sleep and energy, and reasonable tolerance of cold and heat.',
    },
    care: {
      zh: '饮食有节，起居有常，劳逸结合。状态已经平稳时，不必为了进补而进补。',
      en: 'Regular meals, regular hours, and a balance of effort and rest. If you already feel steady, there is no need to add tonics for their own sake.',
    },
  },
  {
    id: 'qi-deficiency',
    name: { zh: '气虚质', en: 'Qi deficiency' },
    summary: {
      zh: '元气不足，容易疲乏，说话或活动后气不够用。',
      en: 'Vital qi is insufficient. Fatigue is common, and breath feels short after talking or activity.',
    },
    signs: {
      zh: '容易累，气短，自汗，声音偏低，活动后恢复慢。',
      en: 'Easy fatigue, shortness of breath, sweating without heavy exertion, a quiet voice, and slow recovery after activity.',
    },
    care: {
      zh: '少熬夜、少硬扛。饭食温和、好消化。运动选散步、八段锦这类轻度活动。持续气短或活动后明显喘，要去就医，不要靠进补硬撑。',
      en: 'Cut back on late nights and pushing through exhaustion. Eat gentle, easy-to-digest meals. Prefer walking or Baduanjin over hard training. Ongoing shortness of breath needs a clinician, not more tonics.',
    },
  },
  {
    id: 'yang-deficiency',
    name: { zh: '阳虚质', en: 'Yang deficiency' },
    summary: {
      zh: '阳气不足，身体偏怕冷。',
      en: 'Yang qi is insufficient, so the body tends to feel cold.',
    },
    signs: {
      zh: '畏寒，手足不温，喜欢热饮和保暖，精神容易不振。',
      en: 'Aversion to cold, cool hands and feet, a preference for warm drinks and extra clothing, and a tendency to feel listless.',
    },
    care: {
      zh: '注意保暖，少吃生冷，空调和冷饮不要过久。夏季也要避免长时间贪凉。',
      en: 'Keep warm, go easy on raw and cold food, and limit long stretches of air-conditioning or iced drinks. Avoid staying chilled for hours even in summer.',
    },
  },
  {
    id: 'yin-deficiency',
    name: { zh: '阴虚质', en: 'Yin deficiency' },
    summary: {
      zh: '阴液偏少，常见口干和手足心热。',
      en: 'Yin fluids run low. Dry mouth and warm palms and soles are typical.',
    },
    signs: {
      zh: '口燥咽干，手足心热，盗汗，睡眠偏浅，耐受炎热的能力较差。',
      en: 'Dry mouth and throat, warm palms and soles, night sweats, light sleep, and poor tolerance of heat.',
    },
    care: {
      zh: '少辛辣、少煎炸、少熬夜。饮食可以偏清淡、润一些。口干持续加重或伴有明显消瘦，要就医核对，不要只当成体质。',
      en: 'Fewer spicy and fried foods, and fewer late nights. Meals can be lighter and more moistening. Worsening dry mouth with clear weight loss needs a clinical check.',
    },
  },
  {
    id: 'phlegm-dampness',
    name: { zh: '痰湿质', en: 'Phlegm-dampness' },
    summary: {
      zh: '痰湿偏盛，体形和腹部容易显得壅滞。',
      en: 'Phlegm-dampness tends to accumulate, often showing as a heavier build and a full abdomen.',
    },
    signs: {
      zh: '体形偏胖，腹部肥满，口中发黏，舌苔偏腻，身体沉重感比较明显。',
      en: 'A heavier build, abdominal fullness, a sticky feeling in the mouth, a greasy tongue coating, and a marked sense of bodily heaviness.',
    },
    care: {
      zh: '少肥甘、少甜腻，饭量适中。把步行等活动放进每天的安排。胸部憋闷、喘或突然的严重困倦，按急症就医。',
      en: 'Ease up on rich, sweet, and greasy food, and keep portions moderate. Put walking or similar movement into the day. Chest tightness, wheezing, or sudden heavy drowsiness needs urgent care.',
    },
  },
  {
    id: 'damp-heat',
    name: { zh: '湿热质', en: 'Damp-heat' },
    summary: {
      zh: '湿热内蕴，面部和口腔容易有油腻、口苦一类表现。',
      en: 'Damp-heat stays inside. An oily face and a bitter taste in the mouth are common clues.',
    },
    signs: {
      zh: '面垢油光，口苦，口干，舌苔黄腻，身重，大便黏滞或气味较重。',
      en: 'An oily complexion, bitter or dry mouth, a yellow greasy tongue coating, bodily heaviness, and sticky or strong-smelling stools.',
    },
    care: {
      zh: '少酒，少辛辣油炸。环境尽量干爽，出汗后及时换干衣服。皮肤脓疱、黄疸或发热不退，要就医。',
      en: 'Less alcohol and less spicy, fried food. Keep the living space from staying damp, and change out of sweaty clothes. Pustules, jaundice, or a fever that does not settle needs a clinician.',
    },
  },
  {
    id: 'blood-stasis',
    name: { zh: '血瘀质', en: 'Blood stasis' },
    summary: {
      zh: '血行不畅，气色和局部刺痛比较常见。',
      en: 'Blood moves less freely. A dull complexion and localized pricking pain are common.',
    },
    signs: {
      zh: '肤色晦暗，容易出现瘀斑，局部刺痛、痛处相对固定，舌质偏暗或有瘀点。',
      en: 'A dull complexion, easy bruising, localized pricking pain that stays in one place, and a darker tongue or stasis spots.',
    },
    care: {
      zh: '避免久坐不动，安排规律的肢体活动。胸痛、一侧无力、言语不清、黑便或突发剧烈头痛，直接去急诊，不要在这里自行活血。',
      en: 'Avoid sitting still for long periods, and keep regular movement in the day. Chest pain, one-sided weakness, trouble speaking, black stools, or a sudden severe headache means the emergency department, not self-directed “blood moving.”',
    },
  },
  {
    id: 'qi-stagnation',
    name: { zh: '气郁质', en: 'Qi stagnation' },
    summary: {
      zh: '气机不畅，情绪容易堵在心里。',
      en: 'Qi does not move freely, and emotion tends to feel stuck.',
    },
    signs: {
      zh: '情绪抑郁，容易忧虑，胸胁胀闷，叹气后稍舒，睡眠易受情绪影响。',
      en: 'Low mood, a tendency to worry, fullness in the chest or flanks, slight relief after a sigh, and sleep that follows the mood.',
    },
    care: {
      zh: '保持白天活动和比较稳定的睡眠时间，把担心说给可信的人听。情绪持续低落、失去兴趣，或出现自伤的想法，要寻求专业帮助。',
      en: 'Keep some daytime activity and a fairly stable sleep schedule, and talk with someone you trust. Ongoing low mood, loss of interest, or thoughts of self-harm need professional help.',
    },
  },
  {
    id: 'special',
    name: { zh: '特禀质', en: 'Inherited special constitution' },
    summary: {
      zh: '先天禀赋特殊，过敏和某些先天异常表现归在这一类。',
      en: 'The inborn constitution is unusual. Allergies and some congenital features are grouped here.',
    },
    signs: {
      zh: '容易过敏，如鼻痒、喷嚏、皮疹，或有明确的先天异常表现。接触某些气味、花粉、食物后症状加重。',
      en: 'Allergies are common, such as nasal itch, sneezing, or rash, or there is a known congenital feature. Symptoms worsen after certain smells, pollen, or foods.',
    },
    care: {
      zh: '避开已经确认的过敏原。新的食物和新环境先少量接触、观察反应。呼吸困难、喉头发紧或全身皮疹，按急症处理。',
      en: 'Avoid allergens you already know. Try new foods and new environments in small steps and watch the response. Trouble breathing, throat tightness, or a widespread rash is an emergency.',
    },
  },
]
