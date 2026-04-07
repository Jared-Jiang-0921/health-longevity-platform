/**
 * 法律文档：英文 / 简体中文 / 阿拉伯语（正式书面语）
 * 占位主体名与联系方式来自 siteLegal.js；上线前请律师审阅各法域版本。
 */
import { SITE_LEGAL } from './siteLegal'

const { legalEntityName, contactEmail, contactAddress, lastUpdated } = SITE_LEGAL

const addrEn = contactAddress ? `Address: ${contactAddress}.` : ''
const addrZh = contactAddress ? `地址：${contactAddress}。` : ''
const addrAr = contactAddress ? `العنوان: ${contactAddress}.` : ''

export const LEGAL_META_I18N = {
  en: {
    lastUpdated,
    governingLawNote:
      'These materials are templates for counsel review. Localize for each jurisdiction (US, EU/EEA, UAE, Southeast Asia, etc.).',
  },
  zh: {
    lastUpdated,
    governingLawNote:
      '以下为供律师审阅的模板，请按目标司法辖区（美国、欧盟、阿联酋、东南亚等）本土化与定稿。',
  },
  ar: {
    lastUpdated,
    governingLawNote:
      'هذه النصوص نماذج للمراجعة القانونية. يجب توطينها لكل اختصاص قضائي (الولايات المتحدة، الاتحاد الأوروبي، دول الخليج، جنوب شرق آسيا، وغيرها).',
  },
}

function tri(en, zh, ar) {
  return { en, zh, ar }
}

