/**
 * 饮食调养教育摘要。
 * 膳食结构：《素问·藏气法时论》《素问·生气通天论》。
 * 脾胃与食量：《素问·灵兰秘典论》《素问·痹论》。
 * 冷热：《灵枢·师传》。
 * 术语：T/CACM 1067—2018《中医治未病术语》饮食调养、饮食有节、药食同源、因时施膳。
 * 食药物质的现行边界：《食品安全法》及卫法监发〔2002〕51号和后续公告。
 * 不按节气开个人菜单，不把处方药当菜，不写药量。
 */
export const TCM_DIET_SOURCE = {
  zh: '膳食结构依据《素问·藏气法时论》的五谷、五果、五畜、五菜，以及《素问·生气通天论》的谨和五味。脾胃与食量依据《素问·灵兰秘典论》《素问·痹论》。冷热依据《灵枢·师传》。术语依据中华中医药学会团体标准 T/CACM 1067—2018《中医治未病术语》。哪些东西可以进食品，以《食品安全法》和已经公布的食药物质为准。这一页不按某一个节气开菜单，也不写药量。',
  en: 'Meal structure follows the grains, fruits, meats, and vegetables in Suwen, “Visceral Qi Following the Seasons,” and “harmonize the five flavors” in “How Life Qi Connects with Heaven.” The spleen, stomach, and portion size follow “Secret Classic of the Spiritual Orchid” and “On Bi.” Temperature follows Lingshu, “Teaching the Teacher.” Terms follow group standard T/CACM 1067—2018. What may go into food follows the Food Safety Law and the published food-medicine lists. This page does not write a menu for one solar term, or a dose.',
}

