/**
 * 治未病：单药与经典处方的教育卡片。
 * 单药性味、功能与用量记载：《中国药典》2025年版一部已核对的黄芪、党参、枸杞子、山药、菊花；
 * 茯苓的功能句按2020年版一部核对，并标明版本。2025年版自2025年10月1日起施行（2025年第29号公告）。
 * 用量是药材标准里的记载，不抄成读者的服量。
 * 食药物质：卫法监发〔2002〕51号；党参、黄芪见2023年第9号公告，适量，婴幼儿、孕产妇和慢性病用药者先问医师。
 * 处方主治按原书引用。药典成方的克数、一次几袋、一日几次不抄成读者的服法。
 * 未经当面辨证，不能作为用药依据。
 */
const NOT_A_DOSE = {
  zh: '这个用量是药典对药材的记载，不是你的一次服量。',
  en: 'That amount is the pharmacopoeia’s record for the medicinal material. It is not your dose.',
  ar: 'هذا المقدار سجل الدستور الدوائي للمادة الطبية. ليس جرعتك.',
}

const NOT_RX = {
  zh: '未经当面辨证，不能作为用药依据。',
  en: 'Without an in-person pattern judgment, this cannot be the basis for taking a medicine.',
  ar: 'بدون تمييز النمط حضورياً، لا يصلح هذا أساساً لتناول دواء.',
}

export const TCM_HERB_SOURCE = {
  zh: '这六味药的性味和功能，黄芪、党参、枸杞子、山药、菊花依据《中国药典》2025年版一部已能核对的正文；茯苓的功能句依据2020年版一部，因为本页还没有逐字核对2025年版茯苓正文。2025年版自2025年10月1日起施行。药典里的克数不抄成你的服量。《内经》没有这六味的专条，不把药典句子回写成经文。能进食品的，另按卫法监发〔2002〕51号和2023年第9号公告。在食药物质名单里，只说明可以按传统进入食品，不说明它能治你的病。',
  en: 'Nature, flavor, and actions for astragalus, codonopsis, goji, Chinese yam, and chrysanthemum follow text that can be checked in the 2025 Chinese Pharmacopoeia, volume 1. Poria’s action line follows the 2020 volume, because this page has not checked the 2025 poria monograph word for word. The 2025 edition took effect on 1 October 2025. Gram amounts in the pharmacopoeia are not copied as your dose. The Neijing has no monograph for these six, so those sentences are not written back into it. What may enter food follows the 2002 list and the 2023 announcement. Being on that list means it may enter food by tradition. It does not mean it treats your illness.',
  ar: 'الطبع والوظيفة للهوانغ تشي والدانغ شين والغوجي واليام والأقحوان من نص يمكن مراجعته في دستور 2025. جملة الفولينغ من دستور 2020 لأن هذه الصفحة لم تراجع مادة 2025 كلمة كلمة. دستور 2025 نافذ من 1 أكتوبر 2025. الغرامات ليست جرعتك. الكلاسيكيات بلا دراسة مستقلة لهذه الست، فلا تُعاد الجمل إليها. ما يدخل الطعام يتبع قائمة 2002 وإعلان 2023. الوجود في القائمة يعني الدخول التقليدي إلى الطعام، لا علاج مرضك.',
}

export const TCM_RX_SOURCE = {
  zh: '六首方的主治按原书引用。《小儿药证直诀》里的方名是地黄丸，后来才叫六味地黄丸。玉屏风散能核对的是《丹溪心法》一路的自汗，更早的《究原方》多由别的书转引。书里的两、钱、分，以及《中国药典》2025年版成方制剂的一次几克、一日几次，都不抄成你的服法。含人参的方是药品传统，人参不在已公布的食药物质名单里，也不进本站四季页的粥。',
  en: 'The six formulas are quoted from the books that record them. In the Key to Children’s Syndromes the name is Rehmannia Pill; “Six-Ingredient Rehmannia Pill” is the later name. For Jade Screen Powder, the sweating use that can be checked is the Danxi line; the earlier Jiuyuan Fang is mostly quoted by other books. Liang, qian, and fen in the books, and the “so many grams, so many times a day” on 2025 pharmacopoeia products, are not copied as your dose. Formulas that contain ginseng belong to the medicine tradition. Ginseng is not on the published food-medicine lists, and it is not in the porridges on the seasons page.',
  ar: 'الوصفات الست تُقتبس من الكتب التي دونتها. في كتاب الأطفال الاسم حبة الريهمانيا، واسم «الحبات الست» لاحق. لمسحوق شاشة اليشم، استعمال التعرق الذي يمكن مراجعته هو سطر دانشى، وكتاب جيويوان الأقدم يُنقل غالباً عبر كتب أخرى. المقادير القديمة و«كذا غراماً كذا مرة» في مستحضرات دستور 2025 ليست جرعتك. الوصفات التي فيها جينسنغ من تقليد الدواء. الجينسنغ ليس في قوائم الغذاء والدواء المنشورة، ولا في عصائد صفحة الفصول.',
}

