/**
 * 四季养生教育摘要。
 * 起居、情志：《素问·四气调神大论》。
 * 脏腑对应：《素问·六节藏象论》《素问·藏气法时论》。
 * 脾是否独主长夏：同列《素问·太阴阳明论》。
 * 术语：中华中医药学会 T/CACM 1067—2018《中医治未病术语》。
 * 标准只定义原则，不规定钟点、食物和药量。
 * 食养粥另见文末，出自《遵生八笺·饮馔服食笺》，不收含石膏、人参、生地黄、何首乌的方。
 */
export const TCM_SEASON_SOURCE = {
  zh: '起居和情志依据《素问·四气调神大论》。脏腑对应依据《素问·六节藏象论》《素问·藏气法时论》；脾是否独主长夏，同时列出《素问·太阴阳明论》。术语依据中华中医药学会团体标准 T/CACM 1067—2018《中医治未病术语》。这不是国家标准，也不规定几点睡、吃哪味药。',
  en: 'Daily rhythm and mood follow Suwen, “Regulating the Spirit According to the Four Qi.” Organ links follow “Discussion on the Six Sections and Visceral Manifestations” and “Discussion on How Visceral Qi Follows the Seasons.” Whether the spleen owns late summer alone is also checked against “Discussion on Taiyin and Yangming.” Terms follow China Association of Chinese Medicine group standard T/CACM 1067—2018. It is not a national standard, and it sets no clock times, foods, or doses.',
  ar: 'الإيقاع والمزاج من «سوين»: ضبط الروح وفق تشي الفصول الأربعة. مقابلة الأعضاء من فصل الأقسام الستة ومظاهر الأحشاء، ومن فصل اتباع تشي الأحشاء للفصول. هل ينفرد الطحال بأواخر الصيف يُعرض أيضاً من فصل تاي يين ويانغ مينغ. المصطلحات من المعيار الجماعي T/CACM 1067—2018 لجمعية الطب الصيني. ليس معياراً وطنياً، ولا يحدد ساعة أو طعاماً أو جرعة.',
}

export const TCM_SEASON_PRINCIPLE = {
  title: { zh: '总则', en: 'The root', ar: 'الأصل' },
  classicFrom: {
    zh: '《素问·四气调神大论》',
    en: 'Suwen, Four Qi',
    ar: 'سوين، تشي الفصول الأربعة',
  },
  classic: {
    zh: '四时阴阳是万物的根本。春夏养阳，秋冬养阴，是顺着这个根本，不是某一天的加减方。',
    en: 'The yin and yang of the four seasons are the root of living things. Supporting yang in spring and summer, and yin in autumn and winter, follows that root. It is not a formula added or subtracted for one day.',
    ar: 'يين ويانغ الفصول الأربعة أصل الكائنات. دعم اليانغ في الربيع والصيف واليين في الخريف والشتاء متابعة لهذا الأصل، وليس وصفة تُزاد أو تُنقص ليوم واحد.',
  },
  standardFrom: {
    zh: 'T/CACM 1067—2018 · 法于阴阳',
    en: 'T/CACM 1067—2018 · Obeying yin and yang',
    ar: 'T/CACM 1067—2018 · متابعة اليين واليانغ',
  },
  standard: {
    zh: '「法于阴阳」写的是：效法自然界阴阳变化，春夏养阳，秋冬养阴；起居劳逸、饮食五味、情志活动遵从阴阳和谐。',
    en: 'The entry “obeying yin and yang” says: follow the rise and fall of yin and yang in nature, support yang in spring and summer and yin in autumn and winter, and keep daily rhythm, food flavors, and mood within that balance.',
    ar: 'بند «متابعة اليين واليانغ» يقول: اتبع تغيّر اليين واليانغ في الطبيعة، ادعم اليانغ في الربيع والصيف واليين في الخريف والشتاء، واجعل الإيقاع اليومي وطعوم الطعام والمزاج ضمن هذا التوازن.',
  },
  note: {
    zh: '天暖时生发、宣散要有度，天寒时收敛、闭藏要有度。不按某一个节气开个人方案。',
    en: 'In warm months, opening and spreading need a limit. In cold months, gathering and storing need a limit. This is not a personal plan for one solar term.',
    ar: 'في الشهور الدافئة، للانفتاح والانتشار حد. في الشهور الباردة، للجمع والتخزين حد. هذه ليست خطة شخصية ليوم شمسي واحد.',
  },
}

