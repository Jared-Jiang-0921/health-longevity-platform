/**
 * 体质识别教育摘要。依据中华中医药学会《中医体质分类与判定》（ZYYXH/T157-2009）的九种分类，
 * 用本站自己的句子写总体特征、常见表现和调养方向。不是个人体质判定，不开方、不写剂量。
 */
export const TCM_CONSTITUTION_SOURCE = {
  zh: '依据中华中医药学会《中医体质分类与判定》（ZYYXH/T157-2009）整理。这是九种体质的教育摘要，不是对你本人的体质结论。',
  en: 'Educational summary of the nine constitution types in the China Association of Chinese Medicine standard ZYYXH/T157-2009. This is not a personal constitution judgment.',
  ar: 'ملخص تعليمي لأنماط الجسم التسعة في معيار الجمعية الصينية للطب الصيني ZYYXH/T157-2009. ليس حكماً على نمطك الشخصي.',
}

export const TCM_CONSTITUTIONS = [
  {
    id: 'balanced',
    name: { zh: '平和质', en: 'Balanced', ar: 'متوازن' },
    summary: {
      zh: '阴阳气血比较调和，是九种体质里的参照状态。',
      en: 'Qi, blood, yin, and yang are relatively balanced. This is the reference type among the nine.',
      ar: 'التشي والدم واليين واليانغ متوازنة نسبياً. هذا النمط المرجعي بين التسعة.',
    },
    signs: {
      zh: '体态适中，面色润泽，睡眠和精力较稳，对寒热的耐受力比较好。',
      en: 'Moderate build, fresh complexion, fairly steady sleep and energy, and reasonable tolerance of cold and heat.',
      ar: 'بنية معتدلة، بشرة مشرقة، نوم وطاقة مستقران نسبياً، وتحمل مقبول للبرد والحر.',
    },
    care: {
      zh: '饮食有节，起居有常，劳逸结合。状态已经平稳时，不必为了进补而进补。',
      en: 'Regular meals, regular hours, and a balance of effort and rest. If you already feel steady, there is no need to add tonics for their own sake.',
      ar: 'وجبات منتظمة، نوم منتظم، وتوازن بين الجهد والراحة. إن كانت الحالة مستقرة فلا داعي للمقويات لمجرد التقوية.',
    },
  },
  {
    id: 'qi-deficiency',
    name: { zh: '气虚质', en: 'Qi deficiency', ar: 'نقص التشي' },
    summary: {
      zh: '元气不足，容易疲乏，说话或活动后气不够用。',
      en: 'Vital qi is insufficient. Fatigue is common, and breath feels short after talking or activity.',
      ar: 'التشي الحيوي غير كافٍ. التعب شائع، ويضيق النفس بعد الكلام أو النشاط.',
    },
    signs: {
      zh: '容易累，气短，自汗，声音偏低，活动后恢复慢。',
      en: 'Easy fatigue, shortness of breath, sweating without heavy exertion, a quiet voice, and slow recovery after activity.',
      ar: 'تعب سريع، ضيق نفس، تعرق دون جهد شديد، صوت منخفض، وبطء في استعادة النشاط.',
    },
    care: {
      zh: '少熬夜、少硬扛。饭食温和、好消化。运动选散步、八段锦这类轻度活动。持续气短或活动后明显喘，要去就医，不要靠进补硬撑。',
      en: 'Cut back on late nights and pushing through exhaustion. Eat gentle, easy-to-digest meals. Prefer walking or Baduanjin over hard training. Ongoing shortness of breath needs a clinician, not more tonics.',
      ar: 'قلل السهر ومواصلة الإجهاد. الوجبات لطيفة وسهلة الهضم. فضّل المشي أو بادوانجين على التمرين الشديد. ضيق النفس المستمر يحتاج طبيباً لا مزيداً من المقويات.',
    },
  },
  {
    id: 'yang-deficiency',
    name: { zh: '阳虚质', en: 'Yang deficiency', ar: 'نقص اليانغ' },
    summary: {
      zh: '阳气不足，身体偏怕冷。',
      en: 'Yang qi is insufficient, so the body tends to feel cold.',
      ar: 'اليانغ غير كافٍ، فيميل الجسم إلى الإحساس بالبرد.',
    },
    signs: {
      zh: '畏寒，手足不温，喜欢热饮和保暖，精神容易不振。',
      en: 'Aversion to cold, cool hands and feet, a preference for warm drinks and extra clothing, and a tendency to feel listless.',
      ar: 'خوف من البرد، برودة اليدين والقدمين، تفضيل المشروبات الدافئة والملابس الإضافية، وميل إلى الفتور.',
    },
    care: {
      zh: '注意保暖，少吃生冷，空调和冷饮不要过久。夏季也要避免长时间贪凉。',
      en: 'Keep warm, go easy on raw and cold food, and limit long stretches of air-conditioning or iced drinks. Avoid staying chilled for hours even in summer.',
      ar: 'حافظ على الدفء، خفف النيء والبارد، وقلل الجلوس الطويل في التكييف أو مع المشروبات المثلجة. تجنب البرودة الطويلة حتى في الصيف.',
    },
  },
  {
    id: 'yin-deficiency',
    name: { zh: '阴虚质', en: 'Yin deficiency', ar: 'نقص اليين' },
    summary: {
      zh: '阴液偏少，常见口干和手足心热。',
      en: 'Yin fluids run low. Dry mouth and warm palms and soles are typical.',
      ar: 'سوائل اليين قليلة. جفاف الفم وحرارة الكفين والأخمصين شائعان.',
    },
    signs: {
      zh: '口燥咽干，手足心热，盗汗，睡眠偏浅，耐受炎热的能力较差。',
      en: 'Dry mouth and throat, warm palms and soles, night sweats, light sleep, and poor tolerance of heat.',
      ar: 'جفاف الفم والحلق، حرارة الكفين والأخمصين، تعرق ليلي، نوم خفيف، وضعف تحمل الحر.',
    },
    care: {
      zh: '少辛辣、少煎炸、少熬夜。饮食可以偏清淡、润一些。口干持续加重或伴有明显消瘦，要就医核对，不要只当成体质。',
      en: 'Fewer spicy and fried foods, and fewer late nights. Meals can be lighter and more moistening. Worsening dry mouth with clear weight loss needs a clinical check.',
      ar: 'قلل الحار والمقلي والسهر. يمكن أن تكون الوجبات أخف وأكثر ترطيباً. جفاف الفم المتفاقم مع نقص واضح في الوزن يحتاج فحصاً سريرياً.',
    },
  },
  {
    id: 'phlegm-dampness',
    name: { zh: '痰湿质', en: 'Phlegm-dampness', ar: 'البلغم والرطوبة' },
    summary: {
      zh: '痰湿偏盛，体形和腹部容易显得壅滞。',
      en: 'Phlegm-dampness tends to accumulate, often showing as a heavier build and a full abdomen.',
      ar: 'يميل البلغم والرطوبة إلى التجمع، وغالباً ما يظهر ذلك في بدن أثقل وبطن ممتلئ.',
    },
    signs: {
      zh: '体形偏胖，腹部肥满，口中发黏，舌苔偏腻，身体沉重感比较明显。',
      en: 'A heavier build, abdominal fullness, a sticky feeling in the mouth, a greasy tongue coating, and a marked sense of bodily heaviness.',
      ar: 'بدن أثقل، امتلاء البطن، إحساس بلزوجة في الفم، طبقة لسان دهنية، وشعور واضح بثقل الجسم.',
    },
    care: {
      zh: '少肥甘、少甜腻，饭量适中。把步行等活动放进每天的安排。胸部憋闷、喘或突然的严重困倦，按急症就医。',
      en: 'Ease up on rich, sweet, and greasy food, and keep portions moderate. Put walking or similar movement into the day. Chest tightness, wheezing, or sudden heavy drowsiness needs urgent care.',
      ar: 'خفف الدسم والحلو والدهني، واجعل الكمية معتدلة. أدخل المشي أو حركة مشابهة في اليوم. ضيق الصدر أو الأزيز أو النعاس الشديد المفاجئ يحتاج رعاية عاجلة.',
    },
  },
  {
    id: 'damp-heat',
    name: { zh: '湿热质', en: 'Damp-heat', ar: 'الرطوبة والحرارة' },
    summary: {
      zh: '湿热内蕴，面部和口腔容易有油腻、口苦一类表现。',
      en: 'Damp-heat stays inside. An oily face and a bitter taste in the mouth are common clues.',
      ar: 'الرطوبة والحرارة داخليتان. الوجه الدهني والطعم المر في الفم من العلامات الشائعة.',
    },
    signs: {
      zh: '面垢油光，口苦，口干，舌苔黄腻，身重，大便黏滞或气味较重。',
      en: 'An oily complexion, bitter or dry mouth, a yellow greasy tongue coating, bodily heaviness, and sticky or strong-smelling stools.',
      ar: 'بشرة دهنية، مرارة أو جفاف في الفم، طبقة لسان صفراء دهنية، ثقل في الجسم، وبراز لزج أو قوي الرائحة.',
    },
    care: {
      zh: '少酒，少辛辣油炸。环境尽量干爽，出汗后及时换干衣服。皮肤脓疱、黄疸或发热不退，要就医。',
      en: 'Less alcohol and less spicy, fried food. Keep the living space from staying damp, and change out of sweaty clothes. Pustules, jaundice, or a fever that does not settle needs a clinician.',
      ar: 'قلل الكحول والحار والمقلي. اجعل مكان المعيشة أقل رطوبة، وبدّل الملابس بعد التعرق. البثور أو اليرقان أو الحمى المستمرة تحتاج طبيباً.',
    },
  },
  {
    id: 'blood-stasis',
    name: { zh: '血瘀质', en: 'Blood stasis', ar: 'ركود الدم' },
    summary: {
      zh: '血行不畅，气色和局部刺痛比较常见。',
      en: 'Blood moves less freely. A dull complexion and localized pricking pain are common.',
      ar: 'جريان الدم أقل سلاسة. الشحوب الباهت والألم الواخز الموضعي شائعان.',
    },
    signs: {
      zh: '肤色晦暗，容易出现瘀斑，局部刺痛、痛处相对固定，舌质偏暗或有瘀点。',
      en: 'A dull complexion, easy bruising, localized pricking pain that stays in one place, and a darker tongue or stasis spots.',
      ar: 'بشرة باهتة، كدمات سهلة، ألم واخز ثابت الموضع، ولسان أغمق أو نقاط ركود.',
    },
    care: {
      zh: '避免久坐不动，安排规律的肢体活动。胸痛、一侧无力、言语不清、黑便或突发剧烈头痛，直接去急诊，不要在这里自行活血。',
      en: 'Avoid sitting still for long periods, and keep regular movement in the day. Chest pain, one-sided weakness, trouble speaking, black stools, or a sudden severe headache means the emergency department, not self-directed “blood moving.”',
      ar: 'تجنب الجلوس الطويل بلا حركة، وحافظ على نشاط منتظم. ألم الصدر أو ضعف أحد الجانبين أو اضطراب الكلام أو البراز الأسود أو الصداع الشديد المفاجئ يعني الطوارئ، لا تحريك الدم ذاتياً.',
    },
  },
  {
    id: 'qi-stagnation',
    name: { zh: '气郁质', en: 'Qi stagnation', ar: 'ركود التشي' },
    summary: {
      zh: '气机不畅，情绪容易堵在心里。',
      en: 'Qi does not move freely, and emotion tends to feel stuck.',
      ar: 'التشي لا يتحرك بسلاسة، والمشاعر تميل إلى الاحتباس.',
    },
    signs: {
      zh: '情绪抑郁，容易忧虑，胸胁胀闷，叹气后稍舒，睡眠易受情绪影响。',
      en: 'Low mood, a tendency to worry, fullness in the chest or flanks, slight relief after a sigh, and sleep that follows the mood.',
      ar: 'مزاج منخفض، ميل للقلق، امتلاء في الصدر أو الخاصرتين، راحة طفيفة بعد التنهد، ونوم يتبع المزاج.',
    },
    care: {
      zh: '保持白天活动和比较稳定的睡眠时间，把担心说给可信的人听。情绪持续低落、失去兴趣，或出现自伤的想法，要寻求专业帮助。',
      en: 'Keep some daytime activity and a fairly stable sleep schedule, and talk with someone you trust. Ongoing low mood, loss of interest, or thoughts of self-harm need professional help.',
      ar: 'حافظ على نشاط نهاري ووقت نوم مستقر نسبياً، وتحدث مع شخص تثق به. المزاج المنخفض المستمر أو فقدان الاهتمام أو أفكار إيذاء النفس تحتاج مساعدة مهنية.',
    },
  },
  {
    id: 'special',
    name: { zh: '特禀质', en: 'Inherited special constitution', ar: 'استعداد خاص' },
    summary: {
      zh: '先天禀赋特殊，过敏和某些先天异常表现归在这一类。',
      en: 'The inborn constitution is unusual. Allergies and some congenital features are grouped here.',
      ar: 'الاستعداد الخلقي غير المعتاد. تُدرج هنا الحساسية وبعض السمات الخلقية.',
    },
    signs: {
      zh: '容易过敏，如鼻痒、喷嚏、皮疹，或有明确的先天异常表现。接触某些气味、花粉、食物后症状加重。',
      en: 'Allergies are common, such as nasal itch, sneezing, or rash, or there is a known congenital feature. Symptoms worsen after certain smells, pollen, or foods.',
      ar: 'الحساسية شائعة، مثل حكة الأنف أو العطاس أو الطفح، أو توجد سمة خلقية معروفة. تتفاقم الأعراض بعد روائح أو حبوب لقاح أو أطعمة معينة.',
    },
    care: {
      zh: '避开已经确认的过敏原。新的食物和新环境先少量接触、观察反应。呼吸困难、喉头发紧或全身皮疹，按急症处理。',
      en: 'Avoid allergens you already know. Try new foods and new environments in small steps and watch the response. Trouble breathing, throat tightness, or a widespread rash is an emergency.',
      ar: 'تجنب المُحَسِّسات المعروفة لديك. جرّب الطعام والبيئة الجديدة بخطوات صغيرة وراقب الاستجابة. صعوبة التنفس أو ضيق الحلق أو الطفح المنتشر حالة طارئة.',
    },
  },
]