export const TCM_HERBS = [
  {
    id: 'huangqi',
    name: '黄芪',
    title: { zh: '黄芪', en: 'Astragalus root', ar: 'جذر الهوانغ تشي' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '《内经》没有黄芪专条',
      en: 'The Neijing has no astragalus monograph',
      ar: 'لا دراسة للهوانغ تشي في الكلاسيكيات',
    },
    classic: {
      zh: '不要把药典的「补气升阳、固表止汗」写成《素问》里的原句。它可以和体质识别里气虚质的教育卡片一起读，那是对照，不是测出气虚就吃黄芪。',
      en: 'Do not write the pharmacopoeia’s “raise qi and secure the exterior” back into Suwen as an original line. It can be read beside the qi-deficiency education card. That is comparison. A qi-deficiency score is not an instruction to take astragalus.',
      ar: 'لا تُعد «رفع تشي وتثبيت الخارج» إلى سوين كأنها جملة أصلية. يمكن قراءتها بجانب بطاقة نقص تشي. هذه مقارنة. درجة نقص تشي ليست أمراً بتناول الهوانغ تشي.',
    },
    standardFrom: {
      zh: '《中国药典》2025年版一部 · 黄芪',
      en: 'Chinese Pharmacopoeia 2025, volume 1 · Astragalus',
      ar: 'دستور الأدوية الصيني 2025، الجزء 1 · هوانغ تشي',
    },
    standard: {
      zh: '甘，微温。归肺、脾经。补气升阳，固表止汗，利水消肿，生津养血，行滞通痹，托毒排脓，敛疮生肌。用于气虚乏力，食少便溏，中气下陷，久泻脱肛，便血崩漏，表虚自汗，气虚水肿，内热消渴，血虚萎黄，半身不遂，痹痛麻木，痈疽难溃，久溃不敛。用量记载 9～30g。这些「用于」是药典的主治范围，不是对你的判断。',
      en: 'Sweet, slightly warm. Enters the lung and spleen channels. The monograph lists raising qi, securing the exterior, stopping sweating, easing swelling, and related actions, for patterns it names such as qi deficiency, spontaneous sweating from an unsecured exterior, and sinking of middle qi. The recorded amount is 9–30 g. Those “used for” lines are the monograph’s range. They are not a judgment about you.',
      ar: 'حلو، دافئ قليلاً. يدخل قناتي الرئة والطحال. الدراسة تسرد رفع تشي وتثبيت الخارج ووقف التعرق وتخفيف التورم وغيرها، لحالات تسميها مثل نقص تشي والتعرق التلقائي وهبوط تشي الوسط. المقدار المدون 9–30 غ. جمل «يُستخدم لـ» نطاق الدراسة، وليست حكماً عليك.',
    },
    note: {
      zh: `${NOT_A_DOSE.zh}2023年第9号公告把黄芪列入食药物质，要求适量；婴幼儿、孕妇、乳母和慢性病用药者先问医师。表实有热、腹胀便结时，不要自行拿黄芪进补；这是本站的提醒，不是上面药典正文里的注意项。${NOT_RX.zh}`,
      en: `${NOT_A_DOSE.en} The 2023 announcement lists astragalus as a food-medicine substance, for moderate use. Infants, pregnancy, lactation, and people on long-term medicine should ask a physician first. If there is an exterior excess with fever, or abdominal fullness and hard stools, do not start astragalus on your own as a tonic. That reminder is this site’s. It is not a caution line in the monograph quoted above. ${NOT_RX.en}`,
      ar: `${NOT_A_DOSE.ar} إعلان 2023 يدرج الهوانغ تشي مادة غذاء ودواء، باعتدال. الرضع والحمل والإرضاع ومن يستخدم دواءً مزمناً يسألون طبيباً أولاً. عند امتلاء الخارج مع حمى، أو امتلاء البطن وبراز صلب، لا تبدأ الهوانغ تشي من تلقاء نفسك كمقوٍ. هذا تنبيه الموقع، وليس بند حذر في الدراسة المقتبسة. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'dangshen',
    name: '党参',
    title: { zh: '党参', en: 'Codonopsis root', ar: 'جذر الدانغ شين' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '《内经》没有党参专条',
      en: 'The Neijing has no codonopsis monograph',
      ar: 'لا دراسة للدانغ شين في الكلاسيكيات',
    },
    classic: {
      zh: '党参是后世常用的补气药，不能写成《内经》已经点名的药。它也不是人参的无条件替身。',
      en: 'Codonopsis is a later qi-supplementing medicinal. It cannot be written as a drug the Neijing already named. It is also not an unconditional substitute for ginseng.',
      ar: 'الدانغ شين دواء لاحق لتكملة تشي. لا يُكتب كأن الكلاسيكيات سمّته. وهو ليس بديلاً غير مشروط للجينسنغ.',
    },
    standardFrom: {
      zh: '《中国药典》2025年版一部 · 党参',
      en: 'Chinese Pharmacopoeia 2025, volume 1 · Codonopsis',
      ar: 'دستور 2025، الجزء 1 · دانغ شين',
    },
    standard: {
      zh: '甘，平。归脾、肺经。健脾益肺，养血生津。用于脾肺气虚，食少倦怠，咳嗽虚喘，气血不足，面色萎黄，心悸气短，津伤口渴，内热消渴。用量记载 9～30g。注意：不宜与藜芦同用。',
      en: 'Sweet, neutral. Enters the spleen and lung channels. Strengthens the spleen and benefits the lung, nourishes blood and generates fluid. The monograph names spleen-lung qi deficiency, poor appetite, fatigued cough and wheeze, and shortage of qi and blood, among others. The recorded amount is 9–30 g. Caution: do not use it together with Veratrum.',
      ar: 'حلو، متعادل. يدخل قناتي الطحال والرئة. يقوي الطحال وينفع الرئة ويغذي الدم ويولد السوائل. الدراسة تسمي نقص تشي الطحال والرئة وضعف الشهية والسعال المتعب ونقص تشي والدم وغيرها. المقدار المدون 9–30 غ. الحذر: لا يُستخدم مع الفيراترم.',
    },
    note: {
      zh: `${NOT_A_DOSE.zh}2023年第9号公告把党参列入食药物质，要求和黄芪相同：适量；婴幼儿、孕妇、乳母和慢性病用药者先问医师。咳嗽气喘加重、痰中带血，去就医，不要自行用党参顶过去。${NOT_RX.zh}`,
      en: `${NOT_A_DOSE.en} The 2023 announcement lists codonopsis as a food-medicine substance on the same terms as astragalus: moderate use, and infants, pregnancy, lactation, and people on long-term medicine ask a physician first. If cough and wheeze worsen, or there is blood in the sputum, seek care. Do not use codonopsis on your own to push through that. ${NOT_RX.en}`,
      ar: `${NOT_A_DOSE.ar} إعلان 2023 يدرج الدانغ شين كالهوانغ تشي: باعتدال، والرضع والحمل والإرضاع ومن يستخدم دواءً مزمناً يسألون طبيباً. إن اشتد السعال أو ظهر دم في البلغم، اطلب الرعاية. لا تستخدم الدانغ شين وحدك لتجاوز ذلك. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'gouqi',
    name: '枸杞子',
    title: { zh: '枸杞子', en: 'Goji fruit', ar: 'ثمر الغوجي' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '《内经》没有枸杞子专条',
      en: 'The Neijing has no goji monograph',
      ar: 'لا دراسة لثمر الغوجي في الكلاسيكيات',
    },
    classic: {
      zh: '四季页的枸杞粥来自《遵生八笺》，是食物示例。那一页不把这味药写成治眼病的方。',
      en: 'The goji porridge on the seasons page comes from Eight Discourses on Living Well. It is a food example. That page does not turn this fruit into a formula for eye disease.',
      ar: 'عصيدة الغوجي في صفحة الفصول من الخطابات الثمانية. هي مثال غذائي. تلك الصفحة لا تجعل الثمر وصفة لمرض العين.',
    },
    standardFrom: {
      zh: '《中国药典》2025年版一部 · 枸杞子；卫法监发〔2002〕51号',
      en: 'Chinese Pharmacopoeia 2025, volume 1 · Goji; 2002 food-medicine list',
      ar: 'دستور 2025 · غوجي؛ قائمة 2002',
    },
    standard: {
      zh: '甘，平。归肝、肾经。滋补肝肾，益精明目。用于虚劳精亏，腰膝酸痛，眩晕耳鸣，阳痿遗精，内热消渴，血虚萎黄，目昏不明。用量记载 6～12g。药典这一条没有另列「注意」。枸杞子在 2002 年既是食品又是药品的名单里。',
      en: 'Sweet, neutral. Enters the liver and kidney channels. The monograph says it supplements the liver and kidney and benefits the essence and eyes, for patterns it names such as aching waist and knees, dizziness, tinnitus, and dim vision. The recorded amount is 6–12 g. This monograph, as checked, has no separate caution line. Goji is on the 2002 list of substances that are both food and medicine.',
      ar: 'حلو، متعادل. يدخل قناتي الكبد والكلية. الدراسة تقول إنه يغذي الكبد والكلية وينفع الجوهر والعين، لحالات تسميها مثل ألم الخصر والركبة والدوار وطنين الأذن وضعف البصر. المقدار المدون 6–12 غ. هذه الدراسة كما رُاجعت بلا بند حذر منفصل. الغوجي في قائمة 2002 للمواد التي هي غذاء ودواء معاً.',
    },
    note: {
      zh: `${NOT_A_DOSE.zh}习惯上脾虚便溏、外邪实热少用；这不是药典这一条的注意项，四季页的枸杞粥仍保留这句提醒。目昏加重、腰膝酸痛持续，要就医核对，不要只加枸杞。${NOT_RX.zh}`,
      en: `${NOT_A_DOSE.en} By custom, people go easy when the spleen is weak with loose stools, or when an external heat illness is present. That is not a caution line in this monograph. The goji porridge on the seasons page still keeps the reminder. If dim vision worsens or the waist and knees keep aching, seek care. Do not only add goji. ${NOT_RX.en}`,
      ar: `${NOT_A_DOSE.ar} بالعادة يُخفف عند ضعف الطحال مع براز لين، أو عند مرض حراري ظاهر. هذا ليس بند حذر في الدراسة. عصيدة الغوجي في الفصول تُبقي التنبيه. إن اشتد ضعف البصر أو استمر ألم الخصر والركبة، اطلب الرعاية. لا تكتفِ بإضافة الغوجي. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'shanyao',
    name: '山药',
    title: { zh: '山药', en: 'Chinese yam', ar: 'اليام الصيني' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '《内经》没有山药专条',
      en: 'The Neijing has no Chinese-yam monograph',
      ar: 'لا دراسة لليام في الكلاسيكيات',
    },
    classic: {
      zh: '四季页的山药粥用的是《遵生八笺》里的食物做法。书中「甚补下元」是那本书的话，不是给你的补肾结论。',
      en: 'The yam porridge on the seasons page follows the food method in Eight Discourses. “Greatly supplements the lower source” is that book’s sentence. It is not a conclusion that your kidney needs supplementing.',
      ar: 'عصيدة اليام في الفصول تتبع طريقة الطعام في الخطابات الثمانية. «تكمل المصدر السفلي بقوة» جملة ذلك الكتاب. ليست خلاصة أن كليتك تحتاج تكملة.',
    },
    standardFrom: {
      zh: '《中国药典》2025年版一部 · 山药；卫法监发〔2002〕51号',
      en: 'Chinese Pharmacopoeia 2025, volume 1 · Chinese yam; 2002 list',
      ar: 'دستور 2025 · يام؛ قائمة 2002',
    },
    standard: {
      zh: '甘，平。归脾、肺、肾经。补脾养胃，生津益肺，补肾涩精。用于脾虚食少，久泻不止，肺虚喘咳，肾虚遗精，带下，尿频，虚热消渴。麸炒山药补脾健胃，用于脾虚食少、泄泻便溏、白带过多。用量记载 15～30g。山药在 2002 年食药物质名单里。',
      en: 'Sweet, neutral. Enters the spleen, lung, and kidney channels. The monograph lists supplementing the spleen and stomach, generating fluid, benefiting the lung, and securing essence, for patterns it names such as poor appetite from spleen deficiency and long diarrhea. Bran-fried yam is listed for a weak spleen, loose stools, and excessive vaginal discharge. The recorded amount is 15–30 g. Chinese yam is on the 2002 food-medicine list.',
      ar: 'حلو، متعادل. يدخل قنوات الطحال والرئة والكلية. الدراسة تسرد تقوية الطحال والمعدة وتوليد السوائل ونفع الرئة وتثبيت الجوهر، لحالات تسميها مثل ضعف الشهية من نقص الطحال والإسهال الطويل. اليام المحمص بالنخالة يُذكر لضعف الطحال والبراز اللين والإفراز الزائد. المقدار المدون 15–30 غ. اليام في قائمة 2002.',
    },
    note: {
      zh: `${NOT_A_DOSE.zh}湿盛中满或有实邪时少用；这是本站山药条的提醒，不是药典这一条的注意项。喘咳、久泻、尿频要就医核对。${NOT_RX.zh}`,
      en: `${NOT_A_DOSE.en} Go easy when dampness is abundant with fullness, or when there is an excess pathogen. That is this site’s yam reminder. It is not a caution line in this monograph. Wheeze with cough, long diarrhea, or frequent urine needs a clinician to check. ${NOT_RX.en}`,
      ar: `${NOT_A_DOSE.ar} خفف عند كثرة الرطوبة مع الامتلاء، أو عند وجود عامل ضار زائد. هذا تنبيه الموقع لليام، وليس بند حذر في الدراسة. السعال مع الأزيز أو الإسهال الطويل أو كثرة البول يحتاج فحص طبيب. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'fuling',
    name: '茯苓',
    title: { zh: '茯苓', en: 'Poria', ar: 'فولينغ' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '《内经》没有茯苓专条',
      en: 'The Neijing has no poria monograph',
      ar: 'لا دراسة للفولينغ في الكلاسيكيات',
    },
    classic: {
      zh: '茯苓常出现在四君子汤、逍遥散、地黄丸里。那些方的句子见经典处方，不在这里合成「你该吃茯苓」。',
      en: 'Poria often appears in Four Gentlemen Decoction, Free and Easy Wanderer Powder, and the Rehmannia pill. Those books’ sentences are on the formulas tab. They are not combined here into “you should take poria.”',
      ar: 'الفولينغ يرد كثيراً في حساء الرجال الأربعة ومسحوق التجوال الحر وحبة الريهمانيا. جمل تلك الكتب في صفحة الوصفات. لا تُجمع هنا إلى «ينبغي أن تتناول الفولينغ».',
    },
    standardFrom: {
      zh: '《中国药典》2020年版一部 · 茯苓；卫法监发〔2002〕51号',
      en: 'Chinese Pharmacopoeia 2020, volume 1 · Poria; 2002 list',
      ar: 'دستور 2020 · فولينغ؛ قائمة 2002',
    },
    standard: {
      zh: '本条按 2020 年版一部核对，不把它冒充成已逐字核对的 2025 年版正文。甘、淡，平。归心、肺、脾、肾经。利水渗湿，健脾，宁心。用于水肿尿少，痰饮眩悸，脾虚食少，便溏泄泻，心神不安，惊悸失眠。用量记载 10～15g。茯苓在 2002 年食药物质名单里。',
      en: 'This entry is checked against the 2020 volume. It is not presented as a word-for-word check of the 2025 monograph. Sweet and bland, neutral. Enters the heart, lung, spleen, and kidney channels. Drains dampness, strengthens the spleen, and calms the heart. The monograph names scanty urine with swelling, phlegm-rheum with dizziness and palpitation, poor appetite, loose stools, and restless sleep. The recorded amount is 10–15 g. Poria is on the 2002 food-medicine list.',
      ar: 'هذه المادة رُوجعت على دستور 2020. لا تُعرض كمراجعة كلمة كلمة لدستور 2025. حلو وخفيف، متعادل. يدخل قنوات القلب والرئة والطحال والكلية. يدر الرطوبة ويقوي الطحال ويهدئ القلب. الدراسة تسمي قلة البول مع التورم والبلغم مع الدوار والخفقان وضعف الشهية والبراز اللين واضطراب النوم. المقدار المدون 10–15 غ. الفولينغ في قائمة 2002.',
    },
    note: {
      zh: `${NOT_A_DOSE.zh}水肿突然加重、胸闷喘、尿很少，按病去就医，不要自行加茯苓利水。${NOT_RX.zh}`,
      en: `${NOT_A_DOSE.en} If swelling suddenly worsens, there is chest tightness and wheeze, or urine becomes very scanty, seek care for an illness. Do not add poria on your own to drive water out. ${NOT_RX.en}`,
      ar: `${NOT_A_DOSE.ar} إن اشتد التورم فجأة، أو ضاق الصدر مع أزيز، أو قلّ البول جداً، اطلب الرعاية لمرض. لا تضف الفولينغ وحدك لإدرار الماء. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'juhua',
    name: '菊花',
    title: { zh: '菊花', en: 'Chrysanthemum flower', ar: 'زهرة الأقحوان' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '《内经》没有菊花专条',
      en: 'The Neijing has no chrysanthemum monograph',
      ar: 'لا دراسة للأقحوان في الكلاسيكيات',
    },
    classic: {
      zh: '四季页的菊苗粥用的是甘菊嫩叶，书中写「清目宁心」。那是粥，不是这一味干花的药典主治。',
      en: 'The chrysanthemum-shoot porridge on the seasons page uses tender sweet-chrysanthemum leaves. The book says it clears the eyes and calms the heart. That is a porridge. It is not the pharmacopoeia indication for this dried flower.',
      ar: 'عصيدة براعم الأقحوان في الفصول تستخدم أوراقاً غضة. الكتاب يقول إنها تصفي العين وتهدئ القلب. تلك عصيدة. ليست استطباب الدستور لهذه الزهرة المجففة.',
    },
    standardFrom: {
      zh: '《中国药典》2025年版一部 · 菊花；卫法监发〔2002〕51号',
      en: 'Chinese Pharmacopoeia 2025, volume 1 · Chrysanthemum; 2002 list',
      ar: 'دستور 2025 · أقحوان؛ قائمة 2002',
    },
    standard: {
      zh: '甘、苦，微寒。归肺、肝经。散风清热，平肝明目，清热解毒。用于风热感冒，头痛眩晕，目赤肿痛，眼目昏花，疮痈肿毒。用量记载 5～10g。菊花在 2002 年食药物质名单里。',
      en: 'Sweet and bitter, slightly cold. Enters the lung and liver channels. The monograph lists scattering wind, clearing heat, calming the liver, and brightening the eyes, for patterns it names such as wind-heat cold, headache, dizziness, and red painful eyes. The recorded amount is 5–10 g. Chrysanthemum is on the 2002 food-medicine list.',
      ar: 'حلو ومر، بارد قليلاً. يدخل قناتي الرئة والكبد. الدراسة تسرد تبديد الريح وتصفية الحر وتهدئة الكبد وإضاءة العين، لحالات تسميها مثل برد الريح والحر والصداع والدوار واحمرار العين المؤلم. المقدار المدون 5–10 غ. الأقحوان في قائمة 2002.',
    },
    note: {
      zh: `${NOT_A_DOSE.zh}气虚胃寒、食少泄泻少用；这是本站四季菊苗粥里已有的提醒，不把它写成药典注意项。目赤肿痛、疮痈，要就医，不要只泡菊花。${NOT_RX.zh}`,
      en: `${NOT_A_DOSE.en} Go easy with a cold, weak stomach and poor appetite with loose stools. That reminder is already on the seasons page for the shoot porridge. It is not written here as a pharmacopoeia caution line. Red, swollen, painful eyes, or sores and abscesses, need care. Do not only steep chrysanthemum. ${NOT_RX.en}`,
      ar: `${NOT_A_DOSE.ar} خفف عند برودة المعدة وضعفها مع قلة الأكل والبراز اللين. هذا التنبيه موجود في عصيدة البراعم. لا يُكتب هنا كبند حذر في الدستور. العين الحمراء المتورمة المؤلمة أو القروح تحتاج رعاية. لا تكتفِ بنقع الأقحوان. ${NOT_RX.ar}`,
    },
  },
]

export const TCM_PRESCRIPTIONS = [
  {
    id: 'yupingfeng',
    name: '玉屏风散',
    title: { zh: '玉屏风散', en: 'Jade Screen Powder', ar: 'مسحوق شاشة اليشم' },
    classicFrom: {
      zh: '《丹溪心法》；《究原方》多由别的书转引',
      en: 'Danxi’s Heart Method; Jiuyuan Fang is mostly quoted elsewhere',
      ar: 'طريقة قلب دانشى؛ جيويوان يُنقل غالباً عبر كتب أخرى',
    },
    classic: {
      zh: '《丹溪心法》把玉屏风散放在自汗，药物是防风、黄芪、白术。书中有各一两、白术二两、每服三钱这一类记载，不抄成你的每次服量。更早的《究原方》今多由《医方类聚》等书转引，句子是治腠理不密、易于感冒。两处配比并不相同。本页不教你自己抓这三味来煎。',
      en: 'Danxi’s Heart Method places Jade Screen Powder under spontaneous sweating. The drugs are saposhnikovia, astragalus, and atractylodes. The book’s records include amounts such as one liang each and two liang of atractylodes, and three qian a dose. Those are not copied as your dose. The earlier Jiuyuan Fang is now mostly quoted by books such as the Collected Classified Formulas, with a line about loose interstices and catching cold easily. The two ratios are not the same. This page does not teach you to assemble and boil the three yourself.',
      ar: 'طريقة دانشى تضع المسحوق تحت التعرق التلقائي. الأدوية سابوشنيكوفيا وهوانغ تشي وأتراكتيلودس. في الكتاب مقادير مثل ليانغ لكل منهما واثنان للأتراكتيلودس وثلاثة تشيان للجرعة. لا تُنسخ جرعتك. كتاب جيويوان الأقدم يُنقل اليوم غالباً عبر كتب مثل مجموعة الوصفات المصنفة، بجملة عن مسام رخوة وسهولة الزكام. النسبتان ليستا واحدة. هذه الصفحة لا تعلّمك أن تجمع الثلاثة وتغليها بنفسك.',
    },
    standardFrom: {
      zh: '《中国药典》2025年版 · 玉屏风成方制剂',
      en: 'Chinese Pharmacopoeia 2025 · Jade Screen products',
      ar: 'دستور 2025 · مستحضرات شاشة اليشم',
    },
    standard: {
      zh: '药典收载玉屏风颗粒等成方，功能是益气、固表、止汗，用于表虚不固，自汗恶风，面色㿠白，或体虚易感风邪。制剂有自己的制法，以及一次几袋、一日几次。那是该制剂的用法，不是把古方的两、钱换算成你今天的剂量。',
      en: 'The pharmacopoeia carries finished products such as Jade Screen granules. Their action is to boost qi, secure the exterior, and stop sweating, for an unsecured exterior, spontaneous sweating with aversion to wind, a pale face, or catching wind easily when weak. Each product has its own method and its own “so many bags, so many times a day.” That is the labeled use of that product. It is not a conversion of the old liang and qian into your dose today.',
      ar: 'الدستور يضم مستحضرات جاهزة مثل حبيبات شاشة اليشم. وظيفتها تقوية تشي وتثبيت الخارج ووقف التعرق، لخارج غير مثبت وتعرق تلقائي مع كره الريح وشحوب الوجه أو سهولة الإصابة بالريح عند الضعف. لكل مستحضر صنعته و«كذا كيساً كذا مرة». هذا استعمال ذلك المستحضر المدون. ليس تحويلاً للمقادير القديمة إلى جرعتك اليوم.',
    },
    note: {
      zh: `可以和体质识别里气虚、容易自汗的教育卡片一起读，不是测出气虚就吃玉屏风。正在发热、咽痛时不要自行固表。${NOT_RX.zh}`,
      en: `It can be read beside the education card for qi deficiency and easy spontaneous sweating. A qi-deficiency score is not an instruction to take Jade Screen. Do not secure the exterior on your own while you have a fever or a sore throat. ${NOT_RX.en}`,
      ar: `يمكن قراءته بجانب بطاقة نقص تشي وسهولة التعرق. درجة نقص تشي ليست أمراً بتناول شاشة اليشم. لا تثبت الخارج وحدك وأنت محموم أو حلقك يؤلم. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'liuwei',
    name: '六味地黄丸',
    title: { zh: '六味地黄丸', en: 'Six-Ingredient Rehmannia Pill', ar: 'حبة الريهمانيا ذات المكونات الستة' },
    classicFrom: {
      zh: '《小儿药证直诀》· 地黄丸',
      en: 'Key to Children’s Syndromes · Rehmannia Pill',
      ar: 'مفتاح أعراض الأطفال · حبة الريهمانيا',
    },
    classic: {
      zh: '书中的方名是地黄丸，不是「六味」。原文写治肾怯失音、囟开不合、神不足、目中白睛多、面色㿠白。药物是熟地黄、山萸肉、干山药、泽泻、牡丹皮、白茯苓。八钱、四钱、三钱，以及炼蜜丸如梧子大、温水化下三丸，是书里的记录，不抄成你的或孩子的每次服量。',
      en: 'The book’s name for the formula is Rehmannia Pill, not “Six-Ingredient.” The text says it treats kidney timidity with loss of voice, an unclosed fontanel, insufficient spirit, too much white of the eye, and a pale face. The drugs are prepared rehmannia, cornus, dried yam, alisma, moutan, and white poria. The eight qian, four qian, three qian, the honey pill the size of a seed, and three pills in warm water are the book’s record. They are not copied as your dose or a child’s dose.',
      ar: 'اسم الوصفة في الكتاب حبة الريهمانيا، لا «الستة». النص يقول إنها تعالج خوف الكلية مع فقد الصوت، واليافوخ غير المغلق، ونقص الروح، وكثرة بياض العين، وشحوب الوجه. الأدوية ريهمانيا محضرة وكورنوس ويام مجفف وأليزما وموتان وفولينغ أبيض. الثمانية والأربعة والثلاثة تشيان، وحبة العسل بحجم البذرة، وثلاث حبات في ماء دافئ، سجل الكتاب. لا تُنسخ جرعتك أو جرعة طفل.',
    },
    standardFrom: {
      zh: '《中国药典》2025年版 · 六味地黄丸',
      en: 'Chinese Pharmacopoeia 2025 · Six-Ingredient Rehmannia Pill',
      ar: 'دستور 2025 · حبة الريهمانيا ذات الستة',
    },
    standard: {
      zh: '药典成方的功能是滋阴补肾，用于肾阴亏损，头晕耳鸣，腰膝酸软，骨蒸潮热，盗汗遗精，消渴。制剂写明水丸、蜜丸一次几克、一日 2 次。那是这个上市制剂的用法，不是《小儿药证直诀》的三丸。',
      en: 'The pharmacopoeia product’s action is to enrich yin and supplement the kidney, for kidney-yin depletion, dizziness and tinnitus, aching waist and knees, steaming bone and tidal fever, night sweats and seminal emission, and wasting-thirst. The product states how many grams of water pill or honey pill, twice a day. That is the labeled use of the marketed pill. It is not the three pills in the Key to Children’s Syndromes.',
      ar: 'وظيفة مستحضر الدستور تغذية الين وتكميل الكلية، لنقص يين الكلية والدوار والطنين وألم الخصر والركبة وحمى العظم والمد والجزر وتعرق الليل وضياع المني والضمور العطش. المستحضر يحدد غرامات حبة الماء أو العسل مرتين في اليوم. هذا الاستعمال المدون للحبة المسوقة. ليس الحبات الثلاث في كتاب الأطفال.',
    },
    note: {
      zh: `原书是儿科方。后来用得更广，并不等于你或孩子现在就该吃。耳鸣、潮热、口渴多尿要就医核对，不要只当成肾阴虚。${NOT_RX.zh}`,
      en: `The original book is a pediatric formula. Later use became wider. That does not mean you or a child should take it now. Tinnitus, tidal fever, or thirst with lots of urine needs a clinician to check. Do not treat it only as kidney-yin deficiency. ${NOT_RX.en}`,
      ar: `الكتاب الأصلي للأطفال. الاستعمال اللاحق اتسع. هذا لا يعني أنك أو طفلاً يجب أن تتناوله الآن. الطنين أو حمى المد أو العطش مع كثرة البول يحتاج فحص طبيب. لا تجعله فقط نقص يين الكلية. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'sijunzi',
    name: '四君子汤',
    title: { zh: '四君子汤', en: 'Four Gentlemen Decoction', ar: 'حساء الرجال الأربعة' },
    classicFrom: {
      zh: '《太平惠民和剂局方》',
      en: 'Formulary of the Pharmacy of the Taiping Era',
      ar: 'وصفات صيدلية عصر تايبينغ',
    },
    classic: {
      zh: '「治荣卫气虚，脏腑怯弱。心腹胀满，全不思食，肠鸣泄泻，呕哕吐逆，大宜服之。」药物是人参、白术、白茯苓、甘草。原文用「荣卫」。书中有各等分、每服二钱的记载，不抄成你的每次服量。',
      en: '“Treats deficiency of nutritive and defensive qi, and timid organs. The heart and abdomen are full and distended, there is no desire to eat at all, the intestines rumble and diarrhea occurs, and there is retching and vomiting. It is greatly suitable.” The drugs are ginseng, atractylodes, white poria, and licorice. The book writes “rong-wei.” It also records equal parts and two qian a dose. That is not copied as your dose.',
      ar: '«يعالج نقص تشي التغذية والدفاع وضعف الأعضاء. يمتلئ الصدر والبطن، ولا رغبة في الأكل، وتقرقر الأمعاء ويحدث إسهال وقيء.» الأدوية جينسنغ وأتراكتيلودس وفولينغ أبيض وعرقسوس. الكتاب يكتب «رونغ وي». وفيه أجزاء متساوية وتشيانان للجرعة. لا تُنسخ جرعتك.',
    },
    standardFrom: {
      zh: '原书即出处；不另把教材主治写成标准',
      en: 'The book is the source; a textbook indication is not turned into the standard',
      ar: 'الكتاب هو المصدر؛ استطباب الكتاب التعليمي لا يُجعل معياراً',
    },
    standard: {
      zh: '这张方不是前面单药那种药典饮片条目。后来教材常概括成益气健脾、面色萎黄、食少便溏。那是教材的话。本页以《局方》上面那句为准，不把教材的证候写成你的表现。',
      en: 'This formula is not a crude-drug monograph like the single herbs above. Later textbooks often summarize it as boosting qi and strengthening the spleen, with a sallow face and poor appetite with loose stools. That is textbook language. This page stays with the Formulary sentence above. It does not turn the textbook pattern into your presentation.',
      ar: 'هذه الوصفة ليست دراسة مادة خام كالأعشاب أعلاه. الكتب التعليمية اللاحقة تلخصها غالباً بتقوية تشي والطحال مع شحوب وقلة أكل وبراز لين. تلك لغة تعليمية. هذه الصفحة تبقى عند جملة الوصفات أعلاه. لا تحوّل نمط الكتاب التعليمي إلى صورتك.',
    },
    note: {
      zh: `可以和体质识别里气虚、食少便溏的教育卡片一起读。人参不在食药物质名单里，这张方不是四季页的粥。黑便、腹痛剧烈或发热，按急症就医。${NOT_RX.zh}`,
      en: `It can be read beside the education card for qi deficiency with poor appetite and loose stools. Ginseng is not on the food-medicine list. This formula is not a porridge on the seasons page. Black stool, severe abdominal pain, or fever needs emergency care. ${NOT_RX.en}`,
      ar: `يمكن قراءته بجانب بطاقة نقص تشي مع قلة الأكل والبراز اللين. الجينسنغ ليس في قائمة الغذاء والدواء. هذه الوصفة ليست عصيدة في الفصول. البراز الأسود أو ألم البطن الشديد أو الحمى يحتاج طوارئ. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'buzhong',
    name: '补中益气汤',
    title: { zh: '补中益气汤', en: 'Center-Supplementing and Qi-Boosting Decoction', ar: 'حساء تكميل الوسط وتقوية تشي' },
    classicFrom: {
      zh: '《脾胃论》',
      en: 'Treatise on the Spleen and Stomach',
      ar: 'رسالة الطحال والمعدة',
    },
    classic: {
      zh: '李东垣为饮食劳倦、脾胃气虚设这张方。药物有黄芪、甘草、人参、当归、橘皮、升麻、柴胡、白术。书里黄芪用得最多，其余按分、钱记载。那些数量是书中的记录，不抄成你的一次服量。',
      en: 'Li Dongyuan set this formula for dietary and fatigue injury and spleen-stomach qi deficiency. The drugs include astragalus, licorice, ginseng, angelica, tangerine peel, cimicifuga, bupleurum, and atractylodes. In the book astragalus is the largest amount, and the rest are recorded in fen and qian. Those amounts are the book’s record. They are not copied as your dose.',
      ar: 'وضع لي دونغ يوان هذه الوصفة لإصابة الطعام والتعب ونقص تشي الطحال والمعدة. الأدوية تشمل الهوانغ تشي والعرقسوس والجينسنغ والأنجليكا وقشر اليوسفي والسيميسيفوغا والبوليورم والأتراكتيلودس. في الكتاب الهوانغ تشي هو الأكبر، والباقي بالفن والتشيان. تلك المقادير سجل الكتاب. لا تُنسخ جرعتك.',
    },
    standardFrom: {
      zh: '不把后世扩展写成《脾胃论》原文',
      en: 'Later extensions are not written back into the Treatise',
      ar: 'التوسعات اللاحقة لا تُعاد إلى الرسالة',
    },
    standard: {
      zh: '脱肛、子宫脱垂、久泻是后来方书和成药说明里常见的扩展。本页不把它们写成《脾胃论》已经判定你有这些病，也不抄成药说明书上的一次几袋。',
      en: 'Prolapse of the rectum, prolapse of the uterus, and long diarrhea are extensions often seen in later formula books and on finished-product labels. This page does not write them as if the Treatise has already decided you have those conditions, and it does not copy “so many bags a time” from a package insert.',
      ar: 'هبوط المستقيم وهبوط الرحم والإسهال الطويل توسعات شائعة في كتب الوصفات اللاحقة وعلى لصاقات المستحضرات. هذه الصفحة لا تكتبها كأن الرسالة قررت أنك مصاب بها، ولا تنسخ «كذا كيساً في المرة» من نشرة عبوة.',
    },
    note: {
      zh: `发热、喘、脱肛或阴道里有组织脱出，要就医，不要自行升提。人参、升麻、柴胡都不进本站的食养粥。${NOT_RX.zh}`,
      en: `Fever, wheeze, rectal prolapse, or tissue coming out of the vagina needs care. Do not raise and lift on your own. Ginseng, cimicifuga, and bupleurum are not in the food porridges on this site. ${NOT_RX.en}`,
      ar: `الحمى أو الأزيز أو هبوط المستقيم أو خروج نسيج من المهبل يحتاج رعاية. لا ترفع وحدك. الجينسنغ والسيميسيفوغا والبوليورم ليست في عصائد الطعام في هذا الموقع. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'shengmai',
    name: '生脉散',
    title: { zh: '生脉散', en: 'Pulse-Engendering Powder', ar: 'مسحوق توليد النبض' },
    classicFrom: {
      zh: '《医学启源》；《内外伤辨惑论》亦载',
      en: 'Origins of Medicine; also in Clarifying Confusion about Internal and External Injury',
      ar: 'أصول الطب؛ وأيضاً في توضيح الالتباس بين الإصابة الداخلية والخارجية',
    },
    classic: {
      zh: '《医学启源》写生脉散补肺中元气不足，药物是人参、麦门冬、五味子。《内外伤辨惑论》也载这张方，用于热伤元气之后的气短、口渴、汗出。两处都标明，不合成「你气阴两虚就吃」。书中没有给你一个克数。',
      en: 'Origins of Medicine says Pulse-Engendering Powder supplements insufficient original qi in the lung. The drugs are ginseng, ophiopogon, and schisandra. Clarifying Confusion about Internal and External Injury also records the formula, for shortness of breath, thirst, and sweating after heat has injured original qi. Both are labeled. They are not merged into “you have qi and yin injury, so take this.” The books do not give you a gram amount.',
      ar: 'أصول الطب يقول إن المسحوق يكمل نقص تشي الأصل في الرئة. الأدوية جينسنغ وأوفيوبوغون وشيزاندرا. كتاب توضيح الالتباس يذكر الوصفة أيضاً لضيق النفس والعطش والتعرق بعد أن آذى الحر تشي الأصل. الاثنان مذكوران. لا يُدمجان في «عندك نقص تشي وين فتناول هذا». الكتب لا تعطيك غرامات.',
    },
    standardFrom: {
      zh: '两书并存，不另造一条国家标准句子',
      en: 'Both books stand; no extra national-standard sentence is invented',
      ar: 'الكتابان قائمان؛ لا تُخترع جملة معيار وطني',
    },
    standard: {
      zh: '本页没有把生脉散收成一条药典饮片。若市面上有同名成方制剂，它的一次几支、一日几次只属于那个制剂，不抄到这里。',
      en: 'This page does not turn Pulse-Engendering Powder into a crude-drug monograph. If a finished product of the same name is on the market, its “so many vials, so many times a day” belongs to that product. It is not copied here.',
      ar: 'هذه الصفحة لا تحوّل المسحوق إلى دراسة مادة خام. إن وُجد مستحضر جاهز بالاسم نفسه، فـ«كذا أمبولة كذا مرة» يخص ذلك المستحضر. لا يُنسخ هنا.',
    },
    note: {
      zh: `大汗、胸痛、喘、脉搏很弱，按急症就医，不要自己抓这三味。人参不在食药物质名单里。${NOT_RX.zh}`,
      en: `Profuse sweating, chest pain, wheeze, or a very weak pulse needs emergency care. Do not assemble these three yourself. Ginseng is not on the food-medicine list. ${NOT_RX.en}`,
      ar: `التعرق الغزير أو ألم الصدر أو الأزيز أو النبض الضعيف جداً يحتاج طوارئ. لا تجمع الثلاثة بنفسك. الجينسنغ ليس في قائمة الغذاء والدواء. ${NOT_RX.ar}`,
    },
  },
  {
    id: 'xiaoyao',
    name: '逍遥散',
    title: { zh: '逍遥散', en: 'Free and Easy Wanderer Powder', ar: 'مسحوق التجوال الحر' },
    classicFrom: {
      zh: '《太平惠民和剂局方》',
      en: 'Formulary of the Pharmacy of the Taiping Era',
      ar: 'وصفات صيدلية عصر تايبينغ',
    },
    classic: {
      zh: '「治血虚劳倦，五心烦热，肢体疼痛，头目昏重，心忪颊赤，口燥咽干，发热盗汗，减食嗜卧，及血热相搏，月水不调，脐腹胀痛，寒热如疟。又疗室女血弱阴虚，荣卫不和，痰嗽潮热，肌体羸瘦，渐成骨蒸。」药物是甘草、当归、茯苓、白芍、白术、柴胡，煎时用烧生姜、薄荷。半两、一两、每服二钱是书中记录，不抄成你的每次服量。原文是「心忪」，不改成别的字。',
      en: '“Treats blood deficiency with fatigue, heat in the five hearts, limb pain, a heavy and dim head, a throbbing heart with red cheeks, dry mouth and throat, fever and night sweats, less eating and desire to lie down, and blood-heat contending, irregular menses, pain and distension around the navel, and chills and fever like malaria. It also treats unmarried women with weak blood and yin deficiency, disharmony of nutritive and defensive qi, phlegm cough and tidal fever, a thin body, gradually becoming bone-steaming.” The drugs are licorice, angelica, poria, white peony, atractylodes, and bupleurum, boiled with roasted ginger and mint. Half a liang, one liang, and two qian a dose are the book’s record. They are not copied as your dose. The book says “xin-song”; that word is not replaced.',
      ar: 'النص يعالج نقص الدم مع التعب وحر القلوب الخمسة وألم الأطراف وثقل الرأس وخفقان القلب مع احمرار الخد وجفاف الفم والحلق والحمى وتعرق الليل وقلة الأكل والرغبة في الاضطجاع، واضطراب الدم والحر وعدم انتظام الحيض وألم ما حول السرة والقشعريرة والحمى شبه الملاريا. ويعالج أيضاً غير المتزوجات مع ضعف الدم ونقص الين. الأدوية عرقسوس وأنجليكا وفولينغ وفاوانيا بيضاء وأتراكتيلودس وبوليورم، مع زنجبيل محمص ونعناع. نصف ليانغ وليانغ وتشيانان سجل الكتاب. لا تُنسخ جرعتك. الكلمة الأصلية تُبقى كما هي.',
    },
    standardFrom: {
      zh: '原书即出处',
      en: 'The book is the source',
      ar: 'الكتاب هو المصدر',
    },
    standard: {
      zh: '后来常把它概括成疏肝解郁、养血健脾。那是教材的话。本页以《局方》上面那句为准。「渐成骨蒸」仍是引文，不是你的诊断。',
      en: 'Later teaching often summarizes it as coursing the liver, releasing constraint, nourishing blood, and strengthening the spleen. That is textbook language. This page stays with the Formulary sentence above. “Gradually becoming bone-steaming” remains a quotation. It is not your diagnosis.',
      ar: 'التعليم اللاحق يلخصها غالباً بتسيير الكبد وحل الاحتباس وتغذية الدم وتقوية الطحال. تلك لغة تعليمية. هذه الصفحة تبقى عند جملة الوصفات. «يصير تدريجياً تبخر عظم» يبقى اقتباساً. ليس تشخيصك.',
    },
    note: {
      zh: `可以和情志调摄、气郁质的教育卡片一起读。月经长期不调、潮热、消瘦，要就医，不要把这张方当成自己煎的调经药。${NOT_RX.zh}`,
      en: `It can be read beside the emotion page and the qi-constraint education card. Menses that stay irregular, tidal fever, or wasting needs care. Do not turn this formula into a period medicine you boil yourself. ${NOT_RX.en}`,
      ar: `يمكن قراءته بجانب صفحة الانفعال وبطاقة احتباس تشي. الحيض الذي يبقى غير منتظم أو حمى المد أو الهزال يحتاج رعاية. لا تجعل الوصفة دواء حيض تغليه بنفسك. ${NOT_RX.ar}`,
    },
  },
]
