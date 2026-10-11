/**
 * 情志调摄教育摘要。
 * 形神与情志：《素问·上古天真论》《素问·举痛论》《素问·阴阳应象大论》《灵枢·本神》。
 * 睡眠：《灵枢·口问》。四季卧起仍在四季养生，依据《素问·四气调神大论》。
 * 五音归类：《素问·金匮真言论》。不配曲目。
 * 术语：T/CACM 1067—2018 形神合一、精神调养、心神调养、性情调养、情志调养、音乐养生、安卧有方、情志复。
 * 本站栏目名是「情志调摄」；标准里的术语是「情志调养」。
 * 现代对照：世界卫生组织压力说明、抑郁事实清单；美国睡眠医学会与睡眠研究学会 2015 年成年人睡眠共识。
 * 求助：国卫医政函〔2024〕259号设置的 12356。不下抑郁诊断，不写助眠药，不把情志相胜写成可自行操作的办法。
 */
export const TCM_EMOTION_SOURCE = {
  zh: '情绪和睡眠的古典依据是《素问·上古天真论》《素问·举痛论》《素问·阴阳应象大论》《灵枢·本神》《灵枢·口问》。术语依据中华中医药学会团体标准 T/CACM 1067—2018《中医治未病术语》。本站栏目叫「情志调摄」，标准里的对应术语是「情志调养」。有现代公开说法的，单独标成对照：世界卫生组织关于压力和抑郁的说明，以及美国睡眠医学会与睡眠研究学会 2015 年关于成年人睡眠时长的共识。相胜不写成自己可以操作的办法，不写助眠药，也不在这里下抑郁诊断。',
  en: 'Classical lines come from Suwen, “Heavenly Truth of Ancient Times,” “On Pain,” and “Yin–Yang Images,” and from Lingshu, “Rooted in Spirit” and “Oral Questions.” Terms follow group standard T/CACM 1067—2018. This site’s tab is “mind–emotion”; the standard’s term is “emotion regulation.” Where a modern public statement exists, it is labeled separately: WHO on stress and depression, and the 2015 adult sleep-duration consensus of the American Academy of Sleep Medicine and the Sleep Research Society. The “one emotion overcomes another” lines are not turned into something to practice, no sleep medicine is named, and this page does not diagnose depression.',
  ar: 'النصوص من «سوين» و«لينغ شو». المصطلحات من T/CACM 1067—2018. اسم التبويب هنا «ضبط المشاعر»، ومصطلح المعيار هو تنظيم الانفعال. المقارنة الحديثة تُذكر وحدها: منظمة الصحة العالمية عن الضغط والاكتئاب، وإجماع 2015 حول مدة نوم البالغين. لا نحوّل «غلبة انفعال على آخر» إلى طريقة تُمارَس، ولا نذكر دواء نوم، ولا نشخّص اكتئاباً.',
}

