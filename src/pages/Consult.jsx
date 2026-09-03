import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { hasLevelAccess, MEMBERSHIP_LEVELS } from '../data/membership'
import { fetchConsultProfile } from '../lib/consultProfile'
import { fetchConsultSessions, clearConsultSessions, deleteConsultSession, renameConsultSession, fetchConsultQuota } from '../lib/consultApi'
import ChatWindow from '../components/consult/ChatWindow'
import SessionList from '../components/consult/SessionList'
import ModulePageHero from '../components/ModulePageHero'
import './Consult.css'

const DISCLAIMER = {
  zh: '⚠ 本平台提供的健康信息仅供参考，不构成医疗诊断、治疗建议或处方依据。如有健康问题，请及时就诊于执业医疗机构，遵从执业医师的专业判断。',
  en: '⚠ The health information provided on this platform is for reference only and does not constitute medical diagnosis, treatment advice, or prescription guidance. If you have health concerns, please consult a licensed medical professional.',
  ar: '⚠ المعلومات الصحية المقدمة على هذه المنصة هي للإشارة فقط ولا تشكل تشخيصًا طبيًا أو نصيحة علاجية. إذا كانت لديك مخاوف صحية، يرجى استشارة طبيب مرخص.',
}

const COPY = {
  zh: {
    title: 'AI 健康咨询',
    back: '返回方案师',
    general: '自我健康促进',
    professional: '专业健康长寿',
    modeHintGeneral: '大众向：生活方式与养生科普。不含药理、免疫学教材、内外科等专科知识，也不检索 PubMed / Cochrane / 欧洲 PMC。',
    modeHintProfessional: '专业向：覆盖基础医学、临床医学、功能医学、长寿学等。可按需检索 PubMed、Cochrane、欧洲 PMC。',
    needLogin: '请先登录后使用咨询。',
    login: '登录',
    upgrade: '升级会员',
    needLevel: (name) => `该咨询类型需要「${name}」及以上会员。`,
    empty: '向助手提问健康与长寿相关问题。回答仅供参考。',
    emptyGeneral: '自我健康促进：检索生活方式、营养、运动、睡眠与大众向长寿科普，不含专科教材与 PubMed 等文献库。',
    emptyProfessional: '专业健康长寿：可检索基础医学、临床医学、功能医学、长寿学等全书，并可按需开启 PubMed / Cochrane / 欧洲 PMC。',
    placeholder: '输入问题，也可上传检查单或点语音录音…',
    send: '发送',
    sending: '发送中…',
    stop: '停止',
    thinking: '正在检索知识库并生成回答…',
    sendFail: '发送失败，请稍后重试。',
    networkFail: '网络连接中断，请再试一次。',
    timeout: '等待超时，请再试一次。',
    blocked: '该问题已被安全策略拦截。',
    sources: '参考文献',
    followups: '可以接着问',
    followupCats: {
      western: '西医',
      functional: '功能医学',
      longevity: '长寿医学',
      tcm: '中医药',
      related: '针对本题',
    },
    sourcesEmpty: '',
    sourcesError: '',
    pubmed: '检索 PubMed',
    pubmedHint: 'NCBI 公开文献。',
    cochrane: '检索 Cochrane',
    cochraneHint: '系统评价（Cochrane Reviews）。',
    europepmc: '检索欧洲 PMC',
    europepmcHint: '开放医学文献（含 MEDLINE/PMC）。Web of Science 需机构订阅，无法直接接入。',
    thinkingPubmed: '正在检索知识库与文献库…',
    profileReady: '已接入你的健康问卷（目标、关注问题、生活方式等），若已授权 AI健康监测，回答也会结合设备摘要。',
    profileMissing: '尚未填写健康问卷，回答将较通用。填写后可获得更贴合的建议。',
    profileError: '问卷暂时无法读取，本次按通用背景作答。',
    profileFill: '填写问卷',
    profileUpdate: '更新问卷',
    sessions: '会话',
    newChat: '新建对话',
    sessionsEmpty: '还没有历史会话。',
    sessionsLoading: '正在加载会话…',
    sessionsError: '会话列表暂时无法加载。',
    historyLoading: '正在加载对话…',
    loadFail: '会话加载失败。',
    untitled: '未命名对话',
    clearAll: '清空',
    clearConfirm: '确定清空全部会话吗？此操作不可恢复。',
    deleteSession: '删除',
    deleteConfirm: '确定删除这条会话吗？此操作不可恢复。',
    renameSession: '重命名',
    renameFail: '重命名失败，请稍后重试。',
    retentionNote: '会话默认保留 90 天；上传的检查单全文不会写入历史。',
    clearing: '清空中…',
    downloadWord: '下载 Word / WPS',
    downloadBusy: '正在生成…',
    downloadFail: '导出失败，请稍后重试。',
    downvote: '没用',
    downvoteDone: '已记下这条反馈',
    downvotePick: '可选原因：',
    downvoteSkip: '不选原因',
    downvoteOffTopic: '答偏了',
    downvoteNoSource: '没依据',
    downvoteTooLong: '太长',
    downvoteUnclear: '看不懂',
    downvoteOther: '其他',
    downvoteFail: '反馈提交失败，请稍后重试。',
    docFooter: '本文件由长健星图咨询导出，仅供参考，不能替代医生面诊。',
    filePrefix: '健康咨询',
    attach: '上传',
    attachHint: '最多 5 张图片（JPG/PNG，iPhone HEIC 需先转格式）；最多 3 个文档（PDF/Word/TXT，每个不超过 5MB）。点「语音」录音转文字。资料仅供参考，不能替代医生。',
    attachDefault: '请结合我上传的资料，给出健康参考建议。',
    attachTooLarge: '文档请控制在 5MB 以内；图片过大请先压缩或换一张更清晰的照片。',
    attachHeic: '这是 iPhone 的 HEIC 格式，目前无法直接识别。请在「设置 → 相机 → 格式」选「兼容性最高」，或用相册导出为 JPG/PNG 后再上传。',
    attachScannedPdf: '这份 PDF 几乎抽不出文字（可能是扫描件）。请改用可复制的 Word/PDF，或拍摄清晰照片。',
    attachPdfFail: '这份 PDF 暂时无法解析。请刷新后再试，或改用可复制的 Word，或把报告拍成清晰照片上传。',
    attachEmptyDoc: '文档里没有可读取的文字。',
    attachOldDoc: '旧版 .doc 请另存为 .docx 或 PDF。',
    attachUnsupported: '支持 JPG/PNG/WebP、PDF、Word（.docx）和 TXT。iPhone 照片请不要用 HEIC。',
    attachLimit: '最多 5 张图片和 3 份文档（每份文档不超过 5MB）。',
    attachRemove: '移除',
    speech: '语音',
    speechHint: '点「语音」开始录音，再说一遍问题，再点一次结束。请允许本站使用麦克风。',
    speechListening: '正在听，再点结束',
    speechTranscribing: '转写中…',
    speechFail: '语音转写失败，请再试一次或直接打字。',
    speechDenied: '浏览器拦截了麦克风。请点击地址栏左侧小锁，允许本站使用麦克风后刷新再试。',
    speechNoMic: '未检测到麦克风，请检查输入设备后重试。',
    speechBusy: '麦克风正被其他程序占用，请关闭后再试。',
    speechEmpty: '没有听清，请靠近麦克风后短说一句再结束录音。',
    speechUnsupported: '当前浏览器不能录音。请改用最新版 Chrome / Edge，或直接打字。',
    thinkingUpload: '正在识别上传内容并检索知识库…',
    quotaExceeded: '今日咨询额度已用完，将于北京时间 0 点恢复。',
    quotaUnlimited: '今日额度不限',
    quotaLine: (used, limit) => `今日额度 ${used} / ${limit}（北京时间 0 点恢复）`,
    quotaUpgrade: '升级额度',
  },
  en: {
    title: 'AI Health Consult',
    back: 'Back to Coach',
    general: 'Self-care',
    professional: 'Professional',
    modeHintGeneral: 'Public mode: lifestyle and wellness sources only. No specialty textbooks, and no PubMed / Cochrane / Europe PMC.',
    modeHintProfessional: 'Professional mode: basic, clinical, functional, and longevity medicine. Optional PubMed, Cochrane, Europe PMC.',
    needLogin: 'Please sign in to use consultation.',
    login: 'Login',
    upgrade: 'Upgrade',
    needLevel: (name) => `This mode requires ${name} or higher.`,
    empty: 'Ask about health and longevity. Answers are for reference only.',
    emptyGeneral: 'Self-care mode: lifestyle, nutrition, movement, sleep, and popular longevity sources. Specialty textbooks and PubMed/Cochrane/Europe PMC are off.',
    emptyProfessional: 'Professional mode: basic, clinical, functional, and longevity medicine. Optional PubMed / Cochrane / Europe PMC.',
    placeholder: 'Type your question, or tap Voice to record…',
    send: 'Send',
    sending: 'Sending…',
    stop: 'Stop',
    thinking: 'Searching knowledge base and drafting a reply…',
    sendFail: 'Failed to send. Please try again.',
    networkFail: 'The connection was interrupted. Please try again.',
    timeout: 'Timed out. Please try again.',
    blocked: 'This question was blocked by safety filters.',
    sources: 'Sources',
    followups: 'You can ask next',
    followupCats: {
      western: 'Western',
      functional: 'Functional',
      longevity: 'Longevity',
      tcm: 'TCM',
      related: 'On your question',
    },
    sourcesEmpty: '',
    sourcesError: '',
    pubmed: 'Search PubMed',
    pubmedHint: 'NCBI public literature.',
    cochrane: 'Search Cochrane',
    cochraneHint: 'Systematic reviews (Cochrane Reviews).',
    europepmc: 'Search Europe PMC',
    europepmcHint: 'Open medical literature (MEDLINE/PMC). Web of Science has no public API.',
    thinkingPubmed: 'Searching the knowledge base and literature…',
    profileReady: 'Your health questionnaire is attached (goals, concerns, lifestyle). Replies will use this background.',
    profileMissing: 'No questionnaire yet — answers will be more generic. Fill it in for a closer fit.',
    profileError: 'Questionnaire could not be loaded; this session will use general context.',
    profileFill: 'Fill questionnaire',
    profileUpdate: 'Update questionnaire',
    sessions: 'Chats',
    newChat: 'New chat',
    sessionsEmpty: 'No previous chats yet.',
    sessionsLoading: 'Loading chats…',
    sessionsError: 'Could not load chat list.',
    historyLoading: 'Loading conversation…',
    loadFail: 'Could not load this chat.',
    untitled: 'Untitled chat',
    clearAll: 'Clear',
    clearConfirm: 'Clear all chats? This cannot be undone.',
    deleteSession: 'Delete',
    deleteConfirm: 'Delete this chat? This cannot be undone.',
    renameSession: 'Rename',
    renameFail: 'Could not rename this chat. Please try again.',
    retentionNote: 'Chats are kept for 90 days. Uploaded report text is not stored in history.',
    clearing: 'Clearing…',
    downloadWord: 'Download Word / WPS',
    downloadBusy: 'Preparing…',
    downloadFail: 'Export failed. Please try again.',
    downvote: 'Not helpful',
    downvoteDone: 'Feedback saved',
    downvotePick: 'Optional reason:',
    downvoteSkip: 'Skip reason',
    downvoteOffTopic: 'Off topic',
    downvoteNoSource: 'No sources',
    downvoteTooLong: 'Too long',
    downvoteUnclear: 'Unclear',
    downvoteOther: 'Other',
    downvoteFail: 'Could not send feedback. Please try again.',
    docFooter: 'Exported from Changjian Xingtu consult. For reference only; not a substitute for in-person medical care.',
    filePrefix: 'health-consult',
    attach: 'Attach',
    attachHint: 'Up to 5 images (JPG/PNG; convert iPhone HEIC first) and 3 documents (PDF/Word/TXT, ≤5MB each). Tap Voice to record, then tap again to transcribe. For reference only — not medical care.',
    attachDefault: 'Please review the files I uploaded and give general health guidance.',
    attachTooLarge: 'Keep each document under 5MB; compress large photos before uploading.',
    attachHeic: 'HEIC photos cannot be read here. On iPhone: Settings → Camera → Formats → Most Compatible, or export as JPG/PNG from Photos.',
    attachScannedPdf: 'This PDF has almost no extractable text (it may be a scan). Use a selectable PDF/Word file or a clear photo.',
    attachPdfFail: 'This PDF could not be parsed. Refresh and try again, or upload a Word file / clear photos of the report.',
    attachEmptyDoc: 'No readable text was found in this document.',
    attachOldDoc: 'Please re-save .doc files as .docx or PDF.',
    attachUnsupported: 'Supported: JPG/PNG/WebP, PDF, Word (.docx), and TXT. Please convert HEIC photos first.',
    attachLimit: 'Up to 5 images and 3 documents (≤5MB each).',
    attachRemove: 'Remove',
    speech: 'Voice',
    speechHint: 'Tap Voice to start recording, then tap again to stop and transcribe. Allow microphone access for this site.',
    speechListening: 'Listening — tap to stop',
    speechTranscribing: 'Transcribing…',
    speechFail: 'Voice transcription failed. Try again or type.',
    speechDenied: 'The browser blocked the microphone. Click the lock icon in the address bar, allow microphone, then refresh.',
    speechNoMic: 'No microphone was found. Check your input device and try again.',
    speechBusy: 'The microphone is in use by another app. Close it and try again.',
    speechEmpty: 'Nothing was heard. Speak a short sentence closer to the mic, then stop.',
    speechUnsupported: 'This browser cannot record audio. Use the latest Chrome or Edge, or type instead.',
    thinkingUpload: 'Reading your upload and searching the knowledge base…',
    quotaExceeded: 'Daily consultation quota is used up. It resets at midnight Beijing time.',
    quotaUnlimited: 'No daily limit',
    quotaLine: (used, limit) => `Today ${used} / ${limit} (resets at midnight Beijing time)`,
    quotaUpgrade: 'Upgrade',
  },
  ar: {
    title: 'استشارة صحية بالذكاء الاصطناعي',
    back: 'العودة للمدرب',
    general: 'تعزيز الصحة الذاتية',
    professional: 'استشارة مهنية',
    modeHintGeneral: 'للجمهور: نمط الحياة والعافية فقط. بدون كتب تخصصية وبدون PubMed / Cochrane / Europe PMC.',
    modeHintProfessional: 'للمتخصصين: الطب الأساسي والسريري والوظيفي، مع خيار PubMed وCochrane وEurope PMC.',
    needLogin: 'يرجى تسجيل الدخول لاستخدام الاستشارة.',
    login: 'تسجيل الدخول',
    upgrade: 'ترقية',
    needLevel: (name) => `يتطلب هذا الوضع عضوية ${name} أو أعلى.`,
    empty: 'اطرح أسئلة حول الصحة وطول العمر. الإجابات للمرجعية فقط.',
    emptyGeneral: 'وضع تعزيز الصحة الذاتية: نمط الحياة والتغذية والحركة والنوم. بدون كتب تخصصية وبدون PubMed/Cochrane/Europe PMC.',
    emptyProfessional: 'الوضع المهني: الطب الأساسي والسريري والوظيفي وعلوم طول العمر، مع خيار PubMed / Cochrane / Europe PMC.',
    placeholder: 'اكتب سؤالك، أو اضغط صوت للتسجيل…',
    send: 'إرسال',
    sending: 'جارٍ الإرسال…',
    stop: 'إيقاف',
    thinking: 'جارٍ البحث في قاعدة المعرفة وصياغة الرد…',
    sendFail: 'تعذر الإرسال. حاول مرة أخرى.',
    networkFail: 'انقطع الاتصال. حاول مرة أخرى.',
    timeout: 'انتهت المهلة. حاول مرة أخرى.',
    blocked: 'تم حظر هذا السؤال وفق سياسات السلامة.',
    sources: 'المصادر',
    followups: 'يمكن المتابعة بهذه الأسئلة',
    followupCats: {
      western: 'طب غربي',
      functional: 'طب وظيفي',
      longevity: 'طول العمر',
      tcm: 'طب صيني',
      related: 'عن سؤالك',
    },
    sourcesEmpty: '',
    sourcesError: '',
    pubmed: 'بحث PubMed',
    pubmedHint: 'أدبيات NCBI العلنية.',
    cochrane: 'بحث Cochrane',
    cochraneHint: 'مراجعات منهجية (Cochrane).',
    europepmc: 'بحث Europe PMC',
    europepmcHint: 'أدبيات طبية مفتوحة. Web of Science يتطلب اشتراكًا مؤسسيًا.',
    thinkingPubmed: 'جارٍ البحث في قاعدة المعرفة والأدبيات…',
    profileReady: 'تم ربط استبيانك الصحي (الأهداف والاهتمامات ونمط الحياة)، وستُستخدم هذه الخلفية في الرد.',
    profileMissing: 'لا يوجد استبيان بعد؛ ستكون الإجابات أعم. املأه للحصول على توصيات أقرب لحالتك.',
    profileError: 'تعذر تحميل الاستبيان؛ ستستخدم هذه الجلسة سياقًا عامًا.',
    profileFill: 'ملء الاستبيان',
    profileUpdate: 'تحديث الاستبيان',
    sessions: 'المحادثات',
    newChat: 'محادثة جديدة',
    sessionsEmpty: 'لا توجد محادثات سابقة.',
    sessionsLoading: 'جارٍ تحميل المحادثات…',
    sessionsError: 'تعذر تحميل قائمة المحادثات.',
    historyLoading: 'جارٍ تحميل المحادثة…',
    loadFail: 'تعذر تحميل هذه المحادثة.',
    untitled: 'محادثة بدون عنوان',
    clearAll: 'مسح',
    clearConfirm: 'هل تريد مسح كل المحادثات؟ لا يمكن التراجع عن هذا الإجراء.',
    deleteSession: 'حذف',
    deleteConfirm: 'حذف هذه المحادثة؟ لا يمكن التراجع.',
    renameSession: 'إعادة تسمية',
    renameFail: 'تعذر إعادة تسمية المحادثة. حاول مرة أخرى.',
    retentionNote: 'تُحفظ المحادثات 90 يومًا. لا يُحفظ نص التقارير المرفوعة في السجل.',
    clearing: 'جارٍ المسح…',
    downloadWord: 'تنزيل Word / WPS',
    downloadBusy: 'جارٍ الإنشاء…',
    downloadFail: 'فشل التصدير. حاول مرة أخرى.',
    downvote: 'غير مفيد',
    downvoteDone: 'تم حفظ الملاحظة',
    downvotePick: 'سبب اختياري:',
    downvoteSkip: 'بدون سبب',
    downvoteOffTopic: 'خارج الموضوع',
    downvoteNoSource: 'بلا مصدر',
    downvoteTooLong: 'طويل جدًا',
    downvoteUnclear: 'غير واضح',
    downvoteOther: 'أخرى',
    downvoteFail: 'تعذر إرسال الملاحظة.',
    docFooter: 'تم التصدير من استشارة تشانغ جيان شينغتو. للإشارة فقط، ولا يغني عن زيارة الطبيب.',
    filePrefix: 'استشارة-صحية',
    attach: 'رفع',
    attachHint: 'حتى 5 صور (JPG/PNG؛ حوّل HEIC أولاً) و3 مستندات (PDF/Word/TXT، ≤5MB لكل ملف). اضغط «صوت» للتسجيل ثم مرة أخرى للتحويل. للمراجعة فقط وليس بديلاً عن الطبيب.',
    attachDefault: 'يرجى مراجعة الملفات المرفقة وإعطاء إرشادات صحية عامة.',
    attachTooLarge: 'أبقِ كل مستند أقل من 5MB؛ اضغط الصور الكبيرة قبل الرفع.',
    attachHeic: 'لا يمكن قراءة صور HEIC هنا. على iPhone: الإعدادات → الكاميرا → الصيغ → الأكثر توافقًا، أو صدّر الصورة كـ JPG/PNG.',
    attachScannedPdf: 'تعذر استخراج نص كافٍ من هذا الـ PDF. استخدم ملفًا قابلاً للنسخ أو صورة واضحة.',
    attachPdfFail: 'تعذر تحليل ملف PDF. حدّث الصفحة ثم أعد المحاولة، أو ارفع Word أو صورًا واضحة.',
    attachEmptyDoc: 'لا يوجد نص قابل للقراءة في هذا المستند.',
    attachOldDoc: 'احفظ ملفات .doc كـ .docx أو PDF.',
    attachUnsupported: 'المدعوم: JPG/PNG/WebP وPDF وWord (.docx) وTXT. حوّل صور HEIC أولاً.',
    attachLimit: 'حتى 5 صور و3 مستندات (≤5MB لكل مستند).',
    attachRemove: 'إزالة',
    speech: 'صوت',
    speechHint: 'اضغط «صوت» لبدء التسجيل، ثم اضغط مرة أخرى للتوقف والتحويل إلى نص. اسمح لهذا الموقع باستخدام الميكروفون.',
    speechListening: 'جارٍ الاستماع — اضغط للإنهاء',
    speechTranscribing: 'جارٍ التحويل…',
    speechFail: 'تعذر تحويل الصوت. أعد المحاولة أو اكتب.',
    speechDenied: 'المتصفح منع الميكروفون. اضغط أيقونة القفل في شريط العنوان واسمح بالميكروفون ثم حدّث الصفحة.',
    speechNoMic: 'لم يُعثر على ميكروفون. تحقق من الجهاز ثم أعد المحاولة.',
    speechBusy: 'الميكروفون قيد الاستخدام من برنامج آخر.',
    speechEmpty: 'لم يُسمع شيء. اقترب من الميكروفون وقل جملة قصيرة ثم أوقف التسجيل.',
    speechUnsupported: 'هذا المتصفح لا يدعم التسجيل. استخدم أحدث Chrome أو Edge، أو اكتب يدويًا.',
    thinkingUpload: 'جارٍ قراءة المرفق والبحث في قاعدة المعرفة…',
    quotaExceeded: 'انتهت حصتك اليومية. تُعاد عند منتصف الليل بتوقيت بكين.',
    quotaUnlimited: 'لا حد يومي',
    quotaLine: (used, limit) => `اليوم ${used} / ${limit} (تُعاد عند منتصف الليل بتوقيت بكين)`,
    quotaUpgrade: 'ترقية',
  },
}

