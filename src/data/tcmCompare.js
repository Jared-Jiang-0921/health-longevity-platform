/**
 * 中西医对照教育摘要。
 * 治未病：《素问·四气调神大论》。已病防传变的书中治法：《金匮要略·脏腑经络先后病》。
 * 人与天地四时：《素问·宝命全形论》。
 * 随证治之：《伤寒论》。那是医师面对误治坏病时的句子，不是读者自行辨证。
 * 术语：T/CACM 1067—2018 治未病、欲病、未病先防、已病防变、病瘥防复、中医思维；
 * 「整体观念」「辨证论治」只出现在辨证施膳的定义里。标准没有「整体观」「辨证施养」两个词条。
 * 现代对照：世界卫生组织《组织法》对健康的原则（1946 年通过，1948 年生效）；
 * 《健康促进术语词汇表》（2021）的一级、二级、三级预防。两套话说的不是同一句话。
 * 不下亚健康结论，不把「当先实脾」写成读者的进补，不开筛查单，不开个人处方。
 */
export const TCM_COMPARE_SOURCE = {
  zh: '治未病的古典依据是《素问·四气调神大论》。已病之后防止传变，书里的例子见《金匮要略·脏腑经络先后病》，其中的治法不抄成读者的进补。人与天地、四时的句子见《素问·宝命全形论》。随证处理的句子见《伤寒论》，那是给医师的。术语依据中华中医药学会团体标准 T/CACM 1067—2018：治未病、未病先防、已病防变、病瘥防复。标准没有「整体观」和「辨证施养」这两个词条；「整体观念」「辨证论治」写在辨证施膳里面。现代对照依据世界卫生组织《组织法》里的健康原则，以及《健康促进术语词汇表》（2021）的三级预防。两边不是逐句对译。这一页不下诊断，不开筛查，也不写个人处方。',
  en: 'The classical line for treating disease before it arises is Suwen, “Regulating the Spirit with the Four Qi.” A book example of blocking transmission after illness has started is in the Jingui Yaolue; its treatment line is not copied as the reader’s tonic. The human being, heaven, earth, and the four seasons are in “Preserving Life and the Body Whole.” Matching treatment to the pattern is a physician’s line in the Shanghan Lun. Terms follow T/CACM 1067—2018. The standard has no entries named “holism” or “pattern-based daily care”; “holistic concept” and “pattern differentiation and treatment” appear inside medicated-diet determination. The modern side follows the health principle in the WHO Constitution and the three levels of prevention in the WHO Health Promotion Glossary of Terms (2021). The two sides are not sentence-for-sentence translations. This page gives no diagnosis, no screening order, and no personal prescription.',
  ar: 'جملة الوقاية قبل المرض من «سوين». مثال منع الانتقال بعد المرض من «جين غوي»، وعبارته العلاجية لا تُنسخ كمقوٍ للقارئ. الإنسان والسماء والأرض والفصول من فصل حفظ الحياة. مطابقة العلاج للنمط جملة للطبيب في «شانغ هان». المصطلحات من T/CACM 1067—2018. المعيار بلا مدخلين باسم النظرة الكلية أو العناية حسب النمط؛ هاتان العبارتان داخل وجبة دوائية. الجانب الحديث من دستور منظمة الصحة العالمية ومستويات الوقاية الثلاثة في مسرد 2021. الجانبان ليسا ترجمة جملة بجملة. هذه الصفحة لا تشخيص ولا طلب فحص ولا وصفة شخصية.',
}