export const TCM_SEASONS = [
  {
    id: 'spring',
    name: { zh: '春', en: 'Spring', ar: 'الربيع' },
    organ: { zh: '肝主春', en: 'Liver governs spring', ar: 'الكبد للربيع' },
    classicFrom: {
      zh: '《素问·四气调神大论》。肝通于春气见《素问·六节藏象论》，肝主春见《素问·藏气法时论》。',
      en: 'Suwen, Four Qi. “The liver connects with spring qi” is in the Six Sections chapter; “the liver governs spring” is in the Visceral Qi chapter.',
      ar: 'سوين، تشي الفصول الأربعة. «الكبد يتصل بتشي الربيع» في فصل الأقسام الستة، و«الكبد يحكم الربيع» في فصل تشي الأحشاء.',
    },
    classic: {
      zh: '「春三月，此谓发陈。」夜卧早起，广步于庭，被发缓形，以使志生；生而勿杀，予而勿夺，赏而勿罚。逆之则伤肝。',
      en: '“The three months of spring are called spreading and laying open.” Go to bed after nightfall and rise early, walk in the courtyard, and loosen the body so the mood can rise. Favor growth over cutting down, giving over taking, and rewarding over punishing. Going against this harms the liver.',
      ar: '«أشهر الربيع الثلاثة تسمى الانفتاح.» نم بعد حلول الليل واستيقظ مبكراً، وامشِ في الساحة وأرخِ الجسم حتى يرتفع المزاج. قدّم النمو على القطع، والعطاء على الأخذ، والثواب على العقاب. مخالفة ذلك تؤذي الكبد.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 春季养生、四时起居',
      en: 'T/CACM 1067—2018 · Spring care; seasonal daily rhythm',
      ar: 'T/CACM 1067—2018 · عناية الربيع؛ إيقاع الفصول',
    },
    standard: {
      zh: '「春季养生」指按春天万物生发的特点来调养。「四时起居」是按季节阴阳和个人情况安排作息，不是一张统一的钟点表。',
      en: '“Spring health preservation” means care suited to the season when things start to grow. “Seasonal daily rhythm” means setting rest by the season’s yin and yang and by the person. It is not one clock for everyone.',
      ar: '«عناية الربيع» تعني عناية تناسب موسم بدء النمو. «إيقاع الفصول» يعني ضبط الراحة حسب يين ويانغ الفصل وحسب الشخص، وليس ساعة واحدة للجميع.',
    },
    note: {
      zh: '可以比冬天略晚睡、早点起，白天到户外走动，把身体舒展开。心情宜舒展，少长久压抑或苛责。这里不规定几点必须睡。下面的粥是食养示例，不是养肝药。',
      en: 'You can sleep a little later than in winter and rise earlier, walk outside, and let the body loosen. Let mood open, and ease long suppression or harsh self-blame. This page sets no required bedtime and offers no liver tonic.',
      ar: 'يمكن النوم متأخراً قليلاً عن الشتاء والاستيقاظ أبكر، والمشي خارجاً وإرخاء الجسم. دع المزاج ينفتح، وخفف الكبت الطويل أو لوم النفس. هذه الصفحة لا تفرض ساعة نوم ولا تقدم مقوي كبد.',
    },
    caution: {
      zh: '胁肋持续胀痛、眼睛发黄，或情绪明显失控，要就医。不要因为换了季节就自行停药或改量。',
      en: 'See a clinician for lasting rib-side distending pain, yellowing of the eyes, or mood that is clearly out of control. Do not stop or change a medicine because the season changed.',
      ar: 'راجع طبيباً عند امتلاء مؤلم مستمر في الأضلاع، أو اصفرار العينين، أو مزاج خارج السيطرة. لا توقف دواءً أو تغير جرعته لأن الفصل تغيّر.',
    },
  },
  {
    id: 'summer',
    name: { zh: '夏', en: 'Summer', ar: 'الصيف' },
    organ: { zh: '心主夏', en: 'Heart governs summer', ar: 'القلب للصيف' },
    classicFrom: {
      zh: '《素问·四气调神大论》。心通于夏气见《素问·六节藏象论》，心主夏见《素问·藏气法时论》。',
      en: 'Suwen, Four Qi. “The heart connects with summer qi” is in the Six Sections chapter; “the heart governs summer” is in the Visceral Qi chapter.',
      ar: 'سوين، تشي الفصول الأربعة. «القلب يتصل بتشي الصيف» في فصل الأقسام الستة، و«القلب يحكم الصيف» في فصل تشي الأحشاء.',
    },
    classic: {
      zh: '「夏三月，此谓蕃秀。」夜卧早起，无厌于日；使志无怒，使气得泄。逆之则伤心。',
      en: '“The three months of summer are called flourishing.” Go to bed after nightfall and rise early, and do not turn away from the day. Keep the mood free of anger so qi can spread outward. Going against this harms the heart.',
      ar: '«أشهر الصيف الثلاثة تسمى الازدهار.» نم بعد حلول الليل واستيقظ مبكراً، ولا تعرض عن النهار. اجعل المزاج بلا غضب حتى ينتشر التشي إلى الخارج. مخالفة ذلك تؤذي القلب.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 夏季养生',
      en: 'T/CACM 1067—2018 · Summer care',
      ar: 'T/CACM 1067—2018 · عناية الصيف',
    },
    standard: {
      zh: '「夏季养生」指按夏季阳气洪盛、万物华实的特点来调养。',
      en: '“Summer health preservation” means care suited to abundant yang and to the season when things flower and set fruit.',
      ar: '«عناية الصيف» تعني عناية تناسب وفرة اليانغ وموسم الإزهار والإثمار.',
    },
    note: {
      zh: '宜早起，白天可以见日光，避开长时间暴晒。睡眠仍然要够；「夜卧」不是熬夜。少发怒。冷饮和空调可以临时解热，不宜当成整天的办法。不自行用寒凉药清热。',
      en: 'Rise early and get some daylight, without long exposure to harsh sun. Still sleep enough. “After nightfall” does not mean staying up all night. Anger less. Cold drinks and air-conditioning can cool you for a while; they are not an all-day method. Do not use cold-natured medicine on your own to clear heat.',
      ar: 'استيقظ مبكراً وتعرض لضوء النهار دون شمس حارقة طويلة. النوم يظل كافياً. «بعد حلول الليل» لا يعني السهر. أقل من الغضب. المشروبات الباردة والتكييف يبردان مؤقتاً، وليسا طريقة طوال اليوم. لا تستخدم دواء بارد الطبيعة من تلقاء نفسك لإزالة الحرارة.',
    },
    caution: {
      zh: '胸痛、胸闷、晕厥要立刻就医。中暑或高热不退，不要只靠家常汤水硬扛。',
      en: 'Chest pain, chest tightness, or fainting needs emergency care. Heatstroke or a fever that will not come down is not something to wait out with a home drink.',
      ar: 'ألم الصدر أو ضيقه أو الإغماء يحتاج إسعافاً. ضربة الشمس أو الحمى التي لا تنخفض ليست شيئاً يُنتظر مع مشروب منزلي.',
    },
  },
  {
    id: 'autumn',
    name: { zh: '秋', en: 'Autumn', ar: 'الخريف' },
    organ: { zh: '肺主秋', en: 'Lung governs autumn', ar: 'الرئة للخريف' },
    classicFrom: {
      zh: '《素问·四气调神大论》。肺通于秋气见《素问·六节藏象论》，肺主秋见《素问·藏气法时论》。',
      en: 'Suwen, Four Qi. “The lung connects with autumn qi” is in the Six Sections chapter; “the lung governs autumn” is in the Visceral Qi chapter.',
      ar: 'سوين، تشي الفصول الأربعة. «الرئة تتصل بتشي الخريف» في فصل الأقسام الستة، و«الرئة تحكم الخريف» في فصل تشي الأحشاء.',
    },
    classic: {
      zh: '「秋三月，此谓容平。」早卧早起，与鸡俱兴；使志安宁，收敛神气，使肺气清。逆之则伤肺。',
      en: '“The three months of autumn are called leveling and containing.” Sleep early and rise early, with the rooster. Keep the mood calm, gather the spirit, and let lung qi stay clear. Going against this harms the lung.',
      ar: '«أشهر الخريف الثلاثة تسمى الاعتدال والاحتواء.» نم مبكراً واستيقظ مبكراً مع الديك. اجعل المزاج هادئاً، واجمع الروح، ودع تشي الرئة صافياً. مخالفة ذلك تؤذي الرئة.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 秋季养生',
      en: 'T/CACM 1067—2018 · Autumn care',
      ar: 'T/CACM 1067—2018 · عناية الخريف',
    },
    standard: {
      zh: '「秋季养生」指按秋季阳气渐消、阴气渐长、清肃收敛的特点来调养。',
      en: '“Autumn health preservation” means care suited to yang receding, yin growing, and the clear, gathering quality of the season.',
      ar: '«عناية الخريف» تعني عناية تناسب انحسار اليانغ ونمو اليين وصفة الفصل الصافية الجامعة.',
    },
    note: {
      zh: '宜早睡早起。白天可以照常活动，情志和出汗宜比夏天收一些。空气偏燥时，饮食温润、适量即可。活动到微微汗出即可。',
      en: 'Sleep early and rise early. Daytime activity can stay normal, while mood and sweating should gather in more than in summer. When the air is dry, food that is gently moistening and moderate is enough. Stop activity at a light sweat.',
      ar: 'نم مبكراً واستيقظ مبكراً. النشاط النهاري يمكن أن يبقى عادياً، بينما المزاج والتعرق يميلان إلى الجمع أكثر من الصيف. حين يجف الهواء، يكفي طعام مرطب بلطف ومعتدل. أوقف النشاط عند عرق خفيف.',
    },
    caution: {
      zh: '咳嗽、气喘明显加重，或出现咯血、胸痛，要就医。',
      en: 'See a clinician if cough or breathlessness clearly worsens, or if there is blood in the sputum or chest pain.',
      ar: 'راجع طبيباً إذا اشتد السعال أو ضيق النفس بوضوح، أو ظهر دم مع البلغم أو ألم في الصدر.',
    },
  },
  {
    id: 'winter',
    name: { zh: '冬', en: 'Winter', ar: 'الشتاء' },
    organ: { zh: '肾主冬', en: 'Kidney governs winter', ar: 'الكلية للشتاء' },
    classicFrom: {
      zh: '《素问·四气调神大论》。肾通于冬气见《素问·六节藏象论》，肾主冬见《素问·藏气法时论》。',
      en: 'Suwen, Four Qi. “The kidney connects with winter qi” is in the Six Sections chapter; “the kidney governs winter” is in the Visceral Qi chapter.',
      ar: 'سوين، تشي الفصول الأربعة. «الكلية تتصل بتشي الشتاء» في فصل الأقسام الستة، و«الكلية تحكم الشتاء» في فصل تشي الأحشاء.',
    },
    classic: {
      zh: '「冬三月，此谓闭藏。」早卧晚起，必待日光；去寒就温，无泄皮肤；使志若伏若匿。逆之则伤肾。',
      en: '“The three months of winter are called closing and storing.” Sleep early and rise late, waiting for daylight. Leave the cold and stay warm, and do not let the skin vent. Let the mood stay as if hidden. Going against this harms the kidney.',
      ar: '«أشهر الشتاء الثلاثة تسمى الإغلاق والتخزين.» نم مبكراً واستيقظ متأخراً حتى ضوء النهار. ابتعد عن البرد والزم الدفء، ولا تدع الجلد يفرّغ. اجعل المزاج كأنه مستتر. مخالفة ذلك تؤذي الكلية.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 冬季养生',
      en: 'T/CACM 1067—2018 · Winter care',
      ar: 'T/CACM 1067—2018 · عناية الشتاء',
    },
    standard: {
      zh: '「冬季养生」指按冬季阳气潜伏、阴气极盛、万物闭藏的特点来调养。',
      en: '“Winter health preservation” means care suited to yang lying hidden, yin at its fullest, and things stored away.',
      ar: '«عناية الشتاء» تعني عناية تناسب كمون اليانغ وبلوغ اليين أقصاه وتخزين الأشياء.',
    },
    note: {
      zh: '宜早睡，起床可以等到天光。注意保暖，少在大寒里久留室外。饮食宜温、少生冷；保暖不是自行用药酒或补药。活动宜轻，避免大汗，以合「无泄皮肤」。',
      en: 'Sleep early, and you can wait for daylight before rising. Keep warm, and do not stay long outdoors in severe cold. Prefer warm food and go easy on raw and cold dishes. Keeping warm does not mean medicinal wine or tonics on your own. Keep activity light and avoid heavy sweat, in line with “do not let the skin vent.”',
      ar: 'نم مبكراً، ويمكن انتظار ضوء النهار قبل الاستيقاظ. حافظ على الدفء ولا تطل البقاء خارجاً في البرد الشديد. فضّل الطعام الدافئ وقلل النيء والبارد. الدفء لا يعني نبيذ الدواء أو المقويات من تلقاء نفسك. اجعل النشاط خفيفاً وتجنب التعرق الغزير، بما يوافق «لا تدع الجلد يفرّغ».',
    },
    caution: {
      zh: '明显畏寒加重、水肿、腰膝冷痛持续，或夜尿突然明显增多，要就医。',
      en: 'See a clinician for clearly worsening cold intolerance, swelling, lasting cold pain in the low back or knees, or a sudden marked increase in nighttime urination.',
      ar: 'راجع طبيباً عند اشتداد واضح لعدم تحمل البرد، أو تورم، أو ألم بارد مستمر في أسفل الظهر أو الركبتين، أو زيادة مفاجئة وواضحة في التبول الليلي.',
    },
  },
]