/** @type {Record<'en'|'zh'|'ar', { title: string, sections: { heading: string, paragraphs: string[] }[] }>} */
const privacy = tri(
  {
    title: 'Privacy Policy',
    sections: [
      {
        heading: '1. Who we are',
        paragraphs: [
          `${legalEntityName} (“we”, “us”) operates this website and related services (the “Services”). This Policy explains how we collect, use, disclose, and safeguard personal information when you use the Services.`,
          `Contact: ${contactEmail}. ${addrEn}`,
        ],
      },
      {
        heading: '2. Information we collect',
        paragraphs: [
          'Account data: email, display name, authentication credentials (we store password hashes, not plain passwords).',
          'Transaction data: membership tier, subscription or order references, and payment metadata processed by our payment providers (e.g. Stripe). We do not store full payment card numbers on our servers.',
          'Technical data: IP address, device/browser type, approximate region, timestamps, and security logs.',
          'Health-related information: if you use questionnaires or similar features, you may provide symptoms, medical history, or other sensitive information. We process such data only as described in our Health Information Notice and, where required, based on your explicit consent.',
          'Communications: messages you send to support.',
        ],
      },
      {
        heading: '3. How we use information',
        paragraphs: [
          'To provide, secure, and improve the Services; authenticate users; process payments and memberships;',
          'To personalize content and recommendations where applicable;',
          'To comply with law, respond to lawful requests, and enforce our Terms;',
          'For fraud prevention, analytics, and service quality, using proportionate measures.',
        ],
      },
      {
        heading: '4. Legal bases (EEA/UK users)',
        paragraphs: [
          'Where GDPR applies, we rely on: performance of a contract; legitimate interests (security, analytics) where not overridden by your rights; consent where required (e.g. certain marketing or non-essential cookies); legal obligation where applicable.',
          'Special category (sensitive) health data: we process it only with your explicit consent or another permitted ground under applicable law, and only for stated purposes.',
        ],
      },
      {
        heading: '5. Sharing and processors',
        paragraphs: [
          'We do not sell your personal information. We may share data with subprocessors who assist us (hosting, database, email, payments, analytics) under contracts that require appropriate safeguards.',
          'Data may be processed in countries outside your country of residence, including the United States and the EEA, subject to safeguards such as Standard Contractual Clauses where required.',
        ],
      },
      {
        heading: '6. Retention',
        paragraphs: [
          'We retain personal data only as long as necessary for the purposes above and as required by law. Health questionnaire responses may be retained for a defined period stated in the Health Information Notice unless you request deletion subject to legal exceptions.',
        ],
      },
      {
        heading: '7. Your rights',
        paragraphs: [
          'Depending on your location, you may have rights to access, rectify, erase, restrict processing, object, or port data, and to withdraw consent. To exercise rights, contact us at the email above. You may lodge a complaint with your local supervisory authority.',
        ],
      },
      {
        heading: '8. Children',
        paragraphs: [
          'The Services are not directed to children under 16 (or the age required in your jurisdiction). We do not knowingly collect personal information from children.',
        ],
      },
      {
        heading: '9. Changes',
        paragraphs: [
          'We may update this Policy. We will post the revised version and update the “Last updated” date. Material changes may require additional notice where required by law.',
        ],
      },
    ],
  },
  {
    title: '隐私政策',
    sections: [
      {
        heading: '一、我们是谁',
        paragraphs: [
          `${legalEntityName}（「我们」）运营本网站及相关服务（「服务」）。本政策说明在您使用服务时，我们如何收集、使用、披露和保护个人信息。`,
          `联系方式：${contactEmail}。${addrZh}`,
        ],
      },
      {
        heading: '二、我们收集的信息',
        paragraphs: [
          '账户信息：电子邮箱、显示名称、登录凭证（我们存储密码哈希，不存储明文密码）。',
          '交易信息：会员等级、订阅或订单编号、由支付服务商处理的支付元数据（例如 Stripe）。我们不在自有服务器上存储完整银行卡号。',
          '技术信息：IP 地址、设备/浏览器类型、大致地区、时间戳及安全日志。',
          '与健康相关的信息：若您使用问卷或类似功能，可能提供症状、病史或其他敏感信息。我们仅按《健康信息说明》所述处理，并在适用法律要求时基于您的明确同意。',
          '沟通内容：您向客服发送的信息。',
        ],
      },
      {
        heading: '三、我们如何使用信息',
        paragraphs: [
          '提供、保障与改进服务；验证用户身份；处理支付与会员；',
          '在适用情况下个性化内容与推荐；',
          '遵守法律、响应合法请求并执行《用户协议》；',
          '在合理范围内用于防欺诈、分析及服务质量提升。',
        ],
      },
      {
        heading: '四、法律依据（欧洲经济区/英国用户）',
        paragraphs: [
          '在适用 GDPR 时，我们可能依据：履行合同；正当利益（安全、分析等，且不与您的权利冲突）；在需要时取得同意（如部分营销或非必要 Cookie）；或法律义务。',
          '敏感健康数据：我们仅在您明确同意或适用法律允许的其他依据下处理，且仅用于已声明目的。',
        ],
      },
      {
        heading: '五、共享与受托处理方',
        paragraphs: [
          '我们不出售您的个人信息。我们可能向协助我们的受托方（托管、数据库、邮件、支付、分析等）共享数据，并在合同中要求其采取适当保护措施。',
          '数据可能在您居住地以外的国家处理（包括美国、欧洲经济区等），在需要时采用标准合同条款等机制。',
        ],
      },
      {
        heading: '六、保存期限',
        paragraphs: [
          '我们仅在实现上述目的所必需的期间内保存个人数据，法律要求更长期限的除外。问卷答复的保存期见《健康信息说明》，除非您在法律允许范围内请求删除。',
        ],
      },
      {
        heading: '七、您的权利',
        paragraphs: [
          '视您所在地法律，您可能享有访问、更正、删除、限制处理、反对、可携带及撤回同意等权利。行使权利请通过上文邮箱联系我们。您亦可向当地监管机构投诉。',
        ],
      },
      {
        heading: '八、未成年人',
        paragraphs: [
          '本服务并非面向未满 16 周岁（或您所在地法律要求的年龄）的儿童。我们不会故意收集儿童个人信息。',
        ],
      },
      {
        heading: '九、政策变更',
        paragraphs: [
          '我们可能更新本政策，并在网站公布修订版及更新「最后更新」日期。重大变更在适用法律要求时可能另行提示。',
        ],
      },
    ],
  },
  {
    title: 'سياسة الخصوصية',
    sections: [
      {
        heading: '١- من نحن',
        paragraphs: [
          `${legalEntityName} («نحن») تشغّل هذا الموقع والخدمات ذات الصلة («الخدمات»). توضح هذه السياسة كيفية جمع معلوماتك الشخصية واستخدامها والإفصاح عنها وحمايتها عند استخدامك للخدمات.`,
          `للتواصل: ${contactEmail}. ${addrAr}`,
        ],
      },
      {
        heading: '٢- المعلومات التي نجمعها',
        paragraphs: [
          'بيانات الحساب: البريد الإلكتروني، الاسم الظاهر، بيانات تسجيل الدخول (نخزّن تجزئة كلمة المرور وليس النص الصريح).',
          'بيانات المعاملات: مستوى العضوية، مراجع الاشتراك أو الطلب، وبيانات وصفية للدفع تُعالَج عبر مزوّدي الدفع (مثل Stripe). لا نخزّن أرقام البطاقات الكاملة على خوادمنا.',
          'بيانات تقنية: عنوان IP، نوع الجهاز/المتصفح، المنطقة التقريبية، الطوابع الزمنية، وسجلات أمنية.',
          'معلومات صحية: إذا استخدمت استبيانات أو ميزات مشابهة، قد تقدّم أعراضًا أو تاريخًا طبيًا أو معلومات حساسة أخرى. نعالجها فقط كما هو موضّح في «إشعار المعلومات الصحية»، وعند الاقتضاء بناءً على موافقتك الصريحة.',
          'المراسلات: الرسائل التي ترسلها إلى الدعم.',
        ],
      },
      {
        heading: '٣- كيف نستخدم المعلومات',
        paragraphs: [
          'لتقديم الخدمات وتأمينها وتحسينها؛ والتحقق من المستخدمين؛ ومعالجة المدفوعات والعضويات؛',
          'لتخصيص المحتوى والتوصيات عند الاقتضاء؛',
          'للامتثال للقانون والاستجابة للطلبات المشروعة وتنفيذ الشروط؛',
          'لمنع الاحتيال والتحليلات وجودة الخدمة بما يتناسب مع الغرض.',
        ],
      },
      {
        heading: '٤- الأسس القانونية (مستخدمو المنطقة الاقتصادية الأوروبية/المملكة المتحدة)',
        paragraphs: [
          'حيث ينطبق اللائحة العامة لحماية البيانات، نعتمد على: تنفيذ عقد؛ مصالح مشروعة (أمن، تحليلات) حيث لا تُجازَم حقوقك؛ موافقة عند الاقتضاء (مثل تسويق معيّن أو ملفات تعريف غير ضرورية)؛ التزام قانوني عند الاقتضاء.',
          'البيانات الصحية الحساسة: نعالجها فقط بموافقتك الصريحة أو بموجب سند قانوني آخر مسموح به، وللأغراض المعلنة فقط.',
        ],
      },
      {
        heading: '٥- المشاركة والمعالجون الفرعيون',
        paragraphs: [
          'لا نبيع معلوماتك الشخصية. قد نشارك البيانات مع معالجين فرعيين (استضافة، قواعد بيانات، بريد، مدفوعات، تحليلات) بموجب عقود تتطلّب ضمانات مناسبة.',
          'قد تُعالَج البيانات خارج بلد إقامتك، بما في ذلك الولايات المتحدة والمنطقة الاقتصادية الأوروبية، مع ضمانات مثل البنود التعاقدية القياسية عند الاقتضاء.',
        ],
      },
      {
        heading: '٦- الاحتفاظ',
        paragraphs: [
          'نحتفظ بالبيانات الشخصية فقط للمدة اللازمة للأغراض أعلاه وكما يقتضيه القانون. قد تُحدَّد مدة الاحتفاظ بردود الاستبيان في «إشعار المعلومات الصحية» ما لم تطلب الحذف وفق الاستثناءات القانونية.',
        ],
      },
      {
        heading: '٧- حقوقك',
        paragraphs: [
          'بحسب موقعك، قد يحق لك الوصول أو التصحيح أو المحو أو تقييد المعالجة أو الاعتراض أو نقل البيانات أو سحب الموافقة. لممارسة الحقوق، راسلنا عبر البريد أعلاه. يمكنك تقديم شكوى إلى سلطة إشراف محلية.',
        ],
      },
      {
        heading: '٨- الأطفال',
        paragraphs: [
          'الخدمات غير موجّهة للأطفال دون 16 عامًا (أو السن المطلوب في ولايتك القضائية). لا نجمع عن علم معلومات أطفال.',
        ],
      },
      {
        heading: '٩- التغييرات',
        paragraphs: [
          'قد نحدّث هذه السياسة. سننشر النسخة المعدّلة ونحدّث تاريخ «آخر تحديث». قد تتطلّب التغييرات الجوهرية إشعارًا إضافيًا حيث يفرض القانون ذلك.',
        ],
      },
    ],
  },
)