export const TCM_COMPARE_TOPICS = [
  {
    id: 'before',
    name: { zh: '治未病', en: 'Before disease', ar: 'قبل المرض' },
    classicFrom: {
      zh: '《素问·四气调神大论》',
      en: 'Suwen, Regulating the Spirit with the Four Qi',
      ar: 'سوين، ضبط الروح مع تشي الفصول الأربعة',
    },
    classic: {
      zh: '「是故圣人不治已病治未病，不治已乱治未乱。」同篇接着说，病已经形成再用药，像渴了才去挖井。说的是宜早，不是说已经病了就不用就医。',
      en: '“Therefore the sage does not treat disease already formed, but treats what has not yet become disease; does not govern disorder already formed, but governs what has not yet become disorder.” The same chapter adds that using medicine after disease has formed is like digging a well after one is thirsty. It says act early. It does not say that once ill, one need not seek care.',
      ar: '«لذلك الحكيم لا يعالج المرض الذي تشكل، بل ما لم يصر مرضاً؛ ولا يدبر الاضطراب الذي تشكل، بل ما لم يصر اضطراباً.» ويتابع الفصل أن الدواء بعد تشكل المرض كالذي يحفر بئراً بعد العطش. المقصود المبادرة، لا أن المريض لا يحتاج إلى رعاية.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 2.8 治未病',
      en: 'T/CACM 1067—2018 · 2.8 prevention of disease',
      ar: 'T/CACM 1067—2018 · 2.8 الوقاية من المرض',
    },
    standard: {
      zh: '「治未病」指未病先防、既病防变、瘥后防复，保护健康的健康医学理念。它是一套理念的名称，不是某一种病的诊断，也不是一张养生菜单。',
      en: '“Prevention of disease” means preventing occurrence before disease, preventing change once disease exists, and preventing relapse after recovery: a health-medicine idea aimed at protecting health. It is the name of an idea. It is not a diagnosis of one disease, and it is not a wellness menu.',
      ar: '«الوقاية من المرض» تعني المنع قبل الحدوث، ومنع التغير بعد الحدوث، ومنع الانتكاس بعد الشفاء: فكرة طبية لحماية الصحة. هي اسم لفكرة، لا تشخيص لمرض واحد، ولا قائمة عناية.',
    },
    modernFrom: {
      zh: '世界卫生组织《组织法》',
      en: 'Constitution of the World Health Organization',
      ar: 'دستور منظمة الصحة العالمية',
    },
    modern: {
      zh: '《组织法》1946 年通过、1948 年生效。其中一条原则是：健康是身体、精神和社会适应的完好状态，而不仅仅是没有疾病或虚弱。这不是「治未病」的翻译。中医说的未病，也不等于这句定义里的完好状态。',
      en: 'The Constitution was adopted in 1946 and entered into force in 1948. One principle says health is a state of complete physical, mental and social well-being and not merely the absence of disease or infirmity. That is not a translation of “治未病.” What Chinese medicine calls “not yet ill” is also not the same as the complete well-being in this sentence.',
      ar: 'اعتُمد الدستور عام 1946 ودخل حيز النفاذ عام 1948. أحد مبادئه أن الصحة حالة من اكتمال العافية الجسدية والنفسية والاجتماعية، وليست مجرد انعدام المرض أو الوهن. هذه ليست ترجمة لـ«الوقاية قبل المرض». وما يسميه الطب الصيني «لم يمرض بعد» ليس هو اكتمال العافية في هذه الجملة.',
    },
    note: {
      zh: '两边都反对把「没查出病」当成健康的全部。用哪一边的话，都不能代替已经出现的急症和当面诊疗。',
      en: 'Both sides refuse to treat “no disease found” as the whole of health. Neither wording replaces an emergency that is already present, or an in-person consultation.',
      ar: 'الجانبان يرفضان اعتبار «لم يُكتشف مرض» كل الصحة. لا جملة منهما تغني عن طارئ قائم أو عن استشارة حضورية.',
    },
  },
  {
    id: 'three',
    name: { zh: '三层内容', en: 'Three parts', ar: 'ثلاثة أقسام' },
    classicFrom: {
      zh: '《金匮要略·脏腑经络先后病》',
      en: 'Jingui Yaolue, the organs, channels, and which disease comes first',
      ar: 'جين غوي، الأعضاء والقنوات وأي مرض يسبق',
    },
    classic: {
      zh: '张仲景写：「夫治未病者，见肝之病，知肝传脾，当先实脾。」这是病已经见到以后，按传变去想下一步。原文没有把预防分成三层，也没有「瘥后防复」这个词。「当先实脾」是书里的治法，不是叫读者自行补脾。',
      en: 'Zhang Zhongjing writes: the one who treats disease before it advances, seeing liver disease, knows the liver may transmit to the spleen, and should first secure the spleen. That is thinking about the next step after a disease is already seen. The passage does not divide prevention into three layers, and it has no term “prevent relapse after recovery.” “First secure the spleen” is the book’s treatment line. It is not an instruction for the reader to tonify the spleen on their own.',
      ar: 'يكتب تشانغ تشونغ جينغ: من يعالج قبل استفحال المرض، إذا رأى مرض الكبد عرف أنه قد ينتقل إلى الطحال، فيثبت الطحال أولاً. هذا تفكير في الخطوة التالية بعد أن ظهر المرض. النص لا يقسم الوقاية ثلاث طبقات، ولا فيه مصطلح «منع الانتكاس بعد الشفاء». «تثبيت الطحال أولاً» جملة علاج في الكتاب، وليست أمراً للقارئ بأن يقوي طحاله بنفسه.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 3.1、3.3、3.4',
      en: 'T/CACM 1067—2018 · 3.1, 3.3, 3.4',
      ar: 'T/CACM 1067—2018 · 3.1 و3.3 و3.4',
    },
    standard: {
      zh: '前言把基本内容写成未病先防、既病防变、瘥后防复。条目是：3.1 未病先防，在疾病发生之前采取措施，增强正气，防止发生；3.3 已病防变，又名既病防变，疾病发生之后早期诊断、早期治疗，防止发展和传变；3.4 病瘥防复，痊愈后防止再次发生。2.6 欲病指阴阳失调但尚未发病，并写明亚健康属于欲病范畴。标准在扶助正气里引用了「正气存内，邪不可干」，没有把它写成一项化验数值。',
      en: 'The preface names three parts: prevent before disease, prevent change once disease exists, and prevent relapse after recovery. The entries are: 3.1, before disease occurs, take measures and support healthy qi; 3.3, also called preventing change of existing disease, early diagnosis and early treatment after disease starts, to limit development and transmission; 3.4, after recovery, prevent it happening again. 2.6, a pre-diseased state, is yin and yang out of harmony before disease occurs, and the standard says suboptimal health belongs in that category. Under supporting healthy qi it quotes “when healthy qi is kept inside, pathogenic qi cannot intrude,” and it does not turn that sentence into a laboratory number.',
      ar: 'المقدمة تسمي ثلاثة أقسام: المنع قبل المرض، ومنع التغير بعد وجوده، ومنع الانتكاس بعد الشفاء. البنود: 3.1 قبل الحدوث، باتخاذ تدابير ودعم تشي السليم؛ 3.3 التشخيص والعلاج المبكران بعد الحدوث لمنع التطور والانتقال؛ 3.4 بعد الشفاء منع التكرار. 2.6 حالة ما قبل المرض، اختلال يين ويانغ قبل الحدوث، والمعيار يضع «الصحة دون المثلى» في هذا الباب. وفي دعم تشي السليم يقتبس «إذا بقي تشي السليم في الداخل لم يستطع الضار الاقتحام»، ولا يجعل الجملة رقماً مخبرياً.',
    },
    note: {
      zh: '「亚健康」在标准里被放进欲病，本页仍然不给读者下这个结论。早期诊断、早期治疗在医疗机构做。痊愈后是否算复发，要由接诊的人判断，不由这一页判断。',
      en: 'The standard places “suboptimal health” inside the pre-diseased state. This page still does not assign that label to the reader. Early diagnosis and early treatment happen in a medical institution. Whether something after recovery counts as relapse is judged by the clinician seeing the person, not by this page.',
      ar: 'يضع المعيار «الصحة دون المثلى» داخل حالة ما قبل المرض. هذه الصفحة لا تلصق هذا الوصف بالقارئ. التشخيص والعلاج المبكران في مؤسسة طبية. وهل ما بعد الشفاء انتكاس، يحكم به الطبيب الذي يرى الشخص، لا هذه الصفحة.',
    },
  },
  {
    id: 'whole',
    name: { zh: '整体观', en: 'Seeing the whole', ar: 'رؤية الكل' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '这个词不在《内经》里',
      en: 'This word is not in the Neijing',
      ar: 'هذه الكلمة ليست في الكلاسيكيات',
    },
    classic: {
      zh: '《内经》没有「整体观」四个字。《素问·宝命全形论》写的是「人以天地之气生，四时之法成。」人由天地之气生成，生活的节律跟着四时。这是联系，不是一次就能看完全身的方法。',
      en: 'The Neijing does not contain the four-character term “holistic view.” Suwen, “Preserving Life and the Body Whole,” says a person is born of the qi of heaven and earth and is formed by the pattern of the four seasons. That is a connection. It is not a method that sees the whole body in one pass.',
      ar: 'ليس في الكلاسيكيات مصطلح «النظرة الكلية». يقول «سوين» إن الإنسان يولد من تشي السماء والأرض ويتشكل بنظام الفصول الأربعة. هذه صلة، وليست طريقة ترى الجسد كله في مرة واحدة.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 2.3 中医思维；4.11.3.1 辨证施膳',
      en: 'T/CACM 1067—2018 · 2.3 TCM thinking; 4.11.3.1 syndrome-based medicated diet',
      ar: 'T/CACM 1067—2018 · 2.3 التفكير الطبي الصيني؛ 4.11.3.1 الوجبة الدوائية حسب النمط',
    },
    standard: {
      zh: '标准没有单独的「整体观」条目。2.3 把中医思维写成：基于中国传统文化，以直觉意象、整体辩证为特点。「整体观念」四个字出现在辨证施膳的定义里，用在按个体状态配药膳，不是给读者做全身结论。',
      en: 'The standard has no separate entry for “holistic view.” Entry 2.3 describes TCM thinking as based on Chinese traditional culture, characterized by intuitive imagery and holistic pattern thinking. The words “holistic concept” appear in the definition of syndrome-based medicated diet, for matching a medicated diet to a person’s state. They are not a whole-body conclusion for the reader.',
      ar: 'لا مدخل مستقلاً لـ«النظرة الكلية». البند 2.3 يصف التفكير الطبي الصيني بأنه قائم على الثقافة الصينية، ويتميز بالصورة الحدسية والجدل الكلي. عبارة «المفهوم الكلي» ترد في تعريف الوجبة الدوائية حسب النمط، لمواءمة الوجبة مع حال الشخص، وليست خلاصة عن جسد القارئ كله.',
    },
    note: {
      zh: '后来的教材用「整体观」概括人与天地、四时、脏腑之间的联系。这个概括不能理解成一张问卷或一张舌头照片就看完了一个人。前面的体质计分仍然只是教育对照。',
      en: 'Later textbooks use “holistic view” to summarize the links among the person, heaven and earth, the seasons, and the organs. That summary does not mean a questionnaire or one tongue photo has seen a whole person. The constitution score earlier on this site remains an educational comparison.',
      ar: 'تستخدم الكتب التعليمية اللاحقة «النظرة الكلية» لتلخيص الصلات بين الإنسان والسماء والأرض والفصول والأعضاء. هذا التلخيص لا يعني أن استبياناً أو صورة لسان رأت الشخص كله. درجة نمط الجسم في هذا الموقع تبقى مقارنة تعليمية.',
    },
  },
  {
    id: 'pattern',
    name: { zh: '辨证施养', en: 'Care by pattern', ar: 'العناية حسب النمط' },
    classicFrom: {
      zh: '《伤寒论》',
      en: 'Shanghan Lun',
      ar: 'شانغ هان لون',
    },
    classic: {
      zh: '「观其脉证，知犯何逆，随证治之。」这是医师看着脉和证，知道错在哪一种逆，再按那个证去处理。原文没有「辨证施养」。它不是让读者给自己辨证，然后选食谱或选药。',
      en: '“Observe the pulse and the signs, know which adverse change has been offended, and treat according to the pattern.” A physician looks at pulse and signs, sees which adverse course occurred, and then treats that pattern. The passage has no phrase “daily care by pattern.” It does not tell the reader to differentiate their own pattern and then choose a menu or a medicine.',
      ar: '«انظر النبض والعلامات، واعرف أي اختلال وقع، وعالج وفق النمط.» الطبيب ينظر إلى النبض والعلامات، ويرى أي مسار مخالف حدث، ثم يعالج ذلك النمط. ليس في النص «عناية يومية حسب النمط». ولا يأمر القارئ بأن يميز نمطه ثم يختار قائمة أو دواء.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 4.11.3.1 辨证施膳',
      en: 'T/CACM 1067—2018 · 4.11.3.1 medicated diet by syndrome',
      ar: 'T/CACM 1067—2018 · 4.11.3.1 الوجبة الدوائية حسب النمط',
    },
    standard: {
      zh: '标准没有「辨证施养」这个术语。相近的条目是辨证施膳：在中医理论指导下，根据个体的生理病理状态，按照整体观念和辨证论治的需求来施药膳。它说的是药膳，而且要在理论指导下做。标准没有在这里授权读者自己开膳。',
      en: 'The standard has no term “daily care by pattern.” The nearby entry is medicated diet by syndrome: under TCM theory, according to the person’s physiological and pathological state, and according to the need for a holistic concept and for pattern differentiation and treatment, give a medicated diet. It is about medicated diet, and it is to be done under that theory. The standard does not authorize the reader to write that diet for themselves.',
      ar: 'ليس في المعيار مصطلح «العناية اليومية حسب النمط». البند القريب هو الوجبة الدوائية حسب النمط: بتوجيه نظرية الطب الصيني، ووفق الحال الفسيولوجية والمرضية للفرد، وحسب حاجة المفهوم الكلي وتمييز النمط والعلاج، تُعطى وجبة دوائية. الكلام عن وجبة دوائية، وتُعمل تحت تلك النظرية. المعيار لا يأذن للقارئ بأن يكتبها لنفسه.',
    },
    note: {
      zh: '本站栏目用「辨证施养」表示：调养要看具体状态，不能一套方法给所有人。这是本站的说法，不是标准里的词，也不是体质分数换算出来的个人方案。药膳仍不在这一页开。',
      en: 'This site’s column uses “care by pattern” to say that daily care depends on the actual state, and one method is not for everyone. That is this site’s wording. It is not a term in the standard, and it is not a personal plan calculated from a constitution score. Medicated diet is still not written on this page.',
      ar: 'يستخدم عمود هذا الموقع «العناية حسب النمط» ليعني أن العناية اليومية تعتمد على الحال الفعلي، وأن طريقة واحدة ليست للجميع. هذه صياغة الموقع، ليست مصطلحاً في المعيار، وليست خطة شخصية محسوبة من درجة النمط. الوجبة الدوائية لا تُكتب في هذه الصفحة.',
    },
  },
  {
    id: 'levels',
    name: { zh: '三级预防', en: 'Three levels of prevention', ar: 'مستويات الوقاية الثلاثة' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '《内经》没有这三层的名称',
      en: 'The Neijing has no names for these three levels',
      ar: 'لا أسماء لهذه المستويات الثلاثة في الكلاسيكيات',
    },
    classic: {
      zh: '一级预防、二级预防、三级预防，不是《内经》或团体标准里的词。不能把它们回写成治未病的原文。',
      en: 'Primary, secondary, and tertiary prevention are not terms in the Neijing or in the group standard. They cannot be written back as the original wording of treating disease before it arises.',
      ar: 'الوقاية الأولية والثانوية والثالثية ليست مصطلحات في الكلاسيكيات ولا في المعيار الجماعي. لا تُعاد كتابتها كأنها النص الأصلي للوقاية قبل المرض.',
    },
    standardFrom: {
      zh: '不能把标准的三句话当成这三层',
      en: 'The standard’s three sentences are not these three levels',
      ar: 'جمل المعيار الثلاث ليست هذه المستويات الثلاثة',
    },
    standard: {
      zh: '未病先防、已病防变、病瘥防复是团体标准自己的分法。它没有使用一级、二级、三级这套公共卫生名称，也没有把筛查写成中医术语。',
      en: 'Preventing before disease, preventing change after disease starts, and preventing relapse after recovery are the group standard’s own division. It does not use the public-health names primary, secondary, and tertiary, and it does not write screening as a TCM term.',
      ar: 'المنع قبل المرض، ومنع التغير بعد بدئه، ومنع الانتكاس بعد الشفاء، تقسيم المعيار الجماعي نفسه. وهو لا يستخدم أسماء الصحة العامة: أولي وثانوي وثالثي، ولا يكتب الفحص المبكر كمصطلح في الطب الصيني.',
    },
    modernFrom: {
      zh: '世界卫生组织《健康促进术语词汇表》，2021',
      en: 'WHO Health Promotion Glossary of Terms, 2021',
      ar: 'مسرد منظمة الصحة العالمية لمصطلحات تعزيز الصحة، 2021',
    },
    modern: {
      zh: '词汇表写的是：一级预防面向多种疾病共同的危险因素，例如烟草、酒精、肥胖和高血压，用来防止疾病一开始发生，也可以包括改变会增加这些风险的环境和社会条件。二级预防面向尽早发现已经存在的疾病，以阻止或延缓进展及其影响，例如筛查和例行健康检查。三级预防一般指对已经确立的疾病进行管理和康复，以减少恶化和并发症，例如患者教育和物理治疗。',
      en: 'The glossary says primary prevention is directed at risk factors common to many diseases, such as tobacco, alcohol, obesity, and high blood pressure, in order to prevent a disorder from occurring in the first place; it may also include changing environmental and social conditions that increase those risks. Secondary prevention is directed at early detection of disease that already exists, to arrest or delay its progression and effects, for example by screening and routine health checks. Tertiary prevention generally means management and rehabilitation of established disease, to reduce deterioration and complications, for example by patient education and physical therapy.',
      ar: 'يقول المسرد إن الوقاية الأولية تتجه إلى عوامل خطر مشتركة لأمراض كثيرة، مثل التبغ والكحول والسمنة وارتفاع ضغط الدم، لمنع حدوث الاضطراب من البداية، وقد تشمل تغيير ظروف بيئية واجتماعية تزيد هذه المخاطر. والثانوية تتجه إلى الاكتشاف المبكر لمرض موجود، لوقف تقدمه أو تأخيره وآثاره، مثل الفحص والفحوص الصحية الدورية. والثالثية عموماً إدارة مرض مستقر وإعادة تأهيله، لتقليل التدهور والمضاعفات، مثل تثقيف المريض والعلاج الطبيعي.',
    },
    note: {
      zh: '可以这样看，但不要逐条等同：一级预防更接近「发生之前」，不过它举的是烟草和血压这些危险因素，不是体质分数。二级预防和「已病防变」都强调趁早，但筛查不是《内经》的方法。三级预防包含长期管理和康复；「病瘥防复」只讲痊愈后不要再发生，范围更窄。本页不开筛查单，也不把康复训练写成处方。',
      en: 'They can be read side by side, but not matched line for line. Primary prevention is closer to “before it occurs,” yet its examples are risks such as tobacco and blood pressure, not a constitution score. Secondary prevention and “prevent change once disease exists” both stress acting early, but screening is not a Neijing method. Tertiary prevention includes long-term management and rehabilitation; “prevent relapse after recovery” only says do not let it happen again, which is narrower. This page orders no screening and does not write rehabilitation as a prescription.',
      ar: 'يمكن قراءتهما جنباً إلى جنب، لا مطابقة سطر بسطر. الوقاية الأولية أقرب إلى «قبل الحدوث»، لكن أمثلتها مخاطر كالتبغ وضغط الدم، لا درجة نمط الجسم. والثانوية و«منع التغير بعد المرض» كلتاهما تؤكدان المبادرة، لكن الفحص ليس طريقة من الكلاسيكيات. والثالثية تشمل الإدارة الطويلة وإعادة التأهيل؛ و«منع الانتكاس بعد الشفاء» يقول فقط ألا يتكرر، وهو أضيق. هذه الصفحة لا تطلب فحصاً ولا تكتب إعادة التأهيل كوصفة.',
    },
  },
  {
    id: 'limit',
    name: { zh: '对照的限度', en: 'Limit of the comparison', ar: 'حد المقارنة' },
    classicKind: 'boundary',
    classicFrom: {
      zh: '本站不把对照收成处方',
      en: 'This site does not turn the comparison into a prescription',
      ar: 'هذا الموقع لا يحوّل المقارنة إلى وصفة',
    },
    classic: {
      zh: '上面的句子各自有出处。放在一起，是为了看它们说了什么、没说什么。不能加成「你属于某一证，从今天起按某一法调养」。',
      en: 'Each sentence above has its own source. Putting them together is for seeing what they say and what they do not say. They do not add up to “you belong to this pattern, so from today follow this method.”',
      ar: 'كل جملة أعلاه لها مصدرها. جمعها لرؤية ما تقوله وما لا تقوله. لا تجمع إلى «أنت من هذا النمط، فمن اليوم اتبع هذه الطريقة».',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 的适用范围',
      en: 'What T/CACM 1067—2018 says it applies to',
      ar: 'ما يقول T/CACM 1067—2018 إنه ينطبق عليه',
    },
    standard: {
      zh: '标准写明它界定的是治未病的术语，适用于中医教学、科研、医疗、健康服务和对外交流。界定术语，不等于对某一个读者完成了辨证。',
      en: 'The standard says it defines terms of preventive TCM, for TCM teaching, research, clinical care, health services, and exchange. Defining terms is not the same as completing pattern differentiation for one reader.',
      ar: 'يقول المعيار إنه يعرّف مصطلحات الوقاية في الطب الصيني، للتعليم والبحث والرعاية والخدمات الصحية والتبادل. تعريف المصطلحات ليس إتمام تمييز النمط لقارئ واحد.',
    },
    note: {
      zh: '体质、四季、饮食、情志和运动那些页，仍是分项的教育材料，不在这里收成一张个人方案。胸痛、一侧无力、说话不清、喘不上气或大出血，停下并按急症就医，可拨打 120。已经在治的病，药不要因为看了对照就自行停掉或改量。',
      en: 'The pages on constitution, seasons, diet, emotion, and movement stay separate educational material. They are not gathered here into one personal plan. For chest pain, weakness on one side, unclear speech, inability to breathe, or heavy bleeding, stop and get emergency care. In China the medical emergency number is 120. If a disease is already being treated, do not stop or change a medicine on your own because of this comparison.',
      ar: 'صفحات النمط والفصول والغذاء والانفعال والحركة تبقى مادة تعليمية منفصلة، ولا تُجمع هنا في خطة شخصية. عند ألم الصدر أو ضعف جانب أو كلام غير واضح أو عجز عن التنفس أو نزف شديد، توقف واطلب الطوارئ. في الصين رقم الطوارئ الطبية 120. إن كان مرض يُعالَج بالفعل، فلا توقف الدواء أو تغير مقداره من تلقاء نفسك بسبب هذه المقارنة.',
    },
  },
]