export const TCM_LATE_SUMMER = {
  id: 'late-summer',
  name: { zh: '长夏', en: 'Late summer', ar: 'أواخر الصيف' },
  organ: { zh: '脾', en: 'Spleen', ar: 'الطحال' },
  classic: [
    {
      from: {
        zh: '《素问·藏气法时论》',
        en: 'Suwen, Visceral Qi Following the Seasons',
        ar: 'سوين، اتباع تشي الأحشاء للفصول',
      },
      text: {
        zh: '脾主长夏。',
        en: 'The spleen governs late summer.',
        ar: 'الطحال يحكم أواخر الصيف.',
      },
    },
    {
      from: {
        zh: '《素问·太阴阳明论》',
        en: 'Suwen, Taiyin and Yangming',
        ar: 'سوين، تاي يين ويانغ مينغ',
      },
      text: {
        zh: '脾为土，治中央，常以四时长四脏，各以十八日寄治，不得独主于时。',
        en: 'The spleen belongs to earth and governs the center. Through the four seasons it assists the four viscera, about eighteen days in each, and does not exclusively own one season.',
        ar: 'الطحال من الأرض ويحكم المركز. يعين الأحشاء الأربعة عبر الفصول، نحو ثمانية عشر يوماً في كل فصل، ولا ينفرد بفصل واحد.',
      },
    },
  ],
  standardFrom: {
    zh: 'T/CACM 1067—2018 · 因时调养',
    en: 'T/CACM 1067—2018 · Seasonal regulation',
    ar: 'T/CACM 1067—2018 · التنظيم حسب الفصل',
  },
  standard: {
    zh: '这份术语标准只列了春、夏、秋、冬四条养生，没有单独的「长夏养生」术语。',
    en: 'This terminology standard lists spring, summer, autumn, and winter only. It has no separate term for late-summer care.',
    ar: 'معيار المصطلحات يذكر الربيع والصيف والخريف والشتاء فقط، وليس فيه مصطلح مستقل لعناية أواخر الصيف.',
  },
  note: {
    zh: '夏末到秋初、湿热相兼的一段，教学上常称长夏，并对应养脾。饮食宜清淡、好消化，少肥甘厚味，也少把生冷当日常。',
    en: 'The humid stretch from the end of summer into early autumn is often taught as late summer and linked with supporting the spleen. Eat food that is light and easy to digest. Go easy on rich, sweet, greasy meals, and do not make raw or iced food a daily habit.',
    ar: 'الفترة الرطبة من آخر الصيف إلى أول الخريف تُدرَّس غالباً كأواخر الصيف وتُربط بدعم الطحال. كل طعاماً خفيفاً سهل الهضم. خفف الدسم والحلو الثقيل، ولا تجعل النيء أو المثلج عادة يومية.',
  },
  caution: {
    zh: '肢体困重、腹胀、大便不成形如果持续，要就医。不要自行用祛湿药。',
    en: 'See a clinician if heavy limbs, bloating, or unformed stools continue. Do not take dampness-clearing medicine on your own.',
    ar: 'راجع طبيباً إذا استمر ثقل الأطراف أو الانتفاخ أو براز غير متماسك. لا تتناول دواء إزالة الرطوبة من تلقاء نفسك.',
  },
}