export const TCM_EMOTION_TOPICS = [
  {
    id: 'form-spirit',
    name: { zh: '形神', en: 'Body and spirit', ar: 'الجسد والروح' },
    classicFrom: {
      zh: '《素问·上古天真论》',
      en: 'Suwen, Heavenly Truth of Ancient Times',
      ar: 'سوين، الحقيقة السماوية للأقدمين',
    },
    classic: {
      zh: '「恬惔虚无，真气从之，精神内守，病安从来。」同篇还写到食饮有节、起居有常、不妄作劳。形体和精神是一起说的。',
      en: '“Be calm and empty of excess desire, and true qi follows; keep the spirit inside, and from where would illness come?” The same chapter also names measured eating, regular daily living, and not taxing oneself without cause. Body and spirit are spoken of together.',
      ar: '«كن هادئاً خالياً من فرط الرغبة، فيتبع تشي الحق؛ احفظ الروح في الداخل، فمن أين يأتي المرض؟» والفصل نفسه يذكر الأكل بقَدْر والعيش المنتظم وعدم إرهاق النفس بلا سبب. الجسد والروح يُذكران معاً.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 2.1 形神合一，4.1 精神调养',
      en: 'T/CACM 1067—2018 · 2.1 unity of physique and spirit; 4.1 spirit regulation',
      ar: 'T/CACM 1067—2018 · 2.1 وحدة الجسد والروح؛ 4.1 تنظيم الروح',
    },
    standard: {
      zh: '「形神合一」指形体与精神协调统一，包括脏器的有形躯体，与思维情志、感觉等生命活动。「精神调养」指调节人的精神活动，保护和增强精神健康，力求形神高度统一。',
      en: '“Unity of physique and spirit” means the body and the spirit stay coordinated, including the organs’ physical form and activities such as thought, emotion, and sensation. “Spirit regulation” means regulating mental activity so as to protect and strengthen mental health, aiming at a high degree of unity of body and spirit.',
      ar: '«وحدة الجسد والروح» تعني توافق الجسد مع الروح، بما فيه شكل الأعضاء وأنشطة الفكر والانفعال والحس. «تنظيم الروح» يعني ضبط النشاط الذهني لحماية الصحة النفسية وتعزيزها، سعياً إلى وحدة عالية بين الجسد والروح.',
    },
    note: {
      zh: '「恬惔虚无」说的是少欲、不让情绪走得太过，不是叫人什么都不想、什么都不做。这一条也不代替后面说的就医情形。',
      en: '“Calm and empty” means fewer excess wants, and not letting emotion run too far. It does not mean thinking nothing and doing nothing. It also does not replace the situations, later on this page, that call for care.',
      ar: '«الهدوء والخلو» يعني تقليل الرغبات الزائدة وعدم ترك الانفعال يذهب بعيداً. لا يعني ألا تفكر وألا تفعل شيئاً. ولا يغني عن مواضع طلب العناية المذكورة لاحقاً.',
    },
  },
  {
    id: 'qi',
    name: { zh: '七情与气', en: 'Emotion and qi', ar: 'الانفعال وتشي' },
    classicFrom: {
      zh: '《素问·举痛论》《素问·阴阳应象大论》',
      en: 'Suwen, On Pain; Yin–Yang Images',
      ar: 'سوين، في الألم؛ صور الين واليانغ',
    },
    classic: {
      zh: '《举痛论》先写「百病生于气」，接着是「怒则气上，喜则气缓，悲则气消，恐则气下」。后面才是「惊则气乱」「思则气结」。中间还夹着寒、热和劳，不全是情志。《阴阳应象大论》把过激的情志和五脏放在一起：怒伤肝、喜伤心、思伤脾、忧伤肺、恐伤肾；同篇还有悲胜怒、恐胜喜、怒胜思、喜胜忧、思胜恐。',
      en: '“On Pain” first says the hundred illnesses arise from qi, then “anger makes qi rise, joy slows qi, sadness disperses qi, fear makes qi descend.” Only later come “fright throws qi into disorder” and “pensiveness knots qi.” Cold, heat, and overwork sit in between, so the passage is not only about emotion. “Yin–Yang Images” places excess emotion with the organs: anger harms the liver, joy the heart, pensiveness the spleen, worry the lung, fear the kidney. The same chapter also says sadness overcomes anger, fear overcomes joy, anger overcomes pensiveness, joy overcomes worry, and pensiveness overcomes fear.',
      ar: 'فصل الألم يبدأ بأن الأمراض الكثيرة تنشأ من تشي، ثم «الغضب يصعد بتشي، والفرح يبطئه، والحزن يبدده، والخوف ينزله». وبعد ذلك «الفزع يخلط تشي» و«الفكر يعقده». وبينها البرد والحر والإرهاق، فالنص ليس عن الانفعال وحده. فصل صور الين واليانغ يقرن الإفراط بالأعضاء: الغضب يضر الكبد، والفرح القلب، والفكر الطحال، والهم الرئة، والخوف الكلية. وفيه أيضاً أن الحزن يغلب الغضب، والخوف يغلب الفرح، والغضب يغلب الفكر، والفرح يغلب الهم، والفكر يغلب الخوف.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.1.3 情志调养',
      en: 'T/CACM 1067—2018 · 4.1.3 emotion regulation',
      ar: 'T/CACM 1067—2018 · 4.1.3 تنظيم الانفعال',
    },
    standard: {
      zh: '「情志调养」指七情五志的调摄、修养。重在调节情绪和情感活动，使之心情舒畅，气和志达。标准没有把「怒伤肝」写成一条诊断，也没有把相胜写成一套操作。',
      en: '“Emotion regulation” means the cultivation of the seven emotions and five minds. The emphasis is on regulating emotional activity so that the mood is easy and qi and will move smoothly. The standard does not turn “anger harms the liver” into a diagnosis, and it does not turn the overcoming lines into a procedure.',
      ar: '«تنظيم الانفعال» هو تهذيب الانفعالات السبعة والعقول الخمسة، بضبط النشاط العاطفي حتى يصفو المزاج ويسير تشي والإرادة. المعيار لا يجعل «الغضب يضر الكبد» تشخيصاً، ولا يحوّل عبارات الغلبة إلى إجراء.',
    },
    note: {
      zh: '生一次气，不等于肝已经病了。相胜那几句是古籍里的制约关系，不是让读者去吓别人、辱骂别人，或逼自己发怒。本站不把它们写成可以自己做的疗法。',
      en: 'Getting angry once does not mean the liver is already diseased. Those overcoming lines are a classical account of restraint. They are not an instruction to frighten someone, insult someone, or force yourself into anger. This site does not turn them into a therapy you carry out yourself.',
      ar: 'الغضب مرة واحدة لا يعني أن الكبد مرض. عبارات الغلبة وصف كلاسيكي للتقييد، وليست أمراً بتخويف أحد أو إهانته أو إجبار النفس على الغضب. هذا الموقع لا يجعلها علاجاً تمارسه بنفسك.',
    },
  },
  {
    id: 'heart-spirit',
    name: { zh: '心神', en: 'Heart spirit', ar: 'روح القلب' },
    classicFrom: {
      zh: '《灵枢·本神》',
      en: 'Lingshu, Rooted in Spirit',
      ar: 'لينغ شو، الجذر في الروح',
    },
    classic: {
      zh: '「所以任物者谓之心。」心主管接纳事物。同篇写思虑过重可以伤神，悲哀动中可以伤魂。说的是过激以后的变化，不是给读者本人下的诊断。',
      en: '“That which takes on things is called the heart.” The heart is described as what receives affairs. The same chapter says excessive worry can injure the spirit, and grief that stirs the center can injure the hun. That describes change after excess. It is not a diagnosis of the reader.',
      ar: '«ما يتولى استقبال الأمور يسمى القلب.» القلب هنا هو ما يستقبل الشأن. والفصل يقول إن فرط الفكر قد يجرح الروح، وإن الحزن الذي يهز الباطن قد يجرح الهون. هذا وصف لما بعد الإفراط، وليس تشخيصاً للقارئ.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.1.1 心神调养，4.1.2 性情调养',
      en: 'T/CACM 1067—2018 · 4.1.1 heart-spirit regulation; 4.1.2 temperament regulation',
      ar: 'T/CACM 1067—2018 · 4.1.1 تنظيم روح القلب؛ 4.1.2 تنظيم الطبع',
    },
    standard: {
      zh: '「心神调养」是心神的调摄与修养：清心寡欲，积精全神，使精神内守。「性情调养」是调摄禀性、气质、思想感情和脾气，使心神怡然、气血和调。',
      en: '“Heart-spirit regulation” is the cultivation of the heart spirit: quiet the heart and lessen desire, store essence and keep the spirit whole, so the spirit stays inside. “Temperament regulation” cultivates disposition, character, feeling, and temper, so the heart spirit is at ease and qi and blood are harmonized.',
      ar: '«تنظيم روح القلب» هو تهذيبها: تهدئة القلب وتقليل الرغبة، وادخار الجوهر وحفظ الروح، حتى تبقى في الداخل. «تنظيم الطبع» يهذب المزاج والخلق والشعور والحدة، حتى يطمئن القلب ويتوافق تشي والدم.',
    },
    note: {
      zh: '标准写的是长期修养，不是一次心情练习就能完成的事。跟可信的人把担心说出来，属于日常可以做的。已经持续到影响吃饭、睡觉或做事，看本页最后一条。',
      en: 'The standard describes a long cultivation, not one mood exercise. Telling a trusted person what worries you is an ordinary daily step. If it has already gone on long enough to affect eating, sleep, or work, use the last item on this page.',
      ar: 'المعيار يصف تهذيباً طويلاً، لا تمريناً واحداً للمزاج. أن تقول ما يقلقك لشخص تثق به خطوة يومية. إن استمر الأمر حتى أثّر في الأكل أو النوم أو العمل، انظر البند الأخير.',
    },
  },
  {
    id: 'sleep',
    name: { zh: '睡眠', en: 'Sleep', ar: 'النوم' },
    classicFrom: {
      zh: '《灵枢·口问》',
      en: 'Lingshu, Oral Questions',
      ar: 'لينغ شو، أسئلة شفهية',
    },
    classic: {
      zh: '「阳气尽而阴气盛，则目瞑；阴气尽而阳气盛，则寤矣。」醒和睡跟着阴阳交替。《素问·四气调神大论》里四季的卧起并不相同，春夏偏早起，秋早卧早起，冬早卧晚起、必待日光。那一页在四季养生，这里不另写钟点。',
      en: '“When yang qi is exhausted and yin qi is abundant, the eyes close; when yin qi is exhausted and yang qi is abundant, one wakes.” Waking and sleep follow the alternation of yin and yang. In “Regulating the Spirit with the Four Qi,” lying down and rising are not the same in every season: spring and summer favor rising early, autumn favors lying down early and rising early, winter favors lying down early and rising late, waiting for daylight. Those lines stay on the seasons page. This page does not add a clock time.',
      ar: '«إذا نفد يانغ تشي وكثر يين تشي أُغمضت العينان؛ وإذا نفد يين تشي وكثر يانغ تشي استيقظ الإنسان.» اليقظة والنوم يتبعان تبادل الين واليانغ. في فصل ضبط الروح مع تشي الفصول الأربعة، النوم والاستيقاظ ليسا واحداً في كل فصل. تلك السطور تبقى في صفحة الفصول. هذه الصفحة لا تضيف ساعة.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.3.4 安卧有方',
      en: 'T/CACM 1067—2018 · 4.3.4 proper sleeping habit',
      ar: 'T/CACM 1067—2018 · 4.3.4 عادة نوم مناسبة',
    },
    standard: {
      zh: '「安卧有方」指按自然界与人体阴阳变化，采取合理的睡眠方法和措施，保证高质量睡眠。具体包括睡前调摄、睡眠宜忌、醒后保养和防治失眠。定义里没有几点睡、睡几小时，也没有助眠药。',
      en: '“A proper sleeping habit” means using reasonable sleep methods according to the yin–yang changes of nature and the body, so as to keep sleep of good quality. It includes care before sleep, what to do and avoid in sleep, care after waking, and preventing and treating insomnia. The definition sets no clock time, no number of hours, and no sleep medicine.',
      ar: '«عادة النوم المناسبة» تعني اتخاذ طرق نوم معقولة وفق تغير الين واليانغ في الطبيعة والجسم، للحفاظ على نوم جيد. وتشمل العناية قبل النوم، وما يُفعل ويُتجنب، والعناية بعد الاستيقاظ، والوقاية من الأرق وعلاجه. التعريف لا يحدد ساعة ولا عدد ساعات ولا دواء نوم.',
    },
    modernFrom: {
      zh: '美国睡眠医学会、睡眠研究学会，2015',
      en: 'American Academy of Sleep Medicine and Sleep Research Society, 2015',
      ar: 'الأكاديمية الأمريكية لطب النوم وجمعية أبحاث النوم، 2015',
    },
    modern: {
      zh: '这两家学会的共识写的是：18 至 60 岁成年人，经常性每晚睡眠 7 小时或以上，有助健康。经常少于 7 小时，与体重、血糖、血压、情绪等方面的风险有关。每个人需要睡多久仍有差别。这不是《内经》的句子，也不是上面那条团体标准里的钟点。',
      en: 'Their consensus says adults aged 18 to 60 should regularly sleep 7 or more hours a night to support health. Regularly sleeping less than 7 hours is associated with risks involving weight, blood glucose, blood pressure, and mood, among others. How long a given person needs still varies. This sentence is not in the Neijing, and it is not a clock time inside the group standard above.',
      ar: 'يقول إجماعهما إن البالغين من 18 إلى 60 سنة ينامون بانتظام 7 ساعات أو أكثر في الليل لدعم الصحة. النوم أقل من 7 ساعات بانتظام مرتبط بمخاطر في الوزن وسكر الدم وضغط الدم والمزاج وغيرها. حاجة كل شخص تبقى مختلفة. هذه الجملة ليست في الكلاسيكيات، وليست ساعة داخل المعيار أعلاه.',
    },
    note: {
      zh: '偶尔一晚没睡着，先按四季起居，把睡前的亮屏、浓茶和酒收一收。经常睡不着或早醒，并且白天明显受影响，去医疗机构。不要自行长期服用助眠药，也不要把标准里的「防治失眠」理解成自己选方。',
      en: 'If one night goes badly, follow the seasonal rhythm and ease bright screens, strong tea, and alcohol before bed. If poor sleep or early waking is frequent and the day is clearly affected, go to a medical institution. Do not take sleep medicine on your own for a long time, and do not read “preventing and treating insomnia” in the standard as choosing a formula yourself.',
      ar: 'إن ساءت ليلة واحدة، اتبع إيقاع الفصل وخفف الشاشة الساطعة والشاي الثقيل والكحول قبل النوم. إن تكرر الأرق أو الاستيقاظ المبكر وتأثر النهار بوضوح، اذهب إلى مؤسسة طبية. لا تأخذ دواء نوم طويلاً من تلقاء نفسك، ولا تقرأ «الوقاية والعلاج» في المعيار على أنه اختيار وصفة بنفسك.',
    },
  },
  {
    id: 'stress',
    name: { zh: '压力', en: 'Stress', ar: 'الضغط' },
    classicFrom: {
      zh: '《素问·举痛论》',
      en: 'Suwen, On Pain',
      ar: 'سوين، في الألم',
    },
    classic: {
      zh: '《内经》没有「压力」这个词。持续的担心、受惊、劳累，书里是分开写的：「思则气结」「惊则气乱」「劳则气耗」。不能把今天说的压力整个算成其中一句。',
      en: 'The Neijing has no word “stress.” Ongoing worry, fright, and overwork are written separately: pensiveness knots qi, fright disorders qi, overwork consumes qi. Today’s word “stress” cannot be folded into just one of those lines.',
      ar: 'ليس في الكلاسيكيات كلمة «ضغط». القلق المستمر والفزع والإرهاق مكتوبة منفصلة: الفكر يعقد تشي، والفزع يخلطه، والإرهاق يستهلكه. لا تُحسب كلمة الضغط اليوم جملة واحدة من هذه.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.1.3 情志调养',
      en: 'T/CACM 1067—2018 · 4.1.3 emotion regulation',
      ar: 'T/CACM 1067—2018 · 4.1.3 تنظيم الانفعال',
    },
    standard: {
      zh: '情志调养的落点是心情舒畅、气和志达。标准没有把「压力」单列成一条，也没有压力分数或分级表。',
      en: 'Emotion regulation aims at an easy mood, with qi and will moving smoothly. The standard does not list “stress” as its own entry, and it has no stress score or grading table.',
      ar: 'غاية تنظيم الانفعال مزاج مريح وسير سلس لتشي والإرادة. المعيار لا يفرد «الضغط» بنداً، وليس فيه درجة ضغط أو جدول تصنيف.',
    },
    modernFrom: {
      zh: '世界卫生组织 · 压力问答',
      en: 'World Health Organization · questions and answers on stress',
      ar: 'منظمة الصحة العالمية · أسئلة وأجوبة عن الضغط',
    },
    modern: {
      zh: '世界卫生组织把压力说明为：困难处境引起的担心或精神紧张。它是人都会有的反应，用来应对挑战。压力下可能难以放松、容易烦躁、难以集中，也可伴有头痛、身体疼痛、胃不舒服或睡不好，食欲也会变。长期压力可能加重原有的健康问题；如果已经持续影响日常，焦虑和抑郁需要医疗服务。',
      en: 'WHO describes stress as a state of worry or mental tension caused by a difficult situation. It is a natural human response that helps us meet challenges. Under stress it can be hard to relax; people may be irritable or unable to concentrate, and may have headache, body pain, an upset stomach, or trouble sleeping, and appetite may change. Chronic stress can worsen existing health problems. If it has become persistent and affects daily functioning, anxiety and depression need health care.',
      ar: 'تصف المنظمة الضغط بأنه قلق أو توتر ذهني بسبب وضع صعب. هو استجابة بشرية طبيعية لمواجهة التحديات. قد يصعب معه الاسترخاء، ويظهر التهيج وصعوبة التركيز، وقد يرافقه صداع أو ألم أو اضطراب معدة أو صعوبة نوم، وقد تتغير الشهية. الضغط المزمن قد يفاقم مشكلات صحية قائمة. إن استمر وأثر في الحياة اليومية، فالقلق والاكتئاب يحتاجان إلى رعاية صحية.',
    },
    note: {
      zh: '一次忙、一次生气，不能直接写成某一种体质或某一种病。能先做的是把作息稳住，把事情说给可信的人，白天仍有活动。酒和烟不是解压的办法。',
      en: 'One busy stretch, or one burst of anger, is not itself a constitution type or a disease. What can come first is steadying the daily rhythm, telling a trusted person, and still moving during the day. Alcohol and tobacco are not a way to relieve this.',
      ar: 'فترة انشغال أو نوبة غضب ليست بذاتها نمطاً جسمياً أو مرضاً. ما يمكن البدء به هو تثبيت الإيقاع اليومي، والحديث مع شخص موثوق، والحركة في النهار. الكحول والتبغ ليسا طريقة لتخفيف هذا.',
    },
  },
  {
    id: 'music',
    name: { zh: '音乐', en: 'Music', ar: 'الموسيقى' },
    classicFrom: {
      zh: '《素问·金匮真言论》',
      en: 'Suwen, True Words from the Golden Cabinet',
      ar: 'سوين، الكلام الحق من الخزانة الذهبية',
    },
    classic: {
      zh: '这一篇把方位、颜色、声音和脏腑归成一类，例如东方通于肝，「其音角」。这是归类，不是曲目，也没有写某一首歌治疗某一脏。',
      en: 'This chapter groups direction, color, sound, and organ together. For example, the east connects with the liver, “its tone is jue.” That is a classification, not a playlist, and it does not name a song that treats an organ.',
      ar: 'يجمع هذا الفصل الجهة واللون والصوت والعضو. مثلاً الشرق يتصل بالكبد، «نغمه جيوي». هذا تصنيف لا قائمة أغانٍ، ولا يذكر أغنية تعالج عضواً.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.1.4 音乐养生',
      en: 'T/CACM 1067—2018 · 4.1.4 health preservation by listening to music',
      ar: 'T/CACM 1067—2018 · 4.1.4 حفظ الصحة بالاستماع إلى الموسيقى',
    },
    standard: {
      zh: '「音乐养生」指按五音的特点，把音乐和人体的脏腑情志结合起来调适，目的包括颐养身心、防病治病。标准没有公布曲目，也没有规定听多久。',
      en: '“Health preservation by music” means adjusting by the character of the five tones, joining music with the organs and emotions, for the stated purposes of nurturing body and mind and of preventing and treating disease. The standard publishes no playlist and sets no listening time.',
      ar: '«حفظ الصحة بالموسيقى» يعني المواءمة حسب خصائص النغمات الخمس، بربط الموسيقى بالأعضاء والانفعال، لأغراض تشمل رعاية الجسد والنفس والوقاية والعلاج. المعيار لا ينشر قائمة ولا يحدد مدة استماع.',
    },
    note: {
      zh: '「防病治病」是这条术语写明的目的，不是指定某一首曲子治疗读者的某一脏。喜欢的曲子可以当日常调适。不要把五音当成药。',
      en: '“Preventing and treating disease” is the purpose written into the term. It does not assign one piece of music to treat one of the reader’s organs. Music you like can be an ordinary daily adjustment. The five tones are not a medicine.',
      ar: '«الوقاية والعلاج» غرض مكتوب في المصطلح، وليس تعيين قطعة لعلاج عضو عند القارئ. الموسيقى التي تحبها يمكن أن تكون ضبطاً يومياً عادياً. النغمات الخمس ليست دواء.',
    },
  },
  {
    id: 'help',
    name: { zh: '何时求助', en: 'When to ask for help', ar: 'متى تطلب المساعدة' },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 3.4.1.1 情志复',
      en: 'T/CACM 1067—2018 · 3.4.1.1 relapse due to emotional disorder',
      ar: 'T/CACM 1067—2018 · 3.4.1.1 انتكاس بسبب اضطراب انفعالي',
    },
    standard: {
      zh: '「情志复」指因情感因素引起已经痊愈的疾病再次发生。这一页不能判断某一次加重是不是情志复。',
      en: '“Relapse due to emotional disorder” means an illness that had healed occurs again because of an emotional factor. This page cannot judge whether one worsening is that kind of relapse.',
      ar: '«الانتكاس بسبب الانفعال» يعني أن مرضاً كان قد شُفي يعود بسبب عامل عاطفي. هذه الصفحة لا تحكم إن كان تفاقم ما من هذا النوع.',
    },
    modernFrom: {
      zh: '世界卫生组织 · 抑郁事实清单',
      en: 'World Health Organization · depression fact sheet',
      ar: 'منظمة الصحة العالمية · صحيفة وقائع الاكتئاب',
    },
    modern: {
      zh: '世界卫生组织写明：抑郁发作不同于平常的心情起伏。情绪低落，或对活动失去兴趣和愉快感，会占一天里的大部分时间，几乎每天都这样，并且至少两周。常同时有睡眠、食欲、精力或注意力的改变。出现想死或自杀的想法，需要立刻得到帮助。',
      en: 'WHO states that a depressive episode is different from ordinary mood changes. A low mood, or loss of interest and pleasure in activities, is present most of the day, nearly every day, for at least two weeks. Sleep, appetite, energy, or concentration often change as well. Thoughts of dying or suicide need help at once.',
      ar: 'توضح المنظمة أن نوبة الاكتئاب تختلف عن تقلب المزاج العادي. المزاج المنخفض، أو فقدان الاهتمام والمتعة بالأنشطة، يكون معظم اليوم وكل يوم تقريباً، ولأسبوعين على الأقل. وكثيراً ما يتغير معه النوم أو الشهية أو الطاقة أو التركيز. أفكار الموت أو الانتحار تحتاج مساعدة فورية.',
    },
    note: {
      zh: '《素问》没有「抑郁障碍」这个病名。有伤害自己或他人的想法，或正在这样做，拨打 120，或到最近的急诊。情绪上需要有人听，可拨打国家卫生健康委设置的全国统一心理援助热线 12356（国卫医政函〔2024〕259号）。热线提供心理健康教育和危机时的支持；持续的问题仍要到医疗机构面诊。本页不判断读者有没有抑郁，也不提供药物或疗程。',
      en: 'Suwen has no disease name “depressive disorder.” If there are thoughts of harming yourself or someone else, or that is already happening, call the local emergency number or go to the nearest emergency department. In China, the medical emergency number is 120. If you need someone to listen, the National Health Commission’s national psychological-support line is 12356 (NHC medical-administration letter 〔2024〕 No. 259). The line offers mental-health education and support in a crisis. A problem that continues still needs an in-person visit. This page does not decide whether the reader has depression, and it offers no medicine or course of treatment.',
      ar: 'ليس في «سوين» اسم مرض «اضطراب اكتئابي». إن وُجدت أفكار بإيذاء النفس أو الغير، أو كان ذلك يحدث، اتصل برقم الطوارئ المحلي أو اذهب إلى أقرب طوارئ. في الصين رقم الطوارئ الطبية 120. إن احتجت إلى من يسمع، فخط الدعم النفسي الوطني للجنة الصحة الوطنية هو 12356. الخط للتعليم والدعم في الأزمة. المشكلة المستمرة تحتاج زيارة حضورية. هذه الصفحة لا تقرر إن كان القارئ مكتئباً، ولا تقدم دواء أو مساراً علاجياً.',
    },
  },
]