export const TCM_DIET_TOPICS = [
  {
    id: 'granary',
    name: { zh: '仓廪', en: 'The granary' },
    classicFrom: {
      zh: '《素问·灵兰秘典论》',
      en: 'Suwen, Secret Classic of the Spiritual Orchid',
    },
    classic: {
      zh: '「脾胃者，仓廪之官，五味出焉。」胃受纳食物，脾把水谷往外输送。原文在讲脾病时写「不能为胃行其津液」，见《素问·太阴阳明论》。',
      en: '“The spleen and stomach are the officials of the granary; the five flavors come from them.” The stomach receives food, and the spleen moves the grain and fluid onward. When the spleen is ill, the same book says it “cannot move the fluids for the stomach,” in “Taiyin and Yangming.”',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 饮食调养',
      en: 'T/CACM 1067—2018 · Diet regulation',
    },
    standard: {
      zh: '「饮食调养」指按食物的性能，合理调配膳食，用来强身。它不是辨证开出的药膳，也不是一张热量表。',
      en: '“Diet regulation” means arranging meals by the character of foods, in order to support the body. It is not a syndrome-based medicated diet, and it is not a calorie chart.',
    },
    note: {
      zh: '养护脾胃，先是吃得进、运得走：定时，不过量，冷热适中。消化持续很差、消瘦、呕血或黑便，要就医，不要靠这一页进补。',
      en: 'Caring for the spleen and stomach starts with food that can be received and moved on: regular timing, not too much, and a moderate temperature. Ongoing poor digestion, weight loss, vomiting blood, or black stools needs a clinician. This page is not a tonic plan.',
    },
  },
  {
    id: 'grains',
    name: { zh: '五谷为养', en: 'Grains as the staple' },
    classicFrom: {
      zh: '《素问·藏气法时论》；谨和五味见《素问·生气通天论》',
      en: 'Suwen, Visceral Qi; “harmonize the five flavors” is in “Life Qi and Heaven”',
    },
    classic: {
      zh: '「五谷为养，五果为助，五畜为益，五菜为充，气味合而服之，以补精益气。」同篇还有按脏选味的句子。那些句子是原则，不是「你的肝就该吃甜」。',
      en: '“The five grains nourish, the five fruits assist, the five livestock benefit, and the five vegetables fill. Take their qi and flavor together, to replenish essence and benefit qi.” The same chapter also matches flavors to organs. Those lines are principles, not “your liver should eat sweet food.”',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 合理调配、博食、淡食',
      en: 'T/CACM 1067—2018 · Matching foods, a broad diet, a light diet',
    },
    standard: {
      zh: '「合理调配」写的是谨和五味、结构合理、平衡营养。「博食」是谷、蔬果、畜类都吃一些，靠互补。「淡食」是少盐、少油、少糖。同标准里的「素食」只是少吃动物性食物的一种习惯，不是规定人人吃素。',
      en: '“Food match” means harmonizing the five flavors, a sound structure, and balanced nourishment. “A broad diet” means eating some grains, vegetables, fruit, and animal foods so they complement each other. “A light diet” means less salt, oil, and sugar. “Vegetarian diet” in the same standard is one habit, with less animal food. It does not require everyone to eat only plants.',
    },
    note: {
      zh: '一餐以谷类和蔬菜为主，水果为辅，畜肉不必每餐都有。少盐少油少糖，不是把盐、油、糖减到零。不按「某脏就吃某味」给个人配餐。',
      en: 'A meal can rest on grains and vegetables, with fruit beside them. Meat does not have to appear at every meal. Less salt, oil, and sugar does not mean zero. Do not build a personal menu from “this organ eats this flavor.”',
    },
  },
  {
    id: 'measure',
    name: { zh: '饮食有节', en: 'Measured meals' },
    classicFrom: {
      zh: '《素问·痹论》',
      en: 'Suwen, On Bi',
    },
    classic: {
      zh: '「饮食自倍，肠胃乃伤。」吃到平时的一倍，肠胃就会受伤。原文没有给出克数或卡路里。',
      en: '“If eating and drinking double, the intestines and stomach are injured.” Doubling the usual amount injures digestion. The line gives no grams and no calories.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 饮食有节、少食',
      en: 'T/CACM 1067—2018 · Measured diet; eating less',
    },
    standard: {
      zh: '「饮食有节」是定时定量、寒温适宜、五味调和、进餐有规律。「少食」是每餐吃到还略觉饿、将饱未饱。标准没有规定一天吃几顿、每顿多少克。',
      en: '“A measured diet” means regular timing and amount, a suitable temperature, harmonized flavors, and a regular meal pattern. “Eating less” means stopping while still slightly hungry, short of full. The standard does not set how many meals a day, or how many grams.',
    },
    note: {
      zh: '吃到还想再吃一两口就停。这不是禁食，也不是计算卡路里。暴食之后腹痛、呕吐持续，要就医。',
      en: 'Stop when you could still eat another bite or two. This is not a fast, and it is not calorie counting. Ongoing pain or vomiting after a large meal needs a clinician.',
    },
  },
  {
    id: 'temperature',
    name: { zh: '寒温中适', en: 'Neither scalding nor icy' },
    classicFrom: {
      zh: '《灵枢·师传》',
      en: 'Lingshu, Teaching the Teacher',
    },
    classic: {
      zh: '「食饮者，热无灼灼，寒无沧沧。寒温中适，故气将持，乃不致邪僻也。」食物不要烫到灼人，也不要冷到刺骨。',
      en: '“For food and drink, heat should not scorch, and cold should not be icy. When cold and heat are moderate, qi can hold, and pathogenic imbalance is not invited.” Food should not burn, and it should not be biting cold.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 暖食',
      en: 'T/CACM 1067—2018 · Warm food',
    },
    standard: {
      zh: '「暖食」写的是食宜暖：热不灼唇，冷不冰齿。食物不宜过热，也不宜过冷。',
      en: '“Warm food” says food should be warm: hot enough not to burn the lips, cold enough not to ice the teeth. It should be neither too hot nor too cold.',
    },
    note: {
      zh: '刚出锅、烫到不能入口，和把冰饮当水整天喝，都不在这个范围。四季页里的绿豆粥写「放凉再吃」，那是书中针对夏月的做法，不是四季都吃冷食。',
      en: 'Food too hot to put in the mouth, and iced drinks used as water all day, both sit outside this range. The mung-bean porridge on the seasons page says to let it cool. That is the book’s summer method, not a rule to eat cold food in every season.',
    },
  },
  {
    id: 'homology',
    name: { zh: '药食同源', en: 'Food and medicine' },
    classicFrom: {
      zh: '术语出处在标准，不在《内经》原句',
      en: 'The term is in the standard, not a sentence of the Neijing',
    },
    classic: {
      zh: '《内经》写了五谷、五味和饮食伤胃，没有「药食同源」这四个字。不要把后来的术语回写成经文原句。',
      en: 'The Neijing writes about grains, flavors, and injury from overeating. It does not contain the four-character term “food and medicine share one source.” Do not rewrite a later term back into the classic as if it were an original sentence.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 药食同源、药膳；食品安全法',
      en: 'T/CACM 1067—2018 · Shared source; medicated diet; Food Safety Law',
    },
    standard: {
      zh: '标准把「药食同源」定义为：许多食物既可作食物，也可作药物。药膳是在中医理论下，把这类原料和食物做成粥、汤、菜。现行规则是：食品里不得添加药品，可以添加已经公布的食药物质。名单见卫法监发〔2002〕51号，以及 2019 年、2023 年的后续公告。2023 年纳入的党参、黄芪等，公告要求适量，婴幼儿、孕妇、乳母和慢性病用药者有不推荐或需咨询的情形。',
      en: 'The standard defines the shared source as: many foods can also be used as medicines. A medicated diet, under TCM theory, cooks those materials with food into porridge, soup, or a dish. Current law says drugs may not be added to food, while published food-medicine substances may. The lists are the 2002 Ministry of Health notice and the 2019 and 2023 announcements. Codonopsis, astragalus, and the other items added in 2023 are for moderate use. Infants, pregnancy, lactation, and people on long-term medicine have cases where they are not recommended, or a clinician should be asked.',
    },
    note: {
      zh: '在食药物质名单里，只说明它可以按传统进入食品，不说明它能治你的病。处方药、膏方、药酒不要煮进日常的菜。本站四季页已收的粥，都避开了人参、生地黄、何首乌、石膏。辨证施膳要由医师按这个人来定，这一页不代做。',
      en: 'Being on the food-medicine list means it may enter food by tradition. It does not mean it treats your illness. Do not cook prescription drugs, pastes, or medicinal wine into an ordinary dish. The porridges on the seasons page already leave out ginseng, raw rehmannia, fleeceflower, and gypsum. A medicated diet chosen by pattern has to be decided by a clinician for that person. This page does not do it.',
    },
  },
  {
    id: 'timing',
    name: { zh: '因时施膳', en: 'Food with the season' },
    classicFrom: {
      zh: '《素问·四气调神大论》只写起居和情志，没有二十四节气菜单',
      en: 'Suwen, Four Qi, writes rhythm and mood, not a 24-term menu',
    },
    classic: {
      zh: '四时起居、春夏养阳秋冬养阴，在《素问·四气调神大论》。那一篇没有写出立春吃什么、清明吃什么。',
      en: 'Seasonal rhythm, and supporting yang in spring and summer and yin in autumn and winter, are in Suwen, Four Qi. That chapter does not say what to eat at Start of Spring or at Qingming.',
    },
    standardFrom: {
      zh: 'T/CACM 1067—2018 · 因时调养；辨证施膳的注',
      en: 'T/CACM 1067—2018 · Seasonal regulation; the note on pattern-based diet',
    },
    standard: {
      zh: '「因时调养」是按一年四季的阴阳变化来调养。「因时施膳」写在「辨证施膳」的注里，和因地、因人、因病放在一起，指按时候选膳，不是公布一份二十四节气食谱。',
      en: '“Seasonal regulation” means care according to the yin and yang of the four seasons. “Food according to time” appears in a note under pattern-based medicated diet, beside place, person, and illness. It means choosing food with the time. It is not a published menu for the twenty-four solar terms.',
    },
    note: {
      zh: '节气饮食在本站就是这条原则。具体粥在「四季养生」：书中写明夏月的，照书放；没写明季节的，已经标成本站选用。这里不再另列二十四节气的吃法，也不按某一个节气给个人方案。',
      en: 'On this site, solar-term eating is this principle. The porridges are on Seasons. Where the book names summer, we followed it. Where it names no season, we already said the site chose it. This page does not add a twenty-four-term menu, or a personal plan for one term.',
    },
  },
]