/** 食养粥。做法出自《遵生八笺·饮馔服食笺》粥糜类，不收含石膏、人参、生地黄、何首乌的方。 */
export const TCM_FOOD_BASIS = {
  zh: '下面的粥出自明代高濂《遵生八笺·饮馔服食笺》的粥糜类，是食养，不是处方。原料是日常食物，或《卫生部关于进一步规范保健食品原料管理的通知》（卫法监发〔2002〕51号）里、至今仍按食药物质管理的品种。这本书没有按春夏秋冬各列三款。书中写明季节的，照书放；没写明的，标明是本站按这一季的特点选用。古方里的两、钱、合不抄成你的食量。书中「治某证」只保留原文说法，不能当成你的治疗。',
  en: 'The porridges below come from the gruel section of Gao Lian’s Ming-dynasty Eight Discourses on Living Well. They are food, not prescriptions. Ingredients are ordinary foods, or items still managed as food-medicine substances from the 2002 Ministry of Health list. The book does not give three recipes for each season. Where it names a season, we follow it. Where it does not, we say this site chose it for that season. Old measures are not copied as your portion. A line in the book about “treating” a condition stays a quotation, not your treatment.',
  ar: 'العصائد أدناه من قسم العصيدة في كتاب غاو ليان من عهد مينغ. هي طعام لا وصفات طبية. المكونات أطعمة عادية أو مواد ما زالت تُدار كغذاء ودواء وفق قائمة وزارة الصحة عام 2002. الكتاب لا يعطي ثلاث وصفات لكل فصل. إن سمّى الفصل اتبعناه، وإلا قلنا إن الموقع اختارها لهذا الفصل. مقاييس الكتاب القديمة لا تُنسخ كحصتك. عبارة «يعالج» في الكتاب تبقى اقتباساً لا علاجاً لك.',
}