/** general: 普通会员+（每日试用额度）；professional: 高级会员+ */
const ENTRY_LEVEL = {
  general: 'free',
  professional: 'premium',
}

function formatQuotaTokens(n, lang) {
  const v = Math.max(0, Number(n) || 0)
  if (lang === 'zh') {
    if (v >= 10000 && v % 10000 === 0) return `${v / 10000}万`
    if (v >= 10000) return `${(v / 10000).toFixed(1).replace(/\.0$/, '')}万`
    return String(v)
  }
  if (v >= 1000 && v % 1000 === 0) return `${v / 1000}k`
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(v)
}

export default function Consult() {
  const { lang } = useLocale()
  const { user, loading, getToken } = useAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const t = COPY[lang] || COPY.zh
  const disclaimer = DISCLAIMER[lang] || DISCLAIMER.zh
  const rtl = lang === 'ar'
  const [profile, setProfile] = useState(null)
  const [profileStatus, setProfileStatus] = useState('loading')
  const [sessions, setSessions] = useState([])
  const [sessionsStatus, setSessionsStatus] = useState('loading')
  const [sessionsErr, setSessionsErr] = useState('')
  const [clearing, setClearing] = useState(false)
  const [chatNonce, setChatNonce] = useState(0)
  const [quota, setQuota] = useState(null)

  const entry = params.get('entry') === 'professional' ? 'professional' : 'general'
  const initialQuery = params.get('q') || ''
  const sessionId = params.get('session') || ''
  const required = ENTRY_LEVEL[entry]
  const allowed = hasLevelAccess(user?.level, required, { isGuest: !user })
  const token = getToken?.()

  function refreshSessions() {
    if (!token) {
      setSessions([])
      setSessionsStatus('missing')
      return
    }
    fetchConsultSessions(token)
      .then((rows) => {
        setSessions(rows)
        setSessionsStatus('ready')
        setSessionsErr('')
      })
      .catch((err) => {
        setSessions([])
        setSessionsStatus('error')
        setSessionsErr(err?.message || '')
      })
  }

  function refreshQuota() {
    if (!token) {
      setQuota(null)
      return
    }
    fetchConsultQuota(token)
      .then((data) => setQuota(data))
      .catch(() => { /* 额度条失败不挡咨询 */ })
  }

  useEffect(() => {
    if (!token) {
      setProfile(null)
      setProfileStatus('missing')
      return
    }
    let cancelled = false
    setProfileStatus('loading')
    fetchConsultProfile(token).then((result) => {
      if (cancelled) return
      setProfile(result.profile)
      setProfileStatus(result.status)
    })
    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    if (!token || !allowed) return
    setSessionsStatus('loading')
    let cancelled = false
    fetchConsultSessions(token)
      .then((rows) => {
        if (cancelled) return
        setSessions(rows)
        setSessionsStatus('ready')
        setSessionsErr('')
      })
      .catch((err) => {
        if (cancelled) return
        setSessions([])
        setSessionsStatus('error')
        setSessionsErr(err?.message || '')
      })
    return () => {
      cancelled = true
    }
  }, [token, allowed])

  useEffect(() => {
    if (!token || !allowed) {
      setQuota(null)
      return
    }
    let cancelled = false
    fetchConsultQuota(token)
      .then((data) => {
        if (!cancelled) setQuota(data)
      })
      .catch(() => {
        if (!cancelled) setQuota(null)
      })
    return () => {
      cancelled = true
    }
  }, [token, allowed])

  const chatCopy = useMemo(
    () => ({
      empty: t.empty,
      emptyGeneral: t.emptyGeneral,
      emptyProfessional: t.emptyProfessional,
      placeholder: t.placeholder,
      send: t.send,
      sending: t.sending,
      stop: t.stop,
      thinking: t.thinking,
      sendFail: t.sendFail,
      networkFail: t.networkFail,
      timeout: t.timeout,
      blocked: t.blocked,
      sources: t.sources,
      followups: t.followups,
      followupCats: t.followupCats,
      sourcesEmpty: t.sourcesEmpty,
      sourcesError: t.sourcesError,
      pubmed: t.pubmed,
      pubmedHint: t.pubmedHint,
      cochrane: t.cochrane,
      cochraneHint: t.cochraneHint,
      europepmc: t.europepmc,
      europepmcHint: t.europepmcHint,
      thinkingPubmed: t.thinkingPubmed,
      historyLoading: t.historyLoading,
      loadFail: t.loadFail,
      disclaimer,
      downloadWord: t.downloadWord,
      downloadBusy: t.downloadBusy,
      downloadFail: t.downloadFail,
      downvote: t.downvote,
      downvoteDone: t.downvoteDone,
      downvotePick: t.downvotePick,
      downvoteSkip: t.downvoteSkip,
      downvoteOffTopic: t.downvoteOffTopic,
      downvoteNoSource: t.downvoteNoSource,
      downvoteTooLong: t.downvoteTooLong,
      downvoteUnclear: t.downvoteUnclear,
      downvoteOther: t.downvoteOther,
      downvoteFail: t.downvoteFail,
      docTitle: t.title,
      docFooter: t.docFooter,
      filePrefix: t.filePrefix,
      attach: t.attach,
      attachHint: t.attachHint,
      attachDefault: t.attachDefault,
      attachTooLarge: t.attachTooLarge,
      attachHeic: t.attachHeic,
      attachScannedPdf: t.attachScannedPdf,
      attachPdfFail: t.attachPdfFail,
      attachEmptyDoc: t.attachEmptyDoc,
      attachOldDoc: t.attachOldDoc,
      attachUnsupported: t.attachUnsupported,
      attachLimit: t.attachLimit,
      attachRemove: t.attachRemove,
      speech: t.speech,
      speechHint: t.speechHint,
      speechListening: t.speechListening,
      speechTranscribing: t.speechTranscribing,
      speechFail: t.speechFail,
      speechDenied: t.speechDenied,
      speechNoMic: t.speechNoMic,
      speechBusy: t.speechBusy,
      speechEmpty: t.speechEmpty,
      speechUnsupported: t.speechUnsupported,
      thinkingUpload: t.thinkingUpload,
      quotaExceeded: t.quotaExceeded,
    }),
    [t, disclaimer],
  )

  function setEntry(next) {
    const sp = new URLSearchParams(params)
    sp.set('entry', next)
    setParams(sp, { replace: true })
  }

  function newChat() {
    const sp = new URLSearchParams(params)
    sp.delete('session')
    sp.delete('q')
    setParams(sp, { replace: true })
    setChatNonce((n) => n + 1)
  }

  async function renameOneSession(row, title) {
    if (!token || !row?.id) return
    const data = await renameConsultSession(token, row.id, title)
    const next = String(data?.title || title).trim()
    setSessions((prev) => prev.map((s) => (s.id === row.id ? { ...s, title: next } : s)))
  }

  async function deleteOneSession(row) {
    if (!token || !row?.id) return
    if (!window.confirm(t.deleteConfirm)) return
    try {
      await deleteConsultSession(token, row.id)
      setSessions((prev) => prev.filter((s) => s.id !== row.id))
      if (sessionId === row.id) newChat()
    } catch (err) {
      setSessionsStatus('error')
      setSessionsErr(err?.message || t.sessionsError)
    }
  }

  async function clearAllSessions() {
    if (!token || !sessions.length || clearing) return
    if (!window.confirm(t.clearConfirm)) return
    setClearing(true)
    try {
      await clearConsultSessions(token)
      setSessions([])
      setSessionsStatus('ready')
      setSessionsErr('')
      newChat()
    } catch (err) {
      setSessionsStatus('error')
      setSessionsErr(err?.message || t.sessionsError)
    } finally {
      setClearing(false)
    }
  }

  function openSession(row) {
    if (!row?.id) return
    const sp = new URLSearchParams(params)
    sp.set('session', row.id)
    sp.delete('q')
    if (row.entry === 'professional' || row.entry === 'general') {
      sp.set('entry', row.entry)
    }
    setParams(sp, { replace: true })
    setChatNonce((n) => n + 1)
  }

  function onSessionChange(id) {
    if (!id || id === sessionId) {
      refreshSessions()
      return
    }
    const sp = new URLSearchParams(params)
    sp.set('session', id)
    sp.delete('q')
    setParams(sp, { replace: true })
    refreshSessions()
  }

  if (loading) {
    return (
      <div className="page-consult">
        <p className="consult-auth-loading" role="status">…</p>
      </div>
    )
  }

  if (!user || !token) {
    return (
      <div className="page-consult">
        <p>{t.needLogin}</p>
        <p>
          <Link to="/login" className="btn-primary">{t.login}</Link>
        </p>
        <p><Link to="/solutions">{t.back}</Link></p>
      </div>
    )
  }

  return (
    <div className={`page-consult ${rtl ? 'page-consult--rtl' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
      <header className="consult-top">
        <button type="button" className="consult-back" onClick={() => navigate('/solutions')}>
          ← {t.back}
        </button>
      </header>
      <ModulePageHero path="/consult" title={t.title} />

      <aside className="consult-disclaimer page-callout page-callout--warn" role="note">
        <p>{disclaimer}</p>
      </aside>

      <div className="consult-layout">
        <nav className="consult-modes" aria-label="consult mode">
          <button
            type="button"
            className={entry === 'general' ? 'is-active' : ''}
            onClick={() => setEntry('general')}
          >
            {t.general}
          </button>
          <button
            type="button"
            className={entry === 'professional' ? 'is-active' : ''}
            onClick={() => setEntry('professional')}
          >
            {t.professional}
          </button>
          <p className="consult-mode-hint">
            {entry === 'professional' ? t.modeHintProfessional : t.modeHintGeneral}
          </p>
          {allowed ? (
            <SessionList
              sessions={sessions}
              activeId={sessionId}
              loading={sessionsStatus === 'loading'}
              error={sessionsStatus === 'error' ? (sessionsErr || true) : false}
              lang={lang}
              copy={{
                sessions: t.sessions,
                newChat: t.newChat,
                sessionsEmpty: t.sessionsEmpty,
                sessionsLoading: t.sessionsLoading,
                sessionsError: t.sessionsError,
                untitled: t.untitled,
                clearAll: t.clearAll,
                clearing: t.clearing,
                deleteSession: t.deleteSession,
                renameSession: t.renameSession,
                retentionNote: t.retentionNote,
              }}
              onOpen={openSession}
              onNew={newChat}
              onClear={clearAllSessions}
              onDelete={deleteOneSession}
              onRename={renameOneSession}
              clearing={clearing}
            />
          ) : null}
        </nav>

        <main className="consult-main">
          {!allowed ? (
            <div className="consult-locked content-card content-card--padded">
              <p>{t.needLevel(MEMBERSHIP_LEVELS[required]?.name || required)}</p>
              <Link to={required === 'premium' ? '/payment?plan=premium_monthly' : '/payment?plan=standard_monthly'} className="btn-primary">{t.upgrade}</Link>
            </div>
          ) : (
            <>
              {profileStatus !== 'loading' ? (
              <aside
                className={`consult-profile-banner ${profileStatus === 'ready' ? 'is-ready' : 'is-missing'}`}
                role="status"
              >
                <p>
                  {profileStatus === 'ready' ? t.profileReady
                    : profileStatus === 'error' ? t.profileError
                      : t.profileMissing}
                </p>
                <Link to="/health-questionnaire">
                  {profileStatus === 'ready' ? t.profileUpdate : t.profileFill}
                </Link>
              </aside>
              ) : null}
              {quota ? (
                <aside className={`consult-quota ${!quota.unlimited && quota.remaining === 0 ? 'is-empty' : ''}`} role="status">
                  <p>
                    {quota.unlimited
                      ? t.quotaUnlimited
                      : t.quotaLine(formatQuotaTokens(quota.used, lang), formatQuotaTokens(quota.limit, lang))}
                  </p>
                  {!quota.unlimited && quota.level !== 'premium' ? (
                    <Link to="/payment?plan=premium_monthly">{t.quotaUpgrade}</Link>
                  ) : null}
                </aside>
              ) : null}
              {profileStatus === 'loading' ? (
                <p className="consult-auth-loading" role="status">…</p>
              ) : (
                <ChatWindow
                  key={`chat-${chatNonce}`}
                  token={token}
                  lang={lang}
                  entry={entry}
                  initialQuery={initialQuery}
                  rtl={rtl}
                  copy={chatCopy}
                  profile={profile}
                  sessionId={sessionId || null}
                  onSessionChange={onSessionChange}
                  onSessionTouched={() => {
                    refreshSessions()
                    refreshQuota()
                  }}
                  onQuota={setQuota}
                  quotaRemaining={quota?.unlimited ? null : quota?.remaining}
                  quotaUnlimited={Boolean(quota?.unlimited)}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