const terms = tri(
  {
    title: 'Terms of Service',
    sections: [
      {
        heading: '1. Agreement',
        paragraphs: [
          `By accessing or using the Services operated by ${legalEntityName}, you agree to these Terms. If you do not agree, do not use the Services.`,
        ],
      },
      {
        heading: '2. Eligibility and accounts',
        paragraphs: [
          'You must provide accurate registration information and safeguard your credentials. You are responsible for activity under your account.',
        ],
      },
      {
        heading: '3. Membership and fees',
        paragraphs: [
          'Membership tiers, prices, taxes, and billing cycles are shown at checkout. Recurring subscriptions renew as disclosed until cancelled in accordance with the payment provider’s flow and our Sale Terms.',
          'Except where mandatory consumer laws provide otherwise, fees are generally non-refundable once the digital service or access period has been delivered or started.',
        ],
      },
      {
        heading: '4. Nature of the Services',
        paragraphs: [
          'The Services provide general health education and information tools. They do not constitute medical advice, diagnosis, or treatment. See the Health Disclaimer.',
        ],
      },
      {
        heading: '5. Acceptable use',
        paragraphs: [
          'You may not misuse the Services, attempt unauthorized access, scrape in violation of our rules, or use the Services for unlawful purposes.',
        ],
      },
      {
        heading: '6. Intellectual property',
        paragraphs: [
          'Content on the Services is owned by us or our licensors. You receive a limited, non-exclusive license to access content for personal, non-commercial use unless otherwise agreed in writing.',
        ],
      },
      {
        heading: '7. Disclaimers and limitation of liability',
        paragraphs: [
          'The Services are provided “as is” to the fullest extent permitted by law. To the extent permitted, we disclaim liability for indirect or consequential damages. Our aggregate liability for claims relating to the Services may be limited to the amount you paid us in the twelve months before the claim (if any).',
        ],
      },
      {
        heading: '8. Termination',
        paragraphs: [
          'We may suspend or terminate access for breach of these Terms or for legal or security reasons. You may stop using the Services at any time.',
        ],
      },
      {
        heading: '9. Governing law and disputes',
        paragraphs: [
          'The governing law and venue for disputes should be set by your counsel based on your corporate structure and target markets. This placeholder does not specify a jurisdiction.',
        ],
      },
      {
        heading: '10. Contact',
        paragraphs: [`Questions: ${contactEmail}`],
      },
    ],
  },
  {
    title: '用户服务协议',
    sections: [
      {
        heading: '一、协议的接受',
        paragraphs: [
          `访问或使用由 ${legalEntityName} 提供的服务，即表示您同意本协议。若不同意，请勿使用服务。`,
        ],
      },
      {
        heading: '二、资格与账户',
        paragraphs: [
          '您应提供真实、准确的注册信息并妥善保管登录凭证。您对账户下的行为负责。',
        ],
      },
      {
        heading: '三、会员与费用',
        paragraphs: [
          '会员等级、价格、税费与计费周期以结账页展示为准。自动续费的订阅将按支付服务商流程与本站《销售条款》披露的规则续订，直至您按规则取消。',
          '除强制性消费者法律另有规定外，数字服务或访问期一旦交付或开始后，费用一般不予退还。',
        ],
      },
      {
        heading: '四、服务性质',
        paragraphs: [
          '服务提供一般性健康教育资讯与工具，不构成医疗建议、诊断或治疗。详见《健康免责声明》。',
        ],
      },
      {
        heading: '五、可接受的使用',
        paragraphs: [
          '您不得滥用服务、尝试未授权访问、违反规则抓取数据，或利用服务从事违法活动。',
        ],
      },
      {
        heading: '六、知识产权',
        paragraphs: [
          '服务上的内容归我们或权利人所有。您获得有限的、非独占的许可，仅可为个人非商业目的访问，除非另有书面约定。',
        ],
      },
      {
        heading: '七、免责与责任限制',
        paragraphs: [
          '在法律允许的最大范围内，服务按「现状」提供。在允许范围内，我们对间接或后果性损害不承担责任。与服务相关的索赔总额可能以索赔前十二个月内您向我们支付的金额为上限（若有）。',
        ],
      },
      {
        heading: '八、终止',
        paragraphs: [
          '若您违反本协议或因法律或安全原因，我们可能暂停或终止访问。您也可随时停止使用服务。',
        ],
      },
      {
        heading: '九、适用法律与争议',
        paragraphs: [
          '管辖法律与争议解决地应由您的律师根据公司架构与目标市场确定。本模板未指定具体法域。',
        ],
      },
      {
        heading: '十、联系方式',
        paragraphs: [`咨询：${contactEmail}`],
      },
    ],
  },
  {
    title: 'شروط الخدمة',
    sections: [
      {
        heading: '١- القبول',
        paragraphs: [
          `باستخدامك للخدمات التي تُشغّلها ${legalEntityName} فإنك توافق على هذه الشروط. إذا لم توافق، فلا تستخدم الخدمات.`,
        ],
      },
      {
        heading: '٢- الأهلية والحسابات',
        paragraphs: [
          'يجب تقديم معلومات تسجيل دقيقة وحماية بيانات الاعتماد. أنت مسؤول عن النشاط تحت حسابك.',
        ],
      },
      {
        heading: '٣- العضوية والرسوم',
        paragraphs: [
          'تُعرَض مستويات العضوية والأسعار والضرائب ودورات الفوترة عند الدفع. تتجدد الاشتراكات المتكررة كما هو معلن حتى الإلغاء وفق مزوّد الدفع و«شروط البيع».',
          'ما لم تنص القوانين الإلزامية للمستهلك خلاف ذلك، فالرسوم غير قابلة للاسترداد عمومًا بعد تسليم الخدمة الرقمية أو بدء فترة الوصول.',
        ],
      },
      {
        heading: '٤- طبيعة الخدمات',
        paragraphs: [
          'الخدمات تقدّم تعليمًا صحيًا عامًا وأدوات معلومات. لا تشكل استشارة طبية أو تشخيصًا أو علاجًا. انظر «إخلاء المسؤولية الصحية».',
        ],
      },
      {
        heading: '٥- الاستخدام المقبول',
        paragraphs: [
          'يُحظر إساءة استخدام الخدمات أو محاولة الوصول غير المصرّح به أو القرصنة بما يخالف قواعدنا أو استخدام الخدمات لأغراض غير قانونية.',
        ],
      },
      {
        heading: '٦- الملكية الفكرية',
        paragraphs: [
          'المحتوى مملوك لنا أو لمرخّصينا. تحصل على ترخيص محدود وغير حصري للوصول لأغراض شخصية غير تجارية ما لم يُتفق كتابيًا على خلاف ذلك.',
        ],
      },
      {
        heading: '٧- إخلاء المسؤولية وحدودها',
        paragraphs: [
          'تُقدَّم الخدمات «كما هي» في أقصى حد يسمح به القانون. حيث يسمح القانون، نستبعد المسؤولية عن الأضرار غير المباشرة أو التبعية. قد يقتصر إجمالي مسؤوليتنا على المبالغ التي دفعتها لنا خلال اثني عشر شهرًا قبل المطالبة (إن وجدت).',
        ],
      },
      {
        heading: '٨- الإنهاء',
        paragraphs: [
          'قد نعلق أو ننهي الوصول عند مخالفة الشروط أو لأسباب قانونية أو أمنية. يمكنك التوقف عن استخدام الخدمات في أي وقت.',
        ],
      },
      {
        heading: '٩- القانون الواجب التطبيق والنزاعات',
        paragraphs: [
          'يُحدَّد القانون الواجب التطبيق ومكان النزاع وفق استشارتك القانونية وبنية شركتك والأسواق المستهدفة. هذا النموذج لا يحدد اختصاصًا قضائيًا محددًا.',
        ],
      },
      {
        heading: '١٠- التواصل',
        paragraphs: [`للاستفسارات: ${contactEmail}`],
      },
    ],
  },
)

