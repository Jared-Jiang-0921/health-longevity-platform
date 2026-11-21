/**
 * 体质自评条目。维度与计分门槛对应《中医体质分类与判定》（ZYYXH/T157-2009），
 * 句子为本站教育用表述，不是学会原文量表。
 * 刻意不写舌象题，舌象只在拍照对照里出现，避免改问卷分数。
 */
function item(id, text) {
  return {
    id,
    text: {
      zh: text.zh,
      en: text.en,
    },
  }
}

export const CONSTITUTION_GROUPS = [
  {
    id: 'balanced',
    items: [
      item('balanced-1', {
        zh: '最近一段时间精力够用，不太会无缘无故觉得累。',
        en: 'Lately my energy is enough, and I do not tire for no clear reason.',
      }),
      item('balanced-2', {
        zh: '睡眠大体安稳。',
        en: 'My sleep is mostly steady.',
      }),
      item('balanced-3', {
        zh: '对冷和热的耐受力比较好。',
        en: 'I tolerate cold and heat reasonably well.',
      }),
      item('balanced-4', {
        zh: '面色和气色看起来比较润泽。',
        en: 'My complexion looks fairly fresh.',
      }),
    ],
  },
  {
    id: 'qi-deficiency',
    items: [
      item('qi-1', {
        zh: '容易疲乏，休息后恢复得慢。',
        en: 'I tire easily and recover slowly after rest.',
      }),
      item('qi-2', {
        zh: '说话多或走一段路就觉得气不够。',
        en: 'After talking a lot or walking a while, my breath feels short.',
      }),
      item('qi-3', {
        zh: '稍微活动就出汗。',
        en: 'I sweat after only light activity.',
      }),
      item('qi-4', {
        zh: '声音偏低，不太想多说话。',
        en: 'My voice is quiet and I do not feel like talking much.',
      }),
    ],
  },
  {
    id: 'yang-deficiency',
    items: [
      item('yang-1', {
        zh: '比周围人更怕冷。',
        en: 'I feel colder than people around me.',
      }),
      item('yang-2', {
        zh: '手脚经常发凉。',
        en: 'My hands and feet are often cold.',
      }),
      item('yang-3', {
        zh: '更想喝热的，吃生冷后不舒服。',
        en: 'I prefer hot drinks, and raw or cold food bothers me.',
      }),
      item('yang-4', {
        zh: '天气一凉，精神就变差。',
        en: 'When the weather turns cold, my energy drops.',
      }),
    ],
  },
  {
    id: 'yin-deficiency',
    items: [
      item('yin-1', {
        zh: '经常觉得口干、咽干。',
        en: 'My mouth or throat often feels dry.',
      }),
      item('yin-2', {
        zh: '手心或脚心容易发热。',
        en: 'My palms or soles easily feel warm.',
      }),
      item('yin-3', {
        zh: '夜里容易出汗。',
        en: 'I tend to sweat at night.',
      }),
      item('yin-4', {
        zh: '睡眠偏浅，容易醒。',
        en: 'My sleep is light and I wake easily.',
      }),
    ],
  },
  {
    id: 'phlegm-dampness',
    items: [
      item('phlegm-1', {
        zh: '身体常有沉重、发沉的感觉。',
        en: 'My body often feels heavy.',
      }),
      item('phlegm-2', {
        zh: '腹部肥满，活动后更容易觉得闷。',
        en: 'My abdomen is full, and activity makes me feel more congested.',
      }),
      item('phlegm-3', {
        zh: '口中发黏。',
        en: 'My mouth feels sticky.',
      }),
      item('phlegm-4', {
        zh: '甜腻、油腻的食物吃多了会更不舒服。',
        en: 'Rich or sweet food makes me feel worse when I eat a lot of it.',
      }),
    ],
  },
  {
    id: 'damp-heat',
    items: [
      item('heat-1', {
        zh: '面部容易出油。',
        en: 'My face gets oily easily.',
      }),
      item('heat-2', {
        zh: '有口苦。',
        en: 'I notice a bitter taste in my mouth.',
      }),
      item('heat-3', {
        zh: '大便黏滞、不那么畅快。',
        en: 'Stools feel sticky or hard to pass cleanly.',
      }),
      item('heat-4', {
        zh: '待在又热又潮的环境里，身体更不舒服。',
        en: 'Hot, humid places make me feel worse.',
      }),
    ],
  },
  {
    id: 'blood-stasis',
    items: [
      item('stasis-1', {
        zh: '肤色看起来发暗、不那么光润。',
        en: 'My skin looks dull rather than fresh.',
      }),
      item('stasis-2', {
        zh: '身上容易出现瘀斑。',
        en: 'I bruise easily.',
      }),
      item('stasis-3', {
        zh: '某处会刺痛，位置比较固定。',
        en: 'I get a pricking pain that stays in one place.',
      }),
      item('stasis-4', {
        zh: '嘴唇颜色偏暗。',
        en: 'My lips look darker than usual.',
      }),
    ],
  },
  {
    id: 'qi-stagnation',
    items: [
      item('stag-1', {
        zh: '情绪容易低落或发闷。',
        en: 'My mood easily feels low or stuck.',
      }),
      item('stag-2', {
        zh: '常常忧虑，不容易放下。',
        en: 'I worry often and find it hard to let go.',
      }),
      item('stag-3', {
        zh: '胸口或两胁有胀闷感。',
        en: 'My chest or sides feel full or tight.',
      }),
      item('stag-4', {
        zh: '叹一口气后会稍微松一些。',
        en: 'A sigh brings a little relief.',
      }),
    ],
  },
  {
    id: 'special',
    items: [
      item('special-1', {
        zh: '容易过敏，例如鼻痒、喷嚏或皮疹。',
        en: 'I react easily, such as nasal itch, sneezing, or rash.',
      }),
      item('special-2', {
        zh: '换季或接触花粉、灰尘后症状会加重。',
        en: 'Season changes, pollen, or dust make symptoms worse.',
      }),
      item('special-3', {
        zh: '对某些食物或气味明显不耐受。',
        en: 'Certain foods or smells clearly bother me.',
      }),
      item('special-4', {
        zh: '皮肤一受刺激就容易发红、发痒。',
        en: 'My skin reddens or itches easily when irritated.',
      }),
    ],
  },
]

export const CONSTITUTION_QUESTION_IDS = CONSTITUTION_GROUPS.flatMap((group) => group.items.map((entry) => entry.id))
