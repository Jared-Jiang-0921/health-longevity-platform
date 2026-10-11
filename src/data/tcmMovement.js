/**
 * 中医运动教育摘要。
 * 导引：《素问·异法方宜论》。劳作的限度：《素问·上古天真论》。
 * 术语：T/CACM 1067—2018 运动调养、气功、强壮功（注中的站桩）、八段锦、太极拳。
 * 八段锦式名：国家体育总局健身气功管理中心编《健身气功·八段锦》，人民体育出版社，2003年7月。
 * 总局政府网站 2013-03-06 公布的定式名单在第二式、第七式用字不同，本页并列写出，不改动作口令。
 * 太极拳文化认定：联合国教科文组织 2020 年人类非物质文化遗产代表作名录，项目 00424。不是疗效试验。
 * 活动量：世界卫生组织《关于身体活动和久坐行为的指南》（2020）。不把一套拳换成指南里的分钟。
 * 不教按蹻，不逐式描摹，不教憋气，不把式名里的脏腑字样当成对读者的治疗。
 */
export const TCM_MOVEMENT_SOURCE = {
  zh: '导引的古典依据是《素问·异法方宜论》。身体可以劳作、但不宜劳到倦怠，依据《素问·上古天真论》。术语依据中华中医药学会团体标准 T/CACM 1067—2018《中医治未病术语》的运动调养、气功、八段锦、太极拳；站桩只出现在强壮功的注里。八段锦八个式名依据国家体育总局健身气功管理中心 2003 年出版的《健身气功·八段锦》，不是《内经》的句子。太极拳另有 2020 年联合国教科文组织的遗产名录，那是文化认定。活动量的分钟数来自世界卫生组织 2020 年指南，不能把一套拳自动换算进去。本页不教按蹻，不逐式写口令，也不把式名写成疗效。',
  en: 'The classical line for daoyin is Suwen, “Different Methods for Different Regions.” Not working the body to exhaustion follows “Heavenly Truth of Ancient Times.” Terms follow T/CACM 1067—2018: regulating by sport, qigong, Baduanjin, and Taijiquan. Standing practice appears only in a note under the health-promotion exercise. The eight Baduanjin names follow the 2003 book of the General Administration of Sport’s Health Qigong center, not the Neijing. Taijiquan’s 2020 UNESCO listing is cultural recognition. The minutes come from the WHO 2020 physical-activity guideline and are not converted from a form. This page does not teach anqiao, pose-by-pose commands, or read organ words in the titles as treatment.',
  ar: 'نص التوجيه من «سوين». حد الإجهاد من فصل الحقيقة السماوية. المصطلحات من T/CACM 1067—2018. أسماء بادوانجين الثمانية من كتاب 2003 لمركز تشي غونغ الصحي، لا من الكلاسيكيات. إدراج التاي تشي لدى اليونسكو عام 2020 اعتراف ثقافي. الدقائق من دليل منظمة الصحة العالمية 2020 ولا تُحوَّل من روتين. هذه الصفحة لا تعلّم التدليك ولا أوامر الحركة خطوة بخطوة، ولا تقرأ أسماء الأعضاء في العناوين كعلاج.',
}