const healthDisclaimer = tri(
  {
    title: 'Health & Medical Disclaimer',
    sections: [
      {
        heading: '1. Not medical advice',
        paragraphs: [
          `Information on this site (including courses, articles, tools, questionnaires, and product descriptions) is for general educational purposes only. It is not medical advice, diagnosis, or treatment, and does not establish a doctor–patient relationship with ${legalEntityName} or its contributors.`,
        ],
      },
      {
        heading: '2. Consult a professional',
        paragraphs: [
          'Always seek the advice of a qualified health professional with any questions about a medical condition, medications, supplements, diet, or exercise—especially if you are pregnant, nursing, have a chronic disease, or take prescription drugs.',
        ],
      },
      {
        heading: '3. Emergencies',
        paragraphs: [
          'If you think you may have a medical emergency, call your local emergency number immediately. Do not rely on this website to delay or replace emergency care.',
        ],
      },
      {
        heading: '4. Supplements and products',
        paragraphs: [
          'Dietary supplements are not intended to diagnose, treat, cure, or prevent any disease. Statements about products have not been evaluated by the FDA or other regulators unless expressly stated on the product page for a specific jurisdiction. Read labels and warnings before use.',
        ],
      },
      {
        heading: '5. Third parties',
        paragraphs: [
          'Links to third-party sites or tools are for convenience; we do not control their content and are not responsible for it.',
        ],
      },
      {
        heading: '6. Limitation',
        paragraphs: [
          `To the maximum extent permitted by law, ${legalEntityName} is not liable for any loss or damage arising from reliance on site content. Contact: ${contactEmail}`,
        ],
      },
    ],
  },
  {
    title: '健康与医疗免责声明',
    sections: [
      {
        heading: '一、非医疗建议',
        paragraphs: [
          `本网站信息（含课程、文章、工具、问卷及产品描述等）仅供一般健康教育参考，不构成医疗建议、诊断或治疗，也不与 ${legalEntityName} 或其贡献者构成医患关系。`,
        ],
      },
      {
        heading: '二、咨询合格专业人员',
        paragraphs: [
          '如有关于疾病、用药、膳食补充剂、饮食或运动的疑问，请务必咨询合格医疗卫生专业人员；怀孕、哺乳、患慢性病或正在服用处方药者尤应注意。',
        ],
      },
      {
        heading: '三、紧急情况',
        paragraphs: [
          '若您认为自己可能面临医疗急症，请立即拨打当地急救电话。请勿因使用本网站而延误或替代紧急救治。',
        ],
      },
      {
        heading: '四、膳食补充剂与产品',
        paragraphs: [
          '膳食补充剂不用于诊断、治疗、治愈或预防任何疾病。除在特定司法辖区产品页另有明确说明外，有关表述未经 FDA 或其他监管机构评价。使用前请阅读标签与警示。',
        ],
      },
      {
        heading: '五、第三方',
        paragraphs: [
          '指向第三方网站或工具的链接仅为方便；我们不对其内容负责，也无法控制。',
        ],
      },
      {
        heading: '六、责任限制',
        paragraphs: [
          `在法律允许的最大范围内，因依赖本站内容而产生的任何损失或损害，${legalEntityName} 不承担责任。联系：${contactEmail}`,
        ],
      },
    ],
  },
  {
    title: 'إخلاء المسؤولية الصحية والطبية',
    sections: [
      {
        heading: '١- ليست استشارة طبية',
        paragraphs: [
          `المعلومات على هذا الموقع (بما في ذلك الدورات والمقالات والأدوات والاستبيانات ووصف المنتجات) لأغراض تعليمية عامة فقط. ليست استشارة طبية أو تشخيصًا أو علاجًا، ولا تنشئ علاقة طبيب–مريض مع ${legalEntityName} أو المساهمين.`,
        ],
      },
      {
        heading: '٢- استشر مختصًا مؤهلًا',
        paragraphs: [
          'اطلب دائمًا رأي مختص صحي مؤهل في أي أسئلة عن حالة طبية أو أدوية أو مكملات أو نظام غذائي أو تمارين—خصوصًا إذا كنت حاملاً أو مرضعًا أو تعاني مرضًا مزمنًا أو تتناول أدوية بوصفة.',
        ],
      },
      {
        heading: '٣- الطوارئ',
        paragraphs: [
          'إذا ظننت أنك في حالة طوارئ طبية، اتصل فورًا برقم الطوارئ المحلي. لا تعتمد على هذا الموقع لتأخير أو استبدال الرعاية الطارئة.',
        ],
      },
      {
        heading: '٤- المكملات والمنتجات',
        paragraphs: [
          'المكملات الغذائية غير مخصّصة لتشخيص أو علاج أو شفاء أو منع أي مرض. لم تُقيَّم التصريحات عن المنتجات من قبل FDA أو جهات أخرى ما لم يُذكر صراحة في صفحة المنتج لولاية قضائية معيّنة. اقرأ الملصقات والتحذيرات قبل الاستخدام.',
        ],
      },
      {
        heading: '٥- أطراف ثالثة',
        paragraphs: [
          'روابط المواقع أو الأدوات الخارجية للتسهيل فقط؛ لا نتحكم في محتواها ولا نتحمل مسؤوليته.',
        ],
      },
      {
        heading: '٦- حدود المسؤولية',
        paragraphs: [
          `في أقصى حد يسمح به القانون، لا تتحمل ${legalEntityName} المسؤولية عن أي خسارة أو ضرر ناتج عن الاعتماد على محتوى الموقع. للتواصل: ${contactEmail}`,
        ],
      },
    ],
  },
)

