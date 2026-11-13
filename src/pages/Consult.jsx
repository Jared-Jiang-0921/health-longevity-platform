import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { hasLevelAccess } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
import { fetchConsultProfile } from '../lib/consultProfile'
import { takeConstitutionConsultDraft } from '../lib/tcmConstitution/consultDraft'
import { fetchConsultSessions, deleteConsultSession, renameConsultSession, fetchConsultQuota } from '../lib/consultApi'
import ChatWindow from '../components/consult/ChatWindow'
import { consultAttachmentPolicy } from '../lib/consultUploadAllowlist'
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
    tcmTitle: 'AI 中医养生保健',
    backTcm: '返回中医治未病',
    modeHintTcm: '只检索本站中医书，按证候方向、病机和方义说明。不使用西医书，也不检索文献库。',
    emptyTcm: '中医养生保健：只依据本站已入库的中医书。可以讨论证候方向和参考方剂，并写清对应证候。未经当场辨证，不能作为用药依据。',
    needLogin: '请先登录后使用咨询。',
    login: '登录',
    authLoading: '正在验证会员身份，请稍候…',
    profileLoading: '正在读取健康问卷与评估摘要，随后即可提问。',
    handoffReady: '已把你在上一页写下的问题填入输入框。请核对后再发送。回答仅供参考，不能替代医生诊断、治疗或处方。',
    handoffPreview: '待核对的问题',
    unavailable: '历史会话暂时无法加载。你仍可以开始新的咨询。',
    retry: '重试',
    modeLabel: '咨询类型',
    composerModeNow: '当前模式',
    composerSourcesOff: '此模式不检索 PubMed、Cochrane、欧洲 PMC。',
    composerSourcesHere: '文献检索在输入框上方，默认关闭，可按需打开。',
    composerTcmSources: '中医咨询不检索 PubMed、Cochrane、欧洲 PMC。',
    composerUseProfessional: '切换到专业健康长寿',
    composerUseGeneral: '切换到自我健康促进',
    sessionGeneralNote: '这条历史属于自我健康促进，所以没有 PubMed、Cochrane、欧洲 PMC 开关。记录类型保持不变。',
    sessionProfessionalNote: '这条历史属于专业健康长寿。文献开关只对这一条记录有效，不会把其它历史改成专业咨询。',
    sessionTcmNote: '这条历史属于中医养生保健，不检索 PubMed、Cochrane、欧洲 PMC。记录类型保持不变。',
    profileAssessLocked: '评估需标准会员',
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
    profileReady: '已接入你的健康问卷、本站风险评估与衰老评估摘要（若已填写）。',
    profileMissing: '尚未填写健康问卷、风险评估或衰老评估，回答将较通用。填写后可获得更贴合的建议。',
    profileError: '问卷暂时无法读取，本次按通用背景作答。',
    profileFill: '填写问卷',
    profileUpdate: '更新问卷',
    profileRisk: '风险评估',
    profileAging: '衰老评估',
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
    attachHintAdmin: '图片和 PDF 不限张数（JPG/PNG，iPhone HEIC 需先转格式）。Word/TXT 仍最多 3 个，每个文档不超过 5MB。点「语音」录音转文字。资料仅供参考，不能替代医生。',
    attachHintExempt: '图片、PDF、Word 和 TXT 不限张数、不限单文件大小（图片请用 JPG/PNG/WebP，iPhone HEIC 需先转格式）。贴在 Word 里的图片不会被识别，请另存为 JPG/PNG 再上传。单次发送仍受网关 25MB 请求体限制。点「语音」录音转文字。资料仅供参考，不能替代医生。',
    attachDefault: '请结合我上传的资料，给出健康参考建议。',
    attachTooLarge: '文档请控制在 5MB 以内；图片过大请先压缩或换一张更清晰的照片。',
    attachHeic: '这是 iPhone 的 HEIC 格式，目前无法直接识别。请在「设置 → 相机 → 格式」选「兼容性最高」，或用相册导出为 JPG/PNG 后再上传。',
    attachScannedPdf: '这份 PDF 几乎抽不出文字（可能是扫描件）。请改用可复制的 Word/PDF，或拍摄清晰照片。',
    attachPdfFail: '这份 PDF 暂时无法解析。请刷新后再试，或改用可复制的 Word，或把报告拍成清晰照片上传。',
    attachEmptyDoc: '文档里没有可读取的文字。',
    attachOldDoc: '旧版 .doc 请另存为 .docx 或 PDF。',
    attachUnsupported: '支持 JPG/PNG/WebP、PDF、Word（.docx）和 TXT。iPhone 照片请不要用 HEIC。',
    attachLimit: '最多 5 张图片和 3 份文档（每份文档不超过 5MB）。',
    attachLimitAdmin: 'Word 和 TXT 仍最多 3 份（每份不超过 5MB）。',
    attachLimitExempt: '单次发送仍受网关 25MB 请求体限制，请分次发送。',
    attachTransport: '单次发送超过网关 25MB 请求体上限，请分次发送。',
    attachImageUnread: '这张图片压缩后仍超过咨询服务能识别的大小，所以没有加入。请换一张较小的 JPG/PNG，或分成几张再传。',
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
    tcmTitle: 'AI TCM wellness consult',
    backTcm: 'Back to preventive TCM',
    modeHintTcm: 'Uses only this site’s TCM books, and explains by pattern, mechanism, and formula meaning. Western books and literature databases stay off.',
    emptyTcm: 'TCM wellness: answers stay with the TCM books on this site. Pattern direction and reference formulas are allowed when the matching pattern is stated. Without an in-person assessment, this is not a basis for taking medicine.',
    needLogin: 'Please sign in to use consultation.',
    login: 'Login',
    authLoading: 'Verifying membership…',
    profileLoading: 'Loading your questionnaire and assessment summary. You can ask in a moment.',
    handoffReady: 'Your question from the previous page is in the box. Review it before sending. Answers are for reference only and do not replace a physician’s diagnosis, treatment, or prescriptions.',
    handoffPreview: 'Question to review',
    unavailable: 'Previous chats could not be loaded. You can still start a new consultation.',
    retry: 'Retry',
    modeLabel: 'Consultation type',
    composerModeNow: 'Current mode',
    composerSourcesOff: 'This mode does not search PubMed, Cochrane, or Europe PMC.',
    composerSourcesHere: 'Literature search sits above the box. It is off until you turn it on.',
    composerTcmSources: 'TCM consult does not search PubMed, Cochrane, or Europe PMC.',
    composerUseProfessional: 'Switch to professional',
    composerUseGeneral: 'Switch to self-care',
    sessionGeneralNote: 'This saved chat is self-care, so PubMed, Cochrane, and Europe PMC stay off. Its type is unchanged.',
    sessionProfessionalNote: 'This saved chat is professional. Literature switches apply only to this record and do not reclassify other chats.',
    sessionTcmNote: 'This saved chat is TCM preventive care and does not search PubMed, Cochrane, or Europe PMC. Its type is unchanged.',
    profileAssessLocked: 'Assessments need Standard',
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
    profileReady: 'Your questionnaire and any saved website risk or aging-clock summaries are attached.',
    profileMissing: 'No questionnaire, risk, or aging assessments yet — answers will be more generic.',
    profileError: 'Questionnaire could not be loaded; this session will use general context.',
    profileFill: 'Fill questionnaire',
    profileUpdate: 'Update questionnaire',
    profileRisk: 'Risk tools',
    profileAging: 'Aging clocks',
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
    attachHintAdmin: 'No limit on the number of images or PDFs (JPG/PNG; convert iPhone HEIC first). Word/TXT still up to 3 files, each ≤5MB. Tap Voice to record, then tap again to transcribe. For reference only — not medical care.',
    attachHintExempt: 'No count or per-file size limit for images, PDFs, Word, or TXT (use JPG/PNG/WebP; convert iPhone HEIC first). Pictures pasted inside Word are not read; upload them as JPG/PNG. One send is still capped by the 25MB gateway body limit. Tap Voice to record, then tap again to transcribe. For reference only — not medical care.',
    attachDefault: 'Please review the files I uploaded and give general health guidance.',
    attachTooLarge: 'Keep each document under 5MB; compress large photos before uploading.',
    attachHeic: 'HEIC photos cannot be read here. On iPhone: Settings → Camera → Formats → Most Compatible, or export as JPG/PNG from Photos.',
    attachScannedPdf: 'This PDF has almost no extractable text (it may be a scan). Use a selectable PDF/Word file or a clear photo.',
    attachPdfFail: 'This PDF could not be parsed. Refresh and try again, or upload a Word file / clear photos of the report.',
    attachEmptyDoc: 'No readable text was found in this document.',
    attachOldDoc: 'Please re-save .doc files as .docx or PDF.',
    attachUnsupported: 'Supported: JPG/PNG/WebP, PDF, Word (.docx), and TXT. Please convert HEIC photos first.',
    attachLimit: 'Up to 5 images and 3 documents (≤5MB each).',
    attachLimitAdmin: 'Word and TXT are still limited to 3 files (≤5MB each).',
    attachLimitExempt: 'One send is still capped by the 25MB gateway body limit. Send the files in smaller batches.',
    attachTransport: 'This send exceeds the 25MB gateway body limit. Send the files in smaller batches.',
    attachImageUnread: 'This photo is still too large for the consult service to read after compression, so it was not added. Use a smaller JPG/PNG, or split it into several photos.',
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
    tcmTitle: 'استشارة العناية بالطب الصيني',
    backTcm: 'العودة إلى الوقاية الصينية',
    modeHintTcm: 'يستخدم فقط كتب الطب الصيني في هذا الموقع، ويشرح باتجاه المتلازمة والآلية ومعنى الوصفة. كتب الطب الغربي وقواعد الأدبيات متوقفة.',
    emptyTcm: 'العناية بالطب الصيني تعتمد على كتب الموقع فقط. اتجاه المتلازمة والوصفة المرجعية مسموحان مع ذكر المتلازمة. بلا معاينة حضورية لا يُعد هذا أساساً لتناول الدواء.',
    needLogin: 'يرجى تسجيل الدخول لاستخدام الاستشارة.',
    login: 'تسجيل الدخول',
    authLoading: 'جار التحقق من العضوية…',
    profileLoading: 'جارٍ تحميل الاستبيان وملخص التقييم. يمكنك السؤال بعد لحظات.',
    handoffReady: 'وُضع سؤالك من الصفحة السابقة في مربع الكتابة. راجعه قبل الإرسال. الإجابات للمرجعية فقط ولا تغني عن تشخيص الطبيب أو علاجه أو وصفاته.',
    handoffPreview: 'سؤال بانتظار المراجعة',
    unavailable: 'تعذر تحميل المحادثات السابقة. يمكنك بدء استشارة جديدة.',
    retry: 'إعادة المحاولة',
    modeLabel: 'نوع الاستشارة',
    composerModeNow: 'الوضع الحالي',
    composerSourcesOff: 'هذا الوضع لا يبحث في PubMed أو Cochrane أو Europe PMC.',
    composerSourcesHere: 'بحث الأدبيات فوق مربع السؤال، ومغلق حتى تفتحه.',
    composerTcmSources: 'استشارة الطب الصيني لا تبحث في PubMed أو Cochrane أو Europe PMC.',
    composerUseProfessional: 'التبديل إلى الاستشارة المهنية',
    composerUseGeneral: 'التبديل إلى تعزيز الصحة الذاتية',
    sessionGeneralNote: 'هذه المحادثة المحفوظة من نوع تعزيز الصحة الذاتية، لذلك لا تظهر مفاتيح PubMed وCochrane وEurope PMC. نوع السجل يبقى كما هو.',
    sessionProfessionalNote: 'هذه المحادثة المحفوظة مهنية. مفاتيح الأدبيات تخص هذا السجل فقط ولا تغيّر نوع المحادثات الأخرى.',
    sessionTcmNote: 'هذه المحادثة المحفوظة للرعاية الوقائية بالطب الصيني، ولا تبحث في PubMed أو Cochrane أو Europe PMC. نوع السجل يبقى كما هو.',
    profileAssessLocked: 'التقييمات للعضو القياسي',
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
    profileReady: 'تم ربط استبيانك وملخصات تقييم المخاطر والشيخوخة المحفوظة على الموقع إن وُجدت.',
    profileMissing: 'لا يوجد استبيان أو تقييمات بعد؛ ستكون الإجابات أعم.',
    profileError: 'تعذر تحميل الاستبيان؛ ستستخدم هذه الجلسة سياقًا عامًا.',
    profileFill: 'ملء الاستبيان',
    profileUpdate: 'تحديث الاستبيان',
    profileRisk: 'التقييمات',
    profileAging: 'تقييم الشيخوخة',
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
    attachHintAdmin: 'لا حد لعدد الصور أو ملفات PDF (JPG/PNG؛ حوّل HEIC أولاً). Word/TXT ما زالا حتى 3 ملفات، وكل مستند ≤5MB. اضغط «صوت» للتسجيل ثم مرة أخرى للتحويل. للمراجعة فقط وليس بديلاً عن الطبيب.',
    attachHintExempt: 'لا حد لعدد أو حجم الصور وPDF وWord وTXT (JPG/PNG/WebP؛ حوّل HEIC أولاً). الصور الملصقة داخل Word لا تُقرأ؛ ارفعها كـ JPG/PNG. الإرسال الواحد ما زال محدودًا بحجم طلب البوابة 25MB. اضغط «صوت» للتسجيل ثم مرة أخرى للتحويل. للمراجعة فقط وليس بديلاً عن الطبيب.',
    attachDefault: 'يرجى مراجعة الملفات المرفقة وإعطاء إرشادات صحية عامة.',
    attachTooLarge: 'أبقِ كل مستند أقل من 5MB؛ اضغط الصور الكبيرة قبل الرفع.',
    attachHeic: 'لا يمكن قراءة صور HEIC هنا. على iPhone: الإعدادات → الكاميرا → الصيغ → الأكثر توافقًا، أو صدّر الصورة كـ JPG/PNG.',
    attachScannedPdf: 'تعذر استخراج نص كافٍ من هذا الـ PDF. استخدم ملفًا قابلاً للنسخ أو صورة واضحة.',
    attachPdfFail: 'تعذر تحليل ملف PDF. حدّث الصفحة ثم أعد المحاولة، أو ارفع Word أو صورًا واضحة.',
    attachEmptyDoc: 'لا يوجد نص قابل للقراءة في هذا المستند.',
    attachOldDoc: 'احفظ ملفات .doc كـ .docx أو PDF.',
    attachUnsupported: 'المدعوم: JPG/PNG/WebP وPDF وWord (.docx) وTXT. حوّل صور HEIC أولاً.',
    attachLimit: 'حتى 5 صور و3 مستندات (≤5MB لكل مستند).',
    attachLimitAdmin: 'Word وTXT ما زالا حتى 3 ملفات (≤5MB لكل ملف).',
    attachLimitExempt: 'الإرسال الواحد ما زال محدودًا بحجم طلب البوابة 25MB. أرسل الملفات على دفعات أصغر.',
    attachTransport: 'يتجاوز هذا الإرسال حد البوابة 25MB. أرسل الملفات على دفعات أصغر.',
    attachImageUnread: 'بعد الضغط ما زالت الصورة أكبر مما تستطيع خدمة الاستشارة قراءته، لذا لم تُضف. استخدم JPG/PNG أصغر أو قسّمها إلى عدة صور.',
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
  tcm: 'premium',
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
  const [clearing, setClearing] = useState(false)
  const [chatNonce, setChatNonce] = useState(0)
  const [quota, setQuota] = useState(null)
  const [draftSeed, setDraftSeed] = useState('')

  const rawEntry = params.get('entry')
  const entry = rawEntry === 'professional' || rawEntry === 'tcm' ? rawEntry : 'general'
  const homePath = entry === 'tcm' ? '/tcm-prevention' : '/solutions'
  const visibleSessions = sessions.filter((row) => (
    entry === 'tcm' ? row.entry === 'tcm' : row.entry !== 'tcm'
  ))
  const sessionId = params.get('session') || ''
  const required = ENTRY_LEVEL[entry]
  const token = getToken?.()
  const allowed = Boolean(user && token) && (
    required === 'free' || hasLevelAccess(user.level, required, { isGuest: false })
  )

  function refreshSessions() {
    if (!token) {
      setSessions([])
      setSessionsStatus('missing')
      return
    }
    setSessionsStatus('loading')
    fetchConsultSessions(token)
      .then((rows) => {
        setSessions(rows)
        setSessionsStatus('ready')
      })
      .catch(() => {
        setSessions([])
        setSessionsStatus('error')
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
      })
      .catch(() => {
        if (cancelled) return
        setSessions([])
        setSessionsStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [token, allowed])

  useEffect(() => {
    if (!allowed) return
    const draft = takeConstitutionConsultDraft()
    if (draft) setDraftSeed(draft)
  }, [allowed])

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

  const uploadPolicy = consultAttachmentPolicy({
    email: user?.email,
    siteAdmin: Boolean(user?.site_admin),
  })

  const chatCopy = useMemo(
    () => ({
      empty: t.empty,
      emptyGeneral: t.emptyGeneral,
      emptyProfessional: t.emptyProfessional,
      emptyTcm: t.emptyTcm,
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
      modeLabel: t.modeLabel,
      composerModeNow: t.composerModeNow,
      composerSourcesOff: t.composerSourcesOff,
      composerSourcesHere: t.composerSourcesHere,
      composerTcmSources: t.composerTcmSources,
      composerUseProfessional: t.composerUseProfessional,
      composerUseGeneral: t.composerUseGeneral,
      sessionModeNote: !sessionId
        ? ''
        : entry === 'professional'
          ? t.sessionProfessionalNote
          : entry === 'tcm'
            ? t.sessionTcmNote
            : t.sessionGeneralNote,
      modeName: entry === 'tcm' ? t.tcmTitle : entry === 'professional' ? t.professional : t.general,
      historyLoading: t.historyLoading,
      loadFail: t.loadFail,
      disclaimer,
      handoffReady: t.handoffReady,
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
      attachHint: uploadPolicy.exempt
        ? t.attachHintExempt
        : user?.site_admin ? t.attachHintAdmin : t.attachHint,
      attachDefault: t.attachDefault,
      attachTooLarge: t.attachTooLarge,
      attachHeic: t.attachHeic,
      attachScannedPdf: t.attachScannedPdf,
      attachPdfFail: t.attachPdfFail,
      attachEmptyDoc: t.attachEmptyDoc,
      attachOldDoc: t.attachOldDoc,
      attachUnsupported: t.attachUnsupported,
      attachLimit: uploadPolicy.exempt
        ? t.attachLimitExempt
        : user?.site_admin ? t.attachLimitAdmin : t.attachLimit,
      attachTransport: t.attachTransport,
      attachImageUnread: t.attachImageUnread,
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
    [t, disclaimer, entry, sessionId, user?.site_admin, uploadPolicy.exempt],
  )

  function setEntry(next) {
    if (next === entry) return
    const sp = new URLSearchParams(params)
    sp.set('entry', next)
    sp.delete('session')
    setParams(sp, { replace: true })
    setChatNonce((n) => n + 1)
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
    } catch {
      setSessionsStatus('error')
    }
  }

  async function clearAllSessions() {
    const rows = visibleSessions
    if (!token || !rows.length || clearing) return
    if (!window.confirm(t.clearConfirm)) return
    setClearing(true)
    try {
      for (const row of rows) {
        await deleteConsultSession(token, row.id)
      }
      const drop = new Set(rows.map((row) => row.id))
      setSessions((prev) => prev.filter((row) => !drop.has(row.id)))
      setSessionsStatus('ready')
      newChat()
    } catch {
      setSessionsStatus('error')
    } finally {
      setClearing(false)
    }
  }

  function openSession(row) {
    if (!row?.id) return
    const sp = new URLSearchParams(params)
    sp.set('session', row.id)
    sp.delete('q')
    if (row.entry === 'professional' || row.entry === 'general' || row.entry === 'tcm') {
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

  const queryFromUrl = (params.get('q') || '').trim()
  const composerSeed = queryFromUrl || draftSeed
  const assessAllowed = hasLevelAccess(user?.level, 'standard', { isGuest: !user })
  const professionalAllowed = hasLevelAccess(user?.level, 'premium', { isGuest: !user })
  const loginTarget = {
    pathname: '/consult',
    search: params.toString() ? `?${params.toString()}` : '',
  }

  if (loading) {
    return (
      <div className={`page-consult ${rtl ? 'page-consult--rtl' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
        <aside className="consult-disclaimer page-callout page-callout--warn" role="note">
          <p>{disclaimer}</p>
        </aside>
        <p className="consult-auth-loading" role="status">{t.authLoading}</p>
      </div>
    )
  }

  if (!user || !token) {
    return (
      <div className={`page-consult ${rtl ? 'page-consult--rtl' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
        <aside className="consult-disclaimer page-callout page-callout--warn" role="note">
          <p>{disclaimer}</p>
        </aside>
        <div className="consult-gate content-card content-card--padded">
          <h1>{entry === 'tcm' ? t.tcmTitle : t.title}</h1>
          <p>{t.needLogin}</p>
          <div className="consult-gate-actions">
            <Link to="/login" state={{ from: loginTarget }} className="btn-primary">{t.login}</Link>
            <Link to={homePath}>{entry === 'tcm' ? t.backTcm : t.back}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`page-consult ${rtl ? 'page-consult--rtl' : ''}`} dir={rtl ? 'rtl' : 'ltr'}>
      <header className="consult-top">
        <button type="button" className="consult-back" onClick={() => navigate(homePath)}>
          <span className="consult-back-arrow" aria-hidden="true" />
          {entry === 'tcm' ? t.backTcm : t.back}
        </button>
      </header>
      <ModulePageHero path={entry === 'tcm' ? '/tcm-prevention' : '/consult'} title={entry === 'tcm' ? t.tcmTitle : t.title} />

      <aside className="consult-disclaimer page-callout page-callout--warn" role="note">
        <p>{disclaimer}</p>
      </aside>

      <div className={`consult-layout ${entry === 'tcm' ? 'consult-layout--single' : ''}`}>
        {entry === 'tcm' ? null : (
          <div className="consult-mode-switch" role="group" aria-label={t.modeLabel}>
            <button
              type="button"
              className={entry === 'general' ? 'is-active' : ''}
              aria-pressed={entry === 'general'}
              onClick={() => setEntry('general')}
            >
              {t.general}
            </button>
            <button
              type="button"
              className={entry === 'professional' ? 'is-active' : ''}
              aria-pressed={entry === 'professional'}
              onClick={() => setEntry('professional')}
            >
              <span>{t.professional}</span>
              {!professionalAllowed ? <small>{getMembershipLevelLabel('premium', lang)}</small> : null}
            </button>
          </div>
        )}
        <p className="consult-mode-hint">
          {entry === 'tcm'
            ? t.modeHintTcm
            : entry === 'professional'
              ? t.modeHintProfessional
              : t.modeHintGeneral}
        </p>
        {allowed ? (
          <SessionList
            sessions={visibleSessions}
            activeId={sessionId}
            loading={sessionsStatus === 'loading'}
            error={sessionsStatus === 'error'}
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

        <main className="consult-main">
          {!allowed ? (
            <div className="consult-locked content-card content-card--padded">
              <p>{t.needLevel(getMembershipLevelLabel(required, lang))}</p>
              {queryFromUrl ? (
                <p className="consult-lock-query">
                  <span>{t.handoffPreview}</span>
                  {queryFromUrl}
                </p>
              ) : null}
              <Link to={required === 'premium' ? '/payment?plan=premium_monthly' : '/payment?plan=standard_monthly'} className="btn-primary">{t.upgrade}</Link>
              <Link to={homePath}>{entry === 'tcm' ? t.backTcm : t.back}</Link>
            </div>
          ) : (
            <>
              <aside
                className={`consult-profile-banner ${profileStatus === 'ready' ? 'is-ready' : 'is-missing'}`}
                role="status"
              >
                <p>
                  {profileStatus === 'loading' ? t.profileLoading
                    : profileStatus === 'ready' ? t.profileReady
                      : profileStatus === 'error' ? t.profileError
                        : t.profileMissing}
                </p>
                {profileStatus === 'loading' ? null : (
                  <Link to="/health-questionnaire">
                    {profileStatus === 'ready' ? t.profileUpdate : t.profileFill}
                  </Link>
                )}
                {entry === 'tcm' || profileStatus === 'loading' ? null : assessAllowed ? (
                  <>
                    <Link to="/solutions/risk">{t.profileRisk}</Link>
                    <Link to="/solutions/aging">{t.profileAging}</Link>
                  </>
                ) : (
                  <Link to="/payment?plan=standard_monthly">{t.profileAssessLocked}</Link>
                )}
              </aside>
              {sessionsStatus === 'error' ? (
                <div className="consult-unavailable" role="alert">
                  <p>{t.unavailable}</p>
                  <button type="button" onClick={refreshSessions}>{t.retry}</button>
                </div>
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
                <div className="consult-boot" role="status">
                  <p>{t.profileLoading}</p>
                  {queryFromUrl || draftSeed ? (
                    <p className="consult-boot-q">
                      <span>{t.handoffPreview}</span>
                      {queryFromUrl || draftSeed}
                    </p>
                  ) : null}
                </div>
              ) : (
                <ChatWindow
                  key={`chat-${entry}-${chatNonce}`}
                  token={token}
                  lang={lang}
                  entry={entry}
                  onSelectEntry={entry === 'tcm' ? undefined : setEntry}
                  initialDraft={composerSeed}
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
                  unlimitedUploads={uploadPolicy.unlimitedImages}
                  unlimitedUploadBytes={uploadPolicy.unlimitedImageBytes}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