export const TCM_MOVEMENT_TOPICS = [
  {
    id: 'daoyin',
    name: { zh: '导引', en: 'Daoyin', ar: 'التوجيه' },
    classicFrom: {
      zh: '《素问·异法方宜论》',
      en: 'Suwen, Different Methods for Different Regions',
      ar: 'سوين، طرق مختلفة لمناطق مختلفة',
    },
    classic: {
      zh: '讲到中央之地时，原文写「其治宜导引按蹻，故导引按蹻者，亦从中央出也。」这是在说一种方法被认为从何处产生、当时用于什么情形。不是一张让今天的读者按居住地给自己治痿厥的地图。',
      en: 'Speaking of the central region, the text says its treatment suits daoyin and anqiao, and that daoyin and anqiao came from the center. That is an account of where a method was said to arise, and of the situation named there. It is not a map telling today’s reader to treat weakness or cold-heat according to where they live.',
      ar: 'حين يتحدث عن المنطقة الوسطى يقول النص إن علاجها يناسب التوجيه والضغط، وإن هذه الطريقة خرجت من الوسط. هذا بيان عن منشأ طريقة وعن الحال المذكورة هناك. ليس خريطة تأمر قارئ اليوم أن يعالج الضعف أو البرد والحر حسب مكان سكنه.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.8 运动调养，4.8.2 气功',
      en: 'T/CACM 1067—2018 · 4.8 regulating by sport; 4.8.2 qigong',
      ar: 'T/CACM 1067—2018 · 4.8 التنظيم بالرياضة؛ 4.8.2 تشي غونغ',
    },
    standard: {
      zh: '标准没有给「导引」单独编号。「运动调养」指用健身运动做体育锻炼，以增强体质、祛病延年。「气功」指用调身、调心、调息来炼养精气神。动功的特点是特定的肢体动作；静功有坐、卧、站，特点是相对静止。后面把八段锦称为古代著名的导引功法。',
      en: 'The standard gives “daoyin” no entry of its own. “Regulating by sport” means using fitness exercise to strengthen the body and to support longevity. “Qigong” means using posture, mind, and breath to cultivate essence, qi, and spirit. Moving practice uses set body movements. Still practice uses sitting, lying, or standing, and stays relatively still. Later the standard calls Baduanjin a famous ancient daoyin method.',
      ar: 'المعيار لا يفرد «التوجيه» برقم. «التنظيم بالرياضة» يعني استخدام التمرين لتقوية الجسم ودعم طول العمر. «تشي غونغ» يعني ضبط الجسد والذهن والنفس لتهذيب الجوهر وتشي والروح. العمل المتحرك حركات محددة، والساكن جلوس أو استلقاء أو وقوف مع سكون نسبي. ويسمي المعيار لاحقاً بادوانجين طريقة توجيه قديمة مشهورة.',
    },
    note: {
      zh: '按蹻不在这一页教。导引也不是叫人自己选一套动作去治已经出现的病。想学动作，用后面写明出处的公开套路，或跟会教的人学。',
      en: 'Anqiao is not taught on this page. Daoyin is also not an instruction to pick a routine and treat an illness that is already present. To learn movements, use a public routine whose source is named below, or learn from someone who teaches it.',
      ar: 'الضغط لا يُعلَّم في هذه الصفحة. التوجيه ليس أمراً باختيار روتين لعلاج مرض قائم. لتعلم الحركات، استخدم روتيناً عاماً مذكور المصدر أدناه، أو تعلّم ممن يدرّسه.',
    },
  },
  {
    id: 'baduanjin',
    name: { zh: '八段锦', en: 'Baduanjin', ar: 'بادوانجين' },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.8.2.5 八段锦',
      en: 'T/CACM 1067—2018 · 4.8.2.5 Baduanjin',
      ar: 'T/CACM 1067—2018 · 4.8.2.5 بادوانجين',
    },
    standard: {
      zh: '标准称它是中国古代著名导引功法。「八段」说的是节数，「锦」说的是珍贵。历代形成许多流派。姿势有站式和坐式。动作风格有南派和北派：南派又称文八段，以柔为主，法简易学；北派又称武八段，以刚为主，多用马步，术繁而难练。标准没有列出八个式名，也没有写每式做几遍。',
      en: 'The standard calls it a famous ancient Chinese daoyin method. “Eight sections” refers to the number of parts, and “brocade” to its being valued. Many schools formed over time. Postures include standing and sitting. In style there is a southern school, also called civil Baduanjin, soft and easier to learn, and a northern school, also called martial Baduanjin, firmer, often using a horse stance, busier and harder. The standard lists no eight titles and sets no repetitions.',
      ar: 'يسميه المعيار طريقة توجيه صينية قديمة مشهورة. «الثمانية» عدد الأقسام، و«الديباج» إشارة إلى قيمته. تشكلت مدارس كثيرة. فيه وقوف وجلوس. الأسلوب الجنوبي، ويسمى المدني، لين وأسهل؛ والشمالي، ويسمى العسكري، أصلب ويكثر من وقفة الحصان وأصعب. المعيار لا يسرد العناوين الثمانية ولا يحدد التكرار.',
    },
    routineFrom: {
      zh: '《健身气功·八段锦》，人民体育出版社，2003年7月',
      en: 'Health Qigong: Baduanjin, People’s Sports Publishing House, July 2003',
      ar: 'تشي غونغ الصحي: بادوانجين، دار نشر الرياضة الشعبية، يوليو 2003',
    },
    routine: {
      zh: '这是国家体育总局健身气功管理中心组织编创、用于公开教学的一种站式套路，不是上面那条标准里的唯一流派。书中的八个式名是：两手托天理三焦，左右开弓似射雕，调理脾胃须单举，五劳七伤往后瞧，摇头摆尾去心火，两手攀足固肾腰，攒拳怒目增气力，背后七颠百病消。总局政府网站 2013 年 3 月 6 日的定式名单，第二式写作「左右弯弓似射雕」，第七式写作「攥拳怒目增气力」。用字不同，本页不据此改动作。式名里的三焦、脾胃、心火、肾腰、百病，是套路的传统叫法，不是对读者脏腑的治疗承诺。',
      en: 'This is one standing routine created for public teaching by the Health Qigong center of the General Administration of Sport. It is not the only school inside the standard above. The book’s eight titles are: prop up the sky to regulate the triple burner; draw the bow both sides like shooting a hawk; raise one arm to regulate spleen and stomach; look backward to ease the five labors and seven injuries; sway the head and tail to remove heart fire; reach the feet to firm kidney and waist; clench the fists and glare to increase strength; seven shakes behind the back to dispel the hundred illnesses. On the administration’s site, 6 March 2013, the second title uses “bend the bow” and the seventh uses a different character for “clench.” The wording differs. This page does not rewrite the movements from that. Triple burner, spleen and stomach, heart fire, kidney and waist, and “the hundred illnesses” in the titles are traditional names of the routine, not a promise to treat the reader’s organs.',
      ar: 'هذا روتين وقوف أُعد للتعليم العام من مركز تشي غونغ الصحي. ليس المدرسة الوحيدة في المعيار. عناوين الكتاب الثمانية تبدأ برفع اليدين للسماء، ثم فتح القوس، ثم رفع ذراع واحدة، ثم النظر إلى الخلف، ثم هز الرأس والذيل، ثم الوصول إلى القدمين، ثم قبض القبضة، ثم سبع هزات خلف الظهر. في صفحة الإدارة بتاريخ 6 مارس 2013 يختلف حرفان في العنوانين الثاني والسابع. هذا الموقع لا يعيد كتابة الحركات من ذلك. أسماء الأحشاء في العناوين تسميات تقليدية للروتين، وليست وعداً بعلاج أعضاء القارئ.',
    },
    note: {
      zh: '《素问》和《灵枢》没有「八段锦」，八个式名不能回写成经文。动作、遍数和呼吸以这本教材或会教这套的人为准。本页不把图解改写成口令，也不把书里可能出现的停闭呼吸抄出来让人照做。北派马步对膝盖负担更明显，膝痛就不要往下蹲。',
      en: 'Suwen and Lingshu do not contain “Baduanjin,” and the eight titles cannot be written back into those books. The movements, repetitions, and breathing follow that book or a person who teaches this routine. This page does not turn the illustrations into commands, and it does not copy any breath-holding cues the book may contain for people to imitate. The northern horse stance loads the knees more. If the knee hurts, do not sink down.',
      ar: '«سوين» و«لينغ شو» لا يحتويان «بادوانجين»، ولا تُعاد العناوين الثمانية إلى هذين الكتابين. الحركات والتكرار والتنفس تتبع ذلك الكتاب أو من يدرّس هذا الروتين. هذه الصفحة لا تحوّل الرسوم إلى أوامر، ولا تنسخ حبس النفس إن ورد في الكتاب ليقلده الناس. وقفة الحصان الشمالية تحمّل الركبة أكثر. إن وجع الركبة فلا تنزل للأسفل.',
    },
  },
  {
    id: 'taiji',
    name: { zh: '太极拳', en: 'Taijiquan', ar: 'تاي تشي' },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.8.2.7 太极拳',
      en: 'T/CACM 1067—2018 · 4.8.2.7 Taijiquan',
      ar: 'T/CACM 1067—2018 · 4.8.2.7 تاي تشي',
    },
    standard: {
      zh: '标准把它列为中国国家级非物质文化遗产，并写明它结合阴阳五行、中医经络学说、导引和吐纳，练起来缓慢轻灵、刚柔相济。标准没有规定拳架高低，没有指定哪一家流派，也没有写一套式名。',
      en: 'The standard lists it as national intangible cultural heritage of China, and says it joins yin–yang and the five phases, meridian theory, daoyin, and breath practice, done slowly and lightly, firm and soft together. It sets no height of stance, names no one school, and lists no sequence of moves.',
      ar: 'يدرجها المعيار تراثاً ثقافياً غير مادي على المستوى الوطني في الصين، ويقول إنها تجمع الين واليانغ والمراحل الخمس ونظرية خطوط الطاقة والتوجيه والنفس، وتُمارَس ببطء وخفة وبصلابة ولين معاً. لا يحدد ارتفاع الوقفة ولا مدرسة واحدة ولا سلسلة حركات.',
    },
    modernFrom: {
      zh: '联合国教科文组织，2020',
      en: 'UNESCO, 2020',
      ar: 'اليونسكو، 2020',
    },
    modern: {
      zh: '2020 年列入人类非物质文化遗产代表作名录，项目编号 00424，由中国申报。这是文化认定，不是疗效试验。申报文本写明有多个流派，也有推手这类双人练习。本页不教某一家的套路，也不教推手。',
      en: 'In 2020 it was inscribed on the Representative List of the Intangible Cultural Heritage of Humanity, element 00424, nominated by China. That is cultural recognition, not a trial of medical effect. The nomination says there are several schools, and also two-person pushing-hands practice. This page teaches neither one school’s form nor pushing hands.',
      ar: 'أُدرجت عام 2020 في القائمة التمثيلية للتراث الثقافي غير المادي للبشرية، العنصر 00424، بترشيح من الصين. هذا اعتراف ثقافي لا تجربة فعالية طبية. يذكر الترشيح عدة مدارس وأيضاً تمرين الدفع باليدين بين شخصين. هذه الصفحة لا تعلّم روتين مدرسة ولا الدفع باليدين.',
    },
    note: {
      zh: '《内经》没有「太极拳」。后来用于普及的简化套路，不在团体标准里，本页也不逐式教。练的时候膝盖不要超过脚尖去硬蹲；膝痛就把架子抬高，痛不缓解就停。不要把它当成打架，也不要当成已经开好的治疗。',
      en: 'The Neijing has no “Taijiquan.” Later short forms made for wide teaching are not in the group standard, and this page does not teach them move by move. Do not force the knee past the toes into a hard squat. If the knee hurts, raise the stance; if the pain does not ease, stop. It is not a fight, and it is not a treatment already prescribed.',
      ar: 'ليس في الكلاسيكيات «تاي تشي». الروتينات المختصرة اللاحقة للتعليم الواسع ليست في المعيار، وهذه الصفحة لا تعلّمها حركة حركة. لا تدفع الركبة أمام أصابع القدم في قرفصاء قاسٍ. إن وجعت الركبة فارفع الوقفة، وإن لم يهدأ الوجع فتوقف. ليست قتالاً وليست علاجاً موصوفاً سلفاً.',
    },
  },
  {
    id: 'standing',
    name: { zh: '站桩', en: 'Standing practice', ar: 'الوقوف الساكن' },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.8.2.3 强壮功 · 注',
      en: 'T/CACM 1067—2018 · 4.8.2.3 health-promotion exercise, note',
      ar: 'T/CACM 1067—2018 · 4.8.2.3 تمرين تعزيز الصحة، حاشية',
    },
    standard: {
      zh: '「强壮功」的注写的是「如盘膝坐及站桩等」。站桩在这里是静功姿势的举例，和盘膝坐并列。标准没有写站多久、膝盖弯多少、手里抱不抱球。',
      en: 'The note under “health-promotion exercise” says “such as sitting cross-legged and standing practice.” Standing is an example of a still posture, listed beside cross-legged sitting. The standard does not say how long to stand, how far to bend the knees, or whether the arms hold a ball.',
      ar: 'حاشية «تمرين تعزيز الصحة» تقول «مثل الجلوس متربعاً والوقوف الساكن». الوقوف هنا مثال على وضع ساكن إلى جانب الجلوس. المعيار لا يحدد المدة ولا ثني الركبة ولا إن كانت الذراعان تحملان كرة.',
    },
    note: {
      zh: '《内经》没有「站桩」这个功名，也没有写站几分钟。旁边要有能扶的东西，地面要稳。头晕、眼前发黑、膝痛或心慌，就停下坐下。不要憋气，也不要把某一种桩法当成治病的处方。',
      en: 'The Neijing has no method named “standing practice,” and it does not say how many minutes to stand. Have something nearby to hold, and stand on a stable floor. If you feel dizzy, your vision darkens, the knee hurts, or the heart races, stop and sit down. Do not hold the breath, and do not take one style of standing as a prescription for disease.',
      ar: 'ليس في الكلاسيكيات اسم «الوقوف الساكن»، ولا دقائق للوقوف. ليكن بجانبك ما تستند إليه، والأرض ثابتة. إن حدث دوار أو أظلمت الرؤية أو وجعت الركبة أو تسارع القلب، توقف واجلس. لا تحبس النفس، ولا تجعل أسلوباً واحداً من الوقوف وصفة لمرض.',
    },
  },
  {
    id: 'amount',
    name: { zh: '活动量', en: 'How much activity', ar: 'مقدار النشاط' },
    classicFrom: {
      zh: '《素问·上古天真论》',
      en: 'Suwen, Heavenly Truth of Ancient Times',
      ar: 'سوين، الحقيقة السماوية للأقدمين',
    },
    classic: {
      zh: '「形劳而不倦。」身体可以劳作，不以劳到倦怠为度。同篇还有「不妄作劳」。这里没有每周多少分钟。',
      en: '“Work the body, but not to exhaustion.” The body may be used, and the limit is not wearing it out. The same chapter also says not to labor without cause. There is no weekly number of minutes.',
      ar: '«أجهد الجسد دون أن يبلغ التعب.» يمكن استخدام الجسد، والحد ألا يُنهك. والفصل نفسه يقول ألا تُرهق النفس بلا سبب. ليس هنا عدد دقائق أسبوعي.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.8 运动调养',
      en: 'T/CACM 1067—2018 · 4.8 regulating by sport',
      ar: 'T/CACM 1067—2018 · 4.8 التنظيم بالرياضة',
    },
    standard: {
      zh: '运动调养是用健身运动做体育锻炼。定义里没有 150 分钟，也没有把八段锦或太极拳换算成这个数。',
      en: 'Regulating by sport means using fitness exercise. The definition has no “150 minutes,” and it does not convert Baduanjin or Taijiquan into that number.',
      ar: 'التنظيم بالرياضة يعني استخدام التمرين. التعريف لا يذكر «150 دقيقة»، ولا يحوّل بادوانجين أو التاي تشي إلى هذا الرقم.',
    },
    modernFrom: {
      zh: '世界卫生组织，2020 年身体活动指南',
      en: 'World Health Organization, 2020 guidelines on physical activity',
      ar: 'منظمة الصحة العالمية، دليل النشاط البدني 2020',
    },
    modern: {
      zh: '指南对成年人写的是：每周至少 150 到 300 分钟中等强度有氧活动，或至少 75 到 150 分钟较大强度，或两者相当的组合。有一点活动，好过完全不动。65 岁及以上，在这之外，还建议每周至少 3 天做包含平衡和力量的多样活动，以维持活动能力、减少跌倒。这是人群建议。它没有说练完一套拳就等于这些分钟，也没有规定拳架或站桩的时长。',
      en: 'For adults the guideline says at least 150 to 300 minutes a week of moderate-intensity aerobic activity, or at least 75 to 150 minutes of vigorous activity, or an equivalent mix. Some activity is better than none. For people aged 65 and older, it adds varied activity that emphasizes balance and strength on 3 or more days a week, to maintain function and reduce falls. This is a population recommendation. It does not say that finishing one form equals those minutes, and it does not set the length of a boxing stance or of standing practice.',
      ar: 'للبالغين يقول الدليل: 150 إلى 300 دقيقة أسبوعياً على الأقل من النشاط الهوائي المتوسط، أو 75 إلى 150 دقيقة من النشاط الأشد، أو مزيج معادل. قليل من النشاط خير من عدمه. لمن بلغ 65 فأكثر، يضاف نشاط متنوع يركز على التوازن والقوة في 3 أيام أو أكثر أسبوعياً، للحفاظ على القدرة وتقليل السقوط. هذه توصية سكانية. لا تقول إن إنهاء روتين يساوي هذه الدقائق، ولا تحدد مدة وقفة الملاكمة أو الوقوف الساكن.',
    },
    note: {
      zh: '八段锦、太极拳和散步都可以算进日常活动，分钟仍按实际做了多久来算。心脏、关节或平衡已经有问题的人，每周做多少要和接诊的人一起定，不从这一页抄一个数。',
      en: 'Baduanjin, Taijiquan, and walking can all count as daily activity. The minutes are still the minutes actually done. If the heart, a joint, or balance is already a problem, how much to do in a week is decided with the clinician seeing you, not copied as a number from this page.',
      ar: 'بادوانجين والتاي تشي والمشي يمكن أن تدخل في النشاط اليومي. الدقائق تبقى الدقائق التي فُعلت فعلاً. إن كانت مشكلة في القلب أو مفصل أو التوازن قائمة، فالمقدار الأسبوعي يُحدد مع الطبيب الذي يراك، ولا يُنسخ رقماً من هذه الصفحة.',
    },
  },
  {
    id: 'stop',
    name: { zh: '何时停下', en: 'When to stop', ar: 'متى تتوقف' },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.8 运动调养',
      en: 'T/CACM 1067—2018 · 4.8 regulating by sport',
      ar: 'T/CACM 1067—2018 · 4.8 التنظيم بالرياضة',
    },
    standard: {
      zh: '运动调养写的目的是增强体质、祛病延年。它没有写带病硬练，也没有写用马步或站桩去处理胸痛和中风表现。',
      en: 'The stated aim of regulating by sport is to strengthen the body and support longevity. It does not say to force practice through illness, and it does not say to use a horse stance or standing practice to deal with chest pain or stroke signs.',
      ar: 'غاية التنظيم بالرياضة تقوية الجسم ودعم طول العمر. لا يقول بالممارسة القسرية أثناء المرض، ولا باستخدام وقفة الحصان أو الوقوف الساكن للتعامل مع ألم الصدر أو علامات السكتة.',
    },
    note: {
      zh: '式名里的「理三焦」「去心火」「固肾腰」「百病消」，不是《内经》开给读者的治法。练的时候出现胸痛、突然喘不上气、头晕、眼前发黑、单侧无力或说话不清，马上停下。胸痛、单侧无力、说话不清，按急症就医，可拨打 120。关节一阵一阵的锐痛不要硬撑。不要憋气。孕期、刚做完手术，或血压、心脏病还不稳定，开始前先问医师。本页不替代康复训练处方。',
      en: '“Regulate the triple burner,” “remove heart fire,” “firm the kidney and waist,” and “dispel the hundred illnesses” are not treatments the Neijing prescribed for the reader. Stop at once if practice brings chest pain, sudden shortness of breath, dizziness, darkening vision, weakness on one side, or unclear speech. Chest pain, one-sided weakness, or unclear speech needs emergency care. In China the medical emergency number is 120. Do not push through sharp joint pain. Do not hold the breath. In pregnancy, just after surgery, or while blood pressure or heart disease is still unstable, ask a physician before starting. This page does not replace a rehabilitation prescription.',
      ar: '«تنظيم الحارق الثلاثي» و«إزالة نار القلب» و«تثبيت الكلية والخصر» و«إزالة المئة مرض» ليست علاجات وصفها الكتاب للقارئ. توقف فوراً إن ظهر ألم صدر أو ضيق نفس مفاجئ أو دوار أو إظلام الرؤية أو ضعف في جانب واحد أو كلام غير واضح. ألم الصدر والضعف في جانب واحد والكلام غير الواضح يحتاج طوارئ. في الصين رقم الطوارئ الطبية 120. لا تواصل مع ألم مفصل حاد. لا تحبس النفس. في الحمل، أو بعد الجراحة مباشرة، أو حين يكون ضغط الدم أو مرض القلب غير مستقر، اسأل طبيباً قبل البدء. هذه الصفحة لا تغني عن وصفة إعادة التأهيل.',
    },
  },
]