const saleTerms = tri(
  {
    title: 'Terms of Sale',
    sections: [
      {
        heading: '1. Scope',
        paragraphs: [
          'These Terms of Sale apply when you purchase digital memberships or physical products through our checkout. They supplement the Terms of Service and Privacy Policy.',
        ],
      },
      {
        heading: '2. Orders and pricing',
        paragraphs: [
          'Product descriptions, prices, currency, shipping options, and taxes (if shown) are presented at checkout. We may refuse or cancel orders in case of errors, fraud risk, or legal restrictions.',
        ],
      },
      {
        heading: '3. Payment',
        paragraphs: [
          'Payments are processed by third-party providers (e.g. Stripe). You authorize charges according to the selected plan. Cross-border fees may apply per your card issuer.',
        ],
      },
      {
        heading: '4. Digital access',
        paragraphs: [
          'Membership access is granted to the account used at purchase for the period stated at checkout. Access may be suspended for breach of the Terms or non-payment.',
        ],
      },
      {
        heading: '5. Physical goods — shipping and risk',
        paragraphs: [
          'Delivery timelines, carriers, and import duties vary by destination. Title and risk of loss pass according to the Incoterm or shipping terms shown at checkout (e.g. DAP/DDP). You are responsible for import compliance where applicable.',
        ],
      },
      {
        heading: '6. Returns and refunds',
        paragraphs: [
          'Return eligibility, windows, and restocking rules depend on product type and destination law. Unless mandatory rights apply, perishable or opened supplements may not be returnable. Submit refund requests to the contact email with your order reference.',
        ],
      },
      {
        heading: '7. Regulatory compliance',
        paragraphs: [
          'You are responsible for ensuring that products can lawfully be imported and used in your country. We may restrict sales to certain jurisdictions.',
        ],
      },
      {
        heading: '8. Contact',
        paragraphs: [`Order support: ${contactEmail}`],
      },
    ],
  },
  {
    title: '销售条款',
    sections: [
      {
        heading: '一、适用范围',
        paragraphs: [
          '当您通过本站结账购买数字会员资格或实物产品时，适用本销售条款。本条款补充《用户服务协议》与《隐私政策》。',
        ],
      },
      {
        heading: '二、订单与价格',
        paragraphs: [
          '产品描述、价格、币种、配送选项及税费（如展示）以结账页为准。若存在错误、欺诈风险或法律限制，我们可能拒绝或取消订单。',
        ],
      },
      {
        heading: '三、支付',
        paragraphs: [
          '支付由第三方服务商处理（例如 Stripe）。您授权按所选方案扣款。跨境交易可能产生发卡行费用。',
        ],
      },
      {
        heading: '四、数字权益',
        paragraphs: [
          '会员访问权限授予结账时使用的账户，期限以结账页为准。若违反协议或未付款，我们可能暂停访问。',
        ],
      },
      {
        heading: '五、实物商品——运输与风险',
        paragraphs: [
          '送达时效、承运商及进口税费因目的地而异。所有权与灭失风险根据结账页所示贸易术语（如 DAP/DDP）转移。在适用情况下，您须自行确保进口合规。',
        ],
      },
      {
        heading: '六、退货与退款',
        paragraphs: [
          '是否可退、期限及手续费规则因产品类型与目的地法律而异。除强制性权利外，易腐或已开封补剂可能不可退。请通过联系邮箱提交退款申请并附上订单编号。',
        ],
      },
      {
        heading: '七、监管合规',
        paragraphs: [
          '您须确保产品可在您所在国家/地区合法进口与使用。我们可能限制向特定司法辖区销售。',
        ],
      },
      {
        heading: '八、联系方式',
        paragraphs: [`订单支持：${contactEmail}`],
      },
    ],
  },
  {
    title: 'شروط البيع',
    sections: [
      {
        heading: '١- النطاق',
        paragraphs: [
          'تنطبق شروط البيع عند شراء عضويات رقمية أو منتجات مادية عبر الدفع. تُكمّل شروط الخدمة وسياسة الخصوصية.',
        ],
      },
      {
        heading: '٢- الطلبات والأسعار',
        paragraphs: [
          'تُعرَض أوصاف المنتجات والأسعار والعملة وخيارات الشحن والضرائب (إن وُجدت) عند الدفع. قد نرفض أو نلغي الطلبات عند الأخطاء أو مخاطر الاحتيال أو القيود القانونية.',
        ],
      },
      {
        heading: '٣- الدفع',
        paragraphs: [
          'تُعالَج المدفوعات عبر مزوّدين خارجيين (مثل Stripe). تفوّض الخصم وفق الخطة المختارة. قد تنطبق رسوم عابرة للحدود حسب جهة إصدار البطاقة.',
        ],
      },
      {
        heading: '٤- الوصول الرقمي',
        paragraphs: [
          'يُمنح الوصول للعضوية للحساب المستخدم عند الشراء للمدة المعروضة عند الدفع. قد يُعلّق الوصول عند مخالفة الشروط أو عدم الدفع.',
        ],
      },
      {
        heading: '٥- البضائع المادية — الشحن والمخاطر',
        paragraphs: [
          'تختلف المدد والناقلون والرسوم الجمركية حسب الوجهة. ينتقل الملك ومخاطر التلف وفق شروط الشحن المعروضة (مثل DAP/DDP). أنت مسؤول عن الامتثال للاستيراد حيث ينطبق.',
        ],
      },
      {
        heading: '٦- الإرجاع والاسترداد',
        paragraphs: [
          'تختلف أهلية الإرجاع والنوافذ وقواعد إعادة التخزين حسب نوع المنتج وقانون الوجهة. ما لم تنص حقوق إلزامية، قد لا تُعاد المكملات القابلة للتلف أو المفتوحة. أرسل طلبات الاسترداد إلى البريد مع مرجع الطلب.',
        ],
      },
      {
        heading: '٧- الامتثال التنظيمي',
        paragraphs: [
          'أنت مسؤول عن التأكد من إمكانية استيراد المنتجات واستخدامها قانونيًا في بلدك. قد نقيّد المبيعات لولايات قضائية معيّنة.',
        ],
      },
      {
        heading: '٨- التواصل',
        paragraphs: [`دعم الطلبات: ${contactEmail}`],
      },
    ],
  },
)