function recipe(name, from, method, place) {
  return { name, from, method, place }
}

const FROM_BOOK = {
  zh: '《遵生八笺·饮馔服食笺》',
  en: 'Eight Discourses on Living Well, food chapter',
  ar: 'الخطابات الثمانية للعيش، فصل الطعام',
}

export const TCM_SEASON_RECIPES = {
  spring: [
    recipe(
      { zh: '菊苗粥', en: 'Chrysanthemum-shoot porridge', ar: 'عصيدة براعم الأقحوان' },
      FROM_BOOK,
      {
        zh: '取甘菊新长的嫩叶，洗净切细，加少量盐，与米同煮成粥。书中写「清目宁心」。',
        en: 'Wash and chop tender new chrysanthemum leaves, add a little salt, and cook them with rice into porridge. The book says it clears the eyes and calms the heart.',
        ar: 'اغسل أوراق الأقحوان الغضة وقطّعها، وأضف قليلاً من الملح، واطبخها مع الأرز عصيدة. الكتاب يقول إنها تصفي العين وتهدئ القلب.',
      },
      {
        zh: '书中用的是「新长嫩头」，就是春天刚发的苗。菊花在食药物质目录里。气虚胃寒、食少泄泻的人少用，也不能把这碗粥当成治眼病的药。',
        en: 'The book uses newly grown shoots, which belong to spring. Chrysanthemum is on the food-medicine list. People with a cold, weak stomach or loose stools should go easy. This porridge is not eye medicine.',
        ar: 'الكتاب يستخدم براعم جديدة، وهي من الربيع. الأقحوان في قائمة الغذاء والدواء. من ضعفت معدته وبردت أو من يسهّل برازه يخفف. هذه العصيدة ليست دواء عين.',
      },
    ),
    recipe(
      { zh: '杞叶粥', en: 'Goji-leaf porridge', ar: 'عصيدة ورق الغوجي' },
      FROM_BOOK,
      {
        zh: '用枸杞刚长出的嫩叶，煮法与菊苗粥相同。书中只写「亦妙」，没有另定用量。',
        en: 'Use the new tender leaves of goji and cook them the same way as the chrysanthemum porridge. The book only says “also good,” and gives no separate amount.',
        ar: 'استخدم أوراق الغوجي الغضة الجديدة واطبخها كعصيدة الأقحوان. الكتاب يقول فقط «جيدة أيضاً» بلا مقدار منفصل.',
      },
      {
        zh: '同样取春天的嫩叶。枸杞子在食药物质目录里，嫩叶是传统蔬菜。本站枸杞子条写明：脾虚便溏者慎用，外邪实热者不宜。',
        en: 'These are spring leaves too. Goji fruit is on the food-medicine list, and the young leaf is a traditional vegetable. This site’s goji note says: be careful with a weak spleen and loose stools, and do not use it in an external heat illness.',
        ar: 'هذه أوراق ربيعية أيضاً. ثمر الغوجي في قائمة الغذاء والدواء، والورق الغض خضار تقليدي. ملاحظة الموقع: الحذر عند ضعف الطحال والبراز اللين، ولا يُستخدم في مرض حراري ظاهر.',
      },
    ),
    recipe(
      { zh: '枸杞粥', en: 'Goji porridge', ar: 'عصيدة الغوجي' },
      FROM_BOOK,
      {
        zh: '枸杞与米同煮成粥。书中记有「枸杞一合、米三合」，这里不把这个比例写成你的食量。',
        en: 'Cook goji with rice into porridge. The book records one ge of goji to three ge of rice. That ratio is not copied here as your portion.',
        ar: 'اطبخ الغوجي مع الأرز عصيدة. الكتاب يذكر نسبة قديمة، ولا ننسخها هنا كحصتك.',
      },
      {
        zh: '书中没有规定只在春天吃。枸杞子归肝、肾经，本站按春季对应肝，放在这里作示例。脾虚便溏、外邪实热不宜。',
        en: 'The book does not limit this to spring. Goji enters the liver and kidney channels, so this site places it in spring as an example beside the liver season. Skip it with a weak spleen and loose stools, or in an external heat illness.',
        ar: 'الكتاب لا يحصره في الربيع. الغوجي يدخل قناتي الكبد والكلية، لذا يضعه الموقع في الربيع كمثال. تجنّبه عند ضعف الطحال والبراز اللين أو المرض الحراري الظاهر.',
      },
    ),
  ],
  summer: [
    recipe(
      { zh: '绿豆粥', en: 'Mung-bean porridge', ar: 'عصيدة الماش' },
      FROM_BOOK,
      {
        zh: '绿豆淘净，多放水煮烂，再下米，用较旺的火熬成粥，放凉再吃。',
        en: 'Rinse mung beans, boil them soft in plenty of water, add rice, and cook into porridge over a lively fire. Eat it after it has cooled.',
        ar: 'اغسل الماش واسلقه طرياً بماء كثير، ثم أضف الأرز واطبخه عصيدة على نار نشطة. كله بعد أن يبرد.',
      },
      {
        zh: '季节是书中写明的：「甚宜夏月。适可而止，不宜多吃。」绿豆是日常食物。脾胃虚寒、经常便溏的人少用，也不要把放凉的粥当成整天的饮食。',
        en: 'The book itself names the season: “very suitable in summer. Stop when enough; do not eat a lot.” Mung beans are an ordinary food. Go easy if your stomach is cold or stools are often loose, and do not make cooled porridge the food of the whole day.',
        ar: 'الكتاب نفسه يسمي الفصل: مناسب جداً في الصيف، وتوقف عند الكفاية ولا تكثر. الماش طعام عادي. خفف إن كانت المعدة باردة أو البراز ليناً غالباً، ولا تجعل العصيدة الباردة طعام اليوم كله.',
      },
    ),
    recipe(
      { zh: '绿豆汤', en: 'Mung-bean broth', ar: 'مرق الماش' },
      FROM_BOOK,
      {
        zh: '绿豆淘净，大火煮开就取汤，放凉。汤色以青碧为宜。',
        en: 'Rinse mung beans, boil them on a high fire, and take the broth as soon as it boils. Cool it. The book wants the broth green and clear.',
        ar: 'اغسل الماش واغله على نار عالية، وخذ المرق فور الغليان ثم برّده. الكتاب يريد المرق أخضر صافياً.',
      },
      {
        zh: '书中写「解暑」。又写：煮太久颜色浑浊，就不适合再喝。这是暑天的汤，不是每天的水。',
        en: 'The book says it relieves summer heat, and that a long boil turns it cloudy and unfit to drink. It is a hot-weather broth, not everyday drinking water.',
        ar: 'الكتاب يقول إنه يخفف حر الصيف، وإن الغلي الطويل يعكّر لونه فلا يصلح للشرب. هو مرق لحر الصيف لا ماء كل يوم.',
      },
    ),
    recipe(
      { zh: '莲子粥', en: 'Lotus-seed porridge', ar: 'عصيدة بذور اللوتس' },
      FROM_BOOK,
      {
        zh: '莲子去皮煮烂、捣细，与糯米煮成粥。书中记有「莲肉一两、糯米三合」，不抄成你的食量。书中说功效与芡实粥相同，原文是「益精气，强智力，聪耳目」。',
        en: 'Peel lotus seeds, cook them soft, mash them, and cook with glutinous rice. The book records one liang of seeds to three ge of rice; that is not copied as your portion. It says the effect matches foxnut porridge: “benefits essence, strengthens wit, sharpens ears and eyes.”',
        ar: 'قشّر بذور اللوتس واسلقها طرية واهرسها واطبخها مع الأرز اللزج. الكتاب يذكر مقداراً قديماً ولا ننسخه كحصتك. يقول إن الأثر كعصيدة الإيريال: ينفع الجوهر ويقوي الذهن ويحدّ السمع والبصر.',
      },
      {
        zh: '书中没有规定只在夏天吃。莲子在食药物质目录里，本站按夏季对应心，放在这里作示例。莲子偏收涩，腹胀、大便干结时少用。那句「益精气」是书中的话，不是给你的补益诊断。',
        en: 'The book does not limit this to summer. Lotus seed is on the food-medicine list, and this site places it in summer beside the heart season. It is astringent, so go easy with bloating or dry stools. The line about essence is the book’s wording, not a judgment about you.',
        ar: 'الكتاب لا يحصره في الصيف. بذور اللوتس في قائمة الغذاء والدواء، والموقع يضعها في الصيف بجانب فصل القلب. هي قابضة، فخفف عند الانتفاخ أو جفاف البراز. عبارة الجوهر كلام الكتاب لا حكماً عليك.',
      },
    ),
  ],
  autumn: [
    recipe(
      { zh: '百合粥', en: 'Lily-bulb porridge', ar: 'عصيدة بصلة الزنبق' },
      FROM_BOOK,
      {
        zh: '百合与米同煮成粥。书中另写把生百合切碎、用蜜窨过再下锅，并记有「一升」「一两」「三合」。蜜可以不用，这些量也不抄成你的食量。',
        en: 'Cook lily bulb with rice into porridge. The book also says to chop raw bulb, cure it with honey, then add it, and it records old measures. Honey is optional, and those measures are not your portion.',
        ar: 'اطبخ بصلة الزنبق مع الأرز عصيدة. الكتاب يذكر أيضاً تقطيعها وعسلها ومقادير قديمة. العسل اختياري، والمقادير ليست حصتك.',
      },
      {
        zh: '书中没有规定只在秋天吃。百合在食药物质目录里，本站按秋季偏燥、对应肺，放在这里。百合偏润。受凉后咳嗽、痰多清稀时，不要靠它。',
        en: 'The book does not limit this to autumn. Lily bulb is on the food-medicine list, and this site places it in autumn beside the lung season and dry air. It is moistening. Do not rely on it for a cough from cold with thin, clear phlegm.',
        ar: 'الكتاب لا يحصره في الخريف. بصلة الزنبق في قائمة الغذاء والدواء، والموقع يضعها في الخريف مع جفاف الهواء وفصل الرئة. هي مرطبة. لا تعتمد عليها لسعال البرد مع بلغم رقيق صاف.',
      },
    ),
    recipe(
      { zh: '甘蔗粥', en: 'Sugarcane porridge', ar: 'عصيدة قصب السكر' },
      FROM_BOOK,
      {
        zh: '甘蔗取汁，与米煮成粥。书中写「空心食之」，并写「治咳嗽虚热，口燥，涕浓，舌干」。',
        en: 'Press sugarcane juice and cook it with rice into porridge. The book says to eat it on an empty stomach, and writes that it treats cough from deficiency-heat, dry mouth, thick mucus, and a dry tongue.',
        ar: 'اعصر قصب السكر واطبخ العصير مع الأرز عصيدة. الكتاب يقول يؤكل على الريق، ويكتب أنه يعالج سعالاً من حرارة نقص وجفاف الفم ومخاطاً ثخيناً ولساناً جافاً.',
      },
      {
        zh: '「治咳嗽」是书中原文，不是给你的治疗。咳嗽加重、咯血要就医。血糖偏高的人少用甘蔗汁。放在秋季，是因为书中写到口燥，本站对上秋季偏燥，不是止咳药。',
        en: '“Treats cough” is the book’s sentence, not your treatment. A worsening cough or coughing blood needs a clinician. People with high blood sugar should go easy on the juice. It sits in autumn because the book mentions a dry mouth and this site matches that with dry autumn air. It is not cough medicine.',
        ar: '«يعالج السعال» جملة الكتاب لا علاجك. اشتداد السعال أو الدم مع السعال يحتاج طبيباً. من ارتفع سكره يخفف العصير. وضعناها في الخريف لأن الكتاب ذكر جفاف الفم. ليست دواء سعال.',
      },
    ),
    recipe(
      { zh: '胡麻粥', en: 'Sesame porridge', ar: 'عصيدة السمسم' },
      FROM_BOOK,
      {
        zh: '胡麻去皮，蒸熟再炒香，研出汁，与米同煮。书中记有「胡麻二合、米三合」，不抄成你的食量。黑芝麻即此胡麻一类，在食药物质目录里。',
        en: 'Remove the sesame skin, steam it, toast it fragrant, grind out the liquid, and cook that with rice. The book records two ge of sesame to three ge of rice. That is not your portion. Black sesame is this kind of seed and is on the food-medicine list.',
        ar: 'انزع قشر السمسم، بخره، حمّصه حتى تفوح رائحته، استخرج سائله واطبخه مع الأرز. الكتاب يذكر نسبة قديمة وليست حصتك. السمسم الأسود من هذا النوع وهو في قائمة الغذاء والدواء.',
      },
      {
        zh: '书中没有规定季节。本站因秋季空气偏燥、芝麻偏润，放在这里作示例，不是润燥药。',
        en: 'The book names no season. This site places it in autumn because the air is drier then and sesame is moistening. It is an example, not dryness medicine.',
        ar: 'الكتاب لا يسمي فصلاً. الموقع يضعها في الخريف لأن الهواء أجف والسمسم مرطب. هي مثال لا دواء جفاف.',
      },
    ),
  ],
  winter: [
    recipe(
      { zh: '山药粥', en: 'Chinese-yam porridge', ar: 'عصيدة اليام الصيني' },
      FROM_BOOK,
      {
        zh: '用淮山药打成末，与米同煮成粥。书中写「四六分配」「甚补下元」。这个比例不抄成你的食量。另一则山药粥用羊肉，并写「治虚劳骨蒸」，这里不收。',
        en: 'Grind Chinese yam and cook it with rice. The book says a four-to-six mix and “greatly supplements the lower source.” That ratio is not your portion. A second yam porridge in the book uses lamb and says it treats deficiency-consumption with steaming bones. That one is not included.',
        ar: 'اطحن اليام الصيني واطبخه مع الأرز. الكتاب يذكر نسبة أربعة إلى ستة و«يقوي الأصل السفلي كثيراً». النسبة ليست حصتك. عصيدة أخرى في الكتاب تضيف لحم الضأن وتقول إنها تعالج الضعف والحرارة العظمية، وهي غير مدرجة.',
      },
      {
        zh: '书中没有规定只在冬天吃。山药归脾、肺、肾经，本站按冬季封藏、对应肾，放在这里。湿盛中满或有实邪时慎用，见本站山药条。「甚补下元」是书中的话，不是给你的补肾结论。',
        en: 'The book does not limit this to winter. Yam enters the spleen, lung, and kidney channels, so this site places it in winter beside the kidney season. Be careful with marked damp fullness or an excess condition; see this site’s yam note. “Supplements the lower source” is the book’s phrase, not a judgment that your kidney needs tonifying.',
        ar: 'الكتاب لا يحصره في الشتاء. اليام يدخل الطحال والرئة والكلية، لذا يضعه الموقع في الشتاء. الحذر عند امتلاء رطب واضح أو حالة امتلاء؛ انظر ملاحظة اليام في الموقع. عبارة التقوية كلام الكتاب لا حكماً على كليتك.',
      },
    ),
    recipe(
      { zh: '山栗粥', en: 'Chestnut porridge', ar: 'عصيدة الكستناء' },
      FROM_BOOK,
      {
        zh: '栗子煮熟，揉成粉，与米同煮成粥。书中没有写药用剂量。',
        en: 'Boil chestnuts, rub them into a meal, and cook that with rice. The book gives no medicinal dose.',
        ar: 'اسلق الكستناء وافركها دقيقاً واطبخها مع الأرز. الكتاب لا يذكر جرعة دوائية.',
      },
      {
        zh: '书中没有规定季节。栗子是日常食物。本站按冬季宜温、宜藏，放在这里作食养示例，不是温补药。一次不要吃得过饱。',
        en: 'The book names no season. Chestnut is an ordinary food. This site places it in winter beside warmth and storing. It is not a warming tonic. Do not eat a large amount at one sitting.',
        ar: 'الكتاب لا يسمي فصلاً. الكستناء طعام عادي. الموقع يضعها في الشتاء مع الدفء والتخزين. ليست مقوياً دافئاً. لا تأكل كمية كبيرة دفعة واحدة.',
      },
    ),
    recipe(
      { zh: '牛乳粥', en: 'Milk porridge', ar: 'عصيدة الحليب' },
      FROM_BOOK,
      {
        zh: '先用粳米煮粥，半熟时去掉一些汤，加入牛乳再煮熟。书中写可再加酥一匙；没有酥可以不加。',
        en: 'Start a rice porridge. When it is half done, pour off some liquid, add milk, and finish cooking. The book allows a spoon of butter; without butter, leave it out.',
        ar: 'ابدأ عصيدة أرز. عند نصف النضج أزل بعض السائل وأضف الحليب وأتم الطبخ. الكتاب يسمح بملعقة سمن؛ إن لم يوجد فلا تضفه.',
      },
      {
        zh: '书中没有规定冬天，也没有写成治某病。牛乳是日常食物，本站放在冬季作温养示例。喝牛奶不舒服的人不要用。',
        en: 'The book does not assign this to winter or to treating a disease. Milk is an ordinary food, and this site uses it in winter as a warm food example. Skip it if milk disagrees with you.',
        ar: 'الكتاب لا يخصصها للشتاء ولا لعلاج مرض. الحليب طعام عادي، والموقع يضعها في الشتاء كمثال دافئ. إن أزعجك الحليب فلا تستخدمها.',
      },
    ),
  ],
}