const healthDataNotice = tri(
  {
    title: 'Health Information & Questionnaire Notice',
    sections: [
      {
        heading: '1. Purpose',
        paragraphs: [
          'We may offer questionnaires or assessments that collect information about symptoms, medical history, medications, allergies, lifestyle, or similar topics. This Notice supplements our Privacy Policy for that data.',
        ],
      },
      {
        heading: '2. Sensitive data',
        paragraphs: [
          'This information may qualify as sensitive health data under GDPR (special category data) or similar laws elsewhere. We process it only for the purposes disclosed here and, where required, on the basis of your explicit consent.',
        ],
      },
      {
        heading: '3. What we use it for',
        paragraphs: [
          'To personalize educational content, surface relevant resources, and (where clearly stated) suggest products or topics that may be relevant to you. We do not use this information to provide a medical diagnosis or to replace professional care.',
        ],
      },
      {
        heading: '4. What we do not do',
        paragraphs: [
          'We do not provide emergency services. Outputs are not a clinical diagnosis or treatment plan. Do not delay seeking care because of questionnaire results.',
        ],
      },
      {
        heading: '5. Retention and deletion',
        paragraphs: [
          'We retain questionnaire responses for the period necessary to provide the Services and as stated at collection, unless a longer period is required by law. You may request deletion of your account data subject to legal exceptions by contacting us.',
        ],
      },
      {
        heading: '6. Sharing',
        paragraphs: [
          'We do not sell health questionnaire data. Access is limited to personnel and subprocessors who need it to operate the Services, under appropriate safeguards.',
        ],
      },
      {
        heading: '7. Your choices',
        paragraphs: [
          'You may decline to answer optional questions, withdraw consent where processing is consent-based (which may limit features), or request access or erasure as described in the Privacy Policy.',
        ],
      },
      {
        heading: '8. Contact',
        paragraphs: [`${contactEmail}`],
      },
    ],
  },
  {
    title: '健康信息与问卷说明',
    sections: [
      {
        heading: '一、目的',
        paragraphs: [
          '我们可能提供问卷或评估，以收集与症状、病史、用药、过敏、生活方式等相关的信息。本说明就该等数据补充《隐私政策》。',
        ],
      },
      {
        heading: '二、敏感数据',
        paragraphs: [
          '该等信息在 GDPR 下可能构成敏感健康数据（特殊类别数据），或在其他地区适用类似规则。我们仅在本说明披露的目的范围内处理，并在需要时基于您的明确同意。',
        ],
      },
      {
        heading: '三、用途',
        paragraphs: [
          '用于个性化教育内容、展示相关资源，并在明确说明时可能推荐与您相关的主题或产品。我们不将此类信息用于医学诊断或替代专业诊疗。',
        ],
      },
      {
        heading: '四、我们不做的事',
        paragraphs: [
          '我们不提供急救服务。问卷输出不构成临床诊断或治疗方案。请勿因问卷结果而延误就医。',
        ],
      },
      {
        heading: '五、保存与删除',
        paragraphs: [
          '我们为实现服务所必需的期间内保存问卷答复，具体以收集时说明为准，法律要求更长保存期的除外。您可依法请求删除账户数据（受法律例外限制）。',
        ],
      },
      {
        heading: '六、共享',
        paragraphs: [
          '我们不出售健康问卷数据。访问权限限于为运营服务所必需的人员与受托方，并采取适当保护措施。',
        ],
      },
      {
        heading: '七、您的选择',
        paragraphs: [
          '您可拒绝回答非必答问题；在基于同意的处理场景下可撤回同意（可能导致部分功能受限）；亦可按《隐私政策》请求访问或删除。',
        ],
      },
      {
        heading: '八、联系方式',
        paragraphs: [`${contactEmail}`],
      },
    ],
  },
  {
    title: 'إشعار المعلومات الصحية والاستبيان',
    sections: [
      {
        heading: '١- الغرض',
        paragraphs: [
          'قد نقدّم استبيانات أو تقييمات تجمع معلومات عن الأعراض والتاريخ الطبي والأدوية والحساسية ونمط الحياة وما شابه. يكمّل هذا الإشعار سياسة الخصوصية لهذه البيانات.',
        ],
      },
      {
        heading: '٢- البيانات الحساسة',
        paragraphs: [
          'قد تُصنَّف هذه المعلومات بيانات صحية حساسة بموجب اللائحة العامة (فئة خاصة) أو قوانين مشابهة. نعالجها فقط للأغراض المعلنة هنا، وعند الاقتضاء بموجب موافقتك الصريحة.',
        ],
      },
      {
        heading: '٣- الاستخدام',
        paragraphs: [
          'لتخصيص المحتوى التعليمي وإبراز الموارد ذات الصلة، و(عند الإفصاح بوضوح) اقتراح منتجات أو مواضيع قد تهمّك. لا نستخدمها لتقديم تشخيص طبي أو لاستبدال الرعاية المهنية.',
        ],
      },
      {
        heading: '٤- ما لا نقدمه',
        paragraphs: [
          'لا نقدّم خدمات طوارئ. المخرجات ليست تشخيصًا سريريًا أو خطة علاج. لا تؤخر طلب الرعاية بسبب نتائج الاستبيان.',
        ],
      },
      {
        heading: '٥- الاحتفاظ والحذف',
        paragraphs: [
          'نحتفظ بردود الاستبيان للمدة اللازمة لتقديم الخدمات وكما يُعلَن عند الجمع، ما لم يفرض القانون مدة أطول. يمكنك طلب حذف بيانات حسابك مع الاستثناءات القانونية عبر التواصل معنا.',
        ],
      },
      {
        heading: '٦- المشاركة',
        paragraphs: [
          'لا نبيع بيانات الاستبيان الصحي. يقتصر الوصول على الموظفين والمعالجين الفرعيين الذين يحتاجونها لتشغيل الخدمات وبضمانات مناسبة.',
        ],
      },
      {
        heading: '٧- خياراتك',
        paragraphs: [
          'يمكنك رفض الإجابة عن أسئلة اختيارية، أو سحب الموافقة حيث يعتمد المعالجة على الموافقة (قد يحدّ ذلك الميزات)، أو طلب الوصول أو المحو كما في سياسة الخصوصية.',
        ],
      },
      {
        heading: '٨- التواصل',
        paragraphs: [`${contactEmail}`],
      },
    ],
  },
)