export const TCM_LATE_SUMMER_RECIPES = [
  recipe(
    { zh: '薏苡粥', en: 'Job’s-tears porridge', ar: 'عصيدة الدمع' },
    FROM_BOOK,
    {
      zh: '薏苡仁淘净，与白米大约对半煮粥。书中写可加白糖一二匙；糖可以少放或不放。',
      en: 'Rinse job’s tears and cook them with about an equal amount of rice. The book allows a spoon or two of sugar; use less, or none.',
      ar: 'اغسل حب الدمع واطبخه مع كمية مقاربة من الأرز. الكتاب يسمح بملعقة أو اثنتين من السكر؛ يمكن التقليل أو الحذف.',
    },
    {
      zh: '书中没有写长夏。薏苡仁在食药物质目录里，本站按长夏湿热、食养宜清淡，放在这里。孕期先问医师再吃。它不能代替祛湿药。',
      en: 'The book does not mention late summer. Job’s tears are on the food-medicine list, and this site places them here beside humid late summer and light food. In pregnancy, ask a clinician first. This does not replace dampness-clearing medicine.',
      ar: 'الكتاب لا يذكر أواخر الصيف. حب الدمع في قائمة الغذاء والدواء، والموقع يضعه هنا مع الرطوبة والطعام الخفيف. في الحمل اسأل طبيباً أولاً. لا يغني عن دواء إزالة الرطوبة.',
    },
  ),
  recipe(
    { zh: '芡实粥', en: 'Foxnut porridge', ar: 'عصيدة الإيريال' },
    FROM_BOOK,
    {
      zh: '芡实去壳，新的研成膏，陈的打成粉，与粳米煮粥。书中写「益精气，强智力，聪耳目」，并记有各三合，不抄成你的食量。',
      en: 'Shell foxnuts. Fresh ones are ground to a paste, older ones to a powder, then cooked with rice. The book says this benefits essence, strengthens wit, and sharpens ears and eyes, and it records three ge of each. That amount is not your portion.',
      ar: 'قشّر الإيريال. الطازج يُطحن عجيناً والقديم مسحوقاً، ثم يُطبخ مع الأرز. الكتاب يذكر نفع الجوهر وتقوية الذهن وحدّة السمع والبصر ومقادير قديمة ليست حصتك.',
    },
    {
      zh: '书中没有写长夏。芡实在食药物质目录里，本站按健脾放在长夏。芡实收涩，大便干结、腹胀时少用。「益精气」是书中的话，不是给你的诊断。',
      en: 'The book does not mention late summer. Foxnut is on the food-medicine list, and this site places it here beside supporting the spleen. It is astringent, so go easy with dry stools or bloating. The line about essence is the book’s wording, not a judgment about you.',
      ar: 'الكتاب لا يذكر أواخر الصيف. الإيريال في قائمة الغذاء والدواء، والموقع يضعه هنا مع دعم الطحال. هو قابض، فخفف عند جفاف البراز أو الانتفاخ. عبارة الجوهر كلام الكتاب لا حكماً عليك.',
    },
  ),
  recipe(
    { zh: '赤小豆粥', en: 'Adzuki porridge', ar: 'عصيدة الفاصوليا الحمراء الصغيرة' },
    FROM_BOOK,
    {
      zh: '书中这一款名叫芜蒌粥：先把赤小豆煮烂，再倒进刚煮开的米粥里同煮。',
      en: 'The book calls this wulou porridge: boil adzuki beans soft, then stir them into rice porridge just as it starts to boil, and cook them together.',
      ar: 'يسميها الكتاب عصيدة وولو: اسلق الفاصوليا الحمراء الصغيرة حتى تلين، ثم أضفها إلى عصيدة الأرز عند بدء الغليان واطبخهما معاً.',
    },
    {
      zh: '书中没有写长夏。赤小豆在食药物质目录里，本站按食养利湿放在这里。同书另有腊月「口数粥」，写能除瘟疫、辟厉鬼，那是民俗说法，这里不收。口干明显的人少用。',
      en: 'The book does not mention late summer. Adzuki is on the food-medicine list, and this site places it here as a light, damp-easing food. Another porridge in the same book, for the twelfth month, claims to drive off plague and ghosts. That is folk wording and is not included. Go easy if your mouth is clearly dry.',
      ar: 'الكتاب لا يذكر أواخر الصيف. الفاصوليا الحمراء الصغيرة في قائمة الغذاء والدواء، والموقع يضعها هنا كطعام خفيف يخفف الرطوبة. عصيدة أخرى في الكتاب لشهر الثاني عشر تزعم دفع الوباء والأشباح، وهي قول شعبي غير مدرج. خفف إن كان فمك جافاً بوضوح.',
    },
  ),
]