/** Cookie / 本地存储说明（与横幅、隐私政策交叉引用；上线前请律师审阅） */
const cookieNotice = tri(
  {
    title: 'Cookie & Similar Technologies Notice',
    sections: [
      {
        heading: '1. What this notice covers',
        paragraphs: [
          'This notice describes how Health Longevity Platform (“we”, “us”) uses cookies, local storage, and similar technologies when you visit or use our website and services. It should be read together with our Privacy Policy.',
          `Operator: ${legalEntityName}. Contact: ${contactEmail}.`,
        ],
      },
      {
        heading: '2. Technologies we use',
        paragraphs: [
          'Strictly necessary / functional: we use browser local storage (or similar) to keep you signed in after login (session token), to remember your cookie preference, and to operate core security features. These are needed for the service to work as you expect.',
          'We do not use third-party advertising cookies on this site by default. If we add optional analytics or marketing pixels in the future, we will update this notice and, where required, ask for your consent before loading non-essential scripts.',
        ],
      },
      {
        heading: '3. Your choices',
        paragraphs: [
          'You can use the cookie banner on first visit to accept all optional technologies we may add later, or to use only essential technologies. You can also control or delete cookies and site data through your browser settings; blocking strictly necessary storage may prevent login or break parts of the site.',
        ],
      },
      {
        heading: '4. Changes',
        paragraphs: [
          'We may update this notice. The “Last updated” date on this page will change. Material changes may be communicated as required by law.',
        ],
      },
    ],
  },
  {
    title: 'Cookie 与类似技术说明',
    sections: [
      {
        heading: '一、适用范围',
        paragraphs: [
          `${legalEntityName}（「我们」）在本说明中阐述当您访问或使用本网站及相关服务时，我们如何使用 Cookie、本地存储及类似技术。请与《隐私政策》一并阅读。`,
          `联系方式：${contactEmail}。`,
        ],
      },
      {
        heading: '二、我们使用的技术',
        paragraphs: [
          '必要 / 功能性：我们使用浏览器本地存储（或类似机制）保存登录态（会话令牌）、记录您对 Cookie 横幅的选择，并支持基本安全功能。缺少此类存储可能导致无法登录或部分功能不可用。',
          '默认情况下，本站不部署第三方广告类 Cookie。若未来增加可选统计分析或营销类像素，我们将更新本说明，并在法律要求时征得您对非必要脚本的同意后再加载。',
        ],
      },
      {
        heading: '三、您的选择',
        paragraphs: [
          '首次访问时可通过站内横幅选择：接受我们可能后续增加的可选技术，或仅使用必要技术。您也可在浏览器设置中管理或删除 Cookie 与站点数据；若阻止必要存储，可能影响登录或使用。',
        ],
      },
      {
        heading: '四、变更',
        paragraphs: [
          '我们可能更新本说明，并更新本页「最后更新」日期。重大变更将依法另行告知。',
        ],
      },
    ],
  },
  {
    title: 'إشعار ملفات تعريف الارتباط والتقنيات المشابهة',
    sections: [
      {
        heading: '١- النطاق',
        paragraphs: [
          'يوضح هذا الإشعار كيف تستخدم منصة Health Longevity Platform («نحن») ملفات تعريف الارتباط والتخزين المحلي وتقنيات مشابهة عند زيارتك أو استخدامك للموقع والخدمات. يُقرأ مع سياسة الخصوصية.',
          `المشغّل: ${legalEntityName}. التواصل: ${contactEmail}.`,
        ],
      },
      {
        heading: '٢- التقنيات',
        paragraphs: [
          'ضرورية/وظيفية: نستخدم التخزين المحلي في المتصفح (أو ما يشابهه) للإبقاء على جلسة تسجيل الدخول، وتذكّر تفضيلاتك بشأن الإشعار، ولأغراض أمنية أساسية. قد يتعطّل تسجيل الدخول أو أجزاء من الموقع دونها.',
          'لا نستخدم افتراضيًا ملفات إعلانات تابعة لجهات خارجية. إذا أضفنا لاحقًا تحليلات أو بكسل تسويق اختياري، سنحدّث هذا الإشعار ونطلب الموافقة حيث يقتضي القانون قبل تحميل السكربتات غير الضرورية.',
        ],
      },
      {
        heading: '٣- خياراتك',
        paragraphs: [
          'يمكنك عبر الشريط عند أول زيارة قبول كل التقنيات الاختيارية التي قد نضيفها لاحقًا، أو الاكتفاء بالضرورية فقط. يمكنك أيضًا إدارة ملفات تعريف الارتباط وبيانات الموقع من إعدادات المتصفح؛ قد يؤثر حظر التخزين الضروري على تسجيل الدخول.',
        ],
      },
      {
        heading: '٤- التغييرات',
        paragraphs: [
          'قد نحدّث هذا الإشعار وتاريخ «آخر تحديث». قد تتطلّب تغييرات جوهرية إشعارًا إضافيًا حيث يفرض القانون ذلك.',
        ],
      },
    ],
  },
)

export const LEGAL_PRIVACY = privacy
export const LEGAL_TERMS = terms
export const LEGAL_HEALTH_DISCLAIMER = healthDisclaimer
export const LEGAL_SALE = saleTerms
export const LEGAL_HEALTH_DATA = healthDataNotice
export const LEGAL_COOKIES = cookieNotice

export function normalizeLegalLang(raw) {
  const s = String(raw || '')
    .toLowerCase()
    .trim()
  if (s === 'zh' || s === 'zh-cn' || s === 'zh-hans') return 'zh'
  if (s === 'ar' || s === 'ar-sa' || s === 'ar-ae') return 'ar'
  return 'en'
}
