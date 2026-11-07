import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { canAccess, getRequiredLevel } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'

const COPY = {
  zh: {
    registerTitle: '注册会员观看课程',
    registerBody: '普通用户需先注册并登录会员后，才能查看长寿知识技能课程内容。',
    riskTitle: '请先登录',
    riskBody: '网站风险评估需登录，且仅向标准会员及以上开放。',
    consultTitle: '请先登录',
    consultBody: 'AI 健康咨询需登录后使用。自我健康促进向已登录会员开放；专业咨询需高级会员。',
    consultDisclaimer: '⚠ 本平台提供的健康信息仅供参考，不构成医疗诊断、治疗建议或处方依据。如有健康问题，请及时就诊于执业医疗机构，遵从执业医师的专业判断。',
    agingTitle: '请先登录',
    agingBody: '网站衰老评估需登录，且仅向标准会员及以上开放。',
    constitutionTitle: '请先登录',
    constitutionBody: '初步体质辨识需登录，并向标准会员及以上开放。',
    register: '注册会员',
    login: '登录',
    home: '返回首页',
    deniedTitle: '权限不足',
    deniedBody: (name) => `该模块需要「${name}」及以上等级。请升级会员后使用。`,
    upgrade: '升级会员',
  },
  en: {
    registerTitle: 'Register to watch courses',
    registerBody: 'Please register and sign in as a member to view Health Skills courses.',
    riskTitle: 'Please sign in',
    riskBody: 'Website risk assessments require sign-in and Standard membership or higher.',
    consultTitle: 'Please sign in',
    consultBody: 'AI health consult requires sign-in. Self-care is available to signed-in members; professional consult requires Premium.',
    consultDisclaimer: '⚠ The health information provided on this platform is for reference only and does not constitute medical diagnosis, treatment advice, or prescription guidance. If you have health concerns, please consult a licensed medical professional.',
    agingTitle: 'Please sign in',
    agingBody: 'Aging clocks require Standard membership or higher.',
    constitutionTitle: 'Please sign in',
    constitutionBody: 'The constitution check requires sign-in and Standard membership or higher.',
    register: 'Register',
    login: 'Login',
    home: 'Back to home',
    deniedTitle: 'Access denied',
    deniedBody: (name) => `This module requires ${name} or higher. Please upgrade your membership.`,
    upgrade: 'Upgrade',
  },
  ar: {
    registerTitle: 'سجّل عضوية لمشاهدة الدورات',
    registerBody: 'يرجى التسجيل وتسجيل الدخول كعضو لمشاهدة دورات المعرفة والمهارات.',
    riskTitle: 'يرجى تسجيل الدخول',
    riskBody: 'تقييمات المخاطر الصحية تتطلب تسجيل الدخول وعضوية قياسية أو أعلى.',
    consultTitle: 'يرجى تسجيل الدخول',
    consultBody: 'تتطلب الاستشارة الصحية تسجيل الدخول. تعزيز الصحة الذاتية متاح بعد الدخول، والاستشارة المهنية تتطلب عضوية مميزة.',
    consultDisclaimer: '⚠ المعلومات الصحية المقدمة على هذه المنصة هي للإشارة فقط ولا تشكل تشخيصًا طبيًا أو نصيحة علاجية. إذا كانت لديك مخاوف صحية، يرجى استشارة طبيب مرخص.',
    agingTitle: 'يرجى تسجيل الدخول',
    agingBody: 'تتطلب تقييمات الشيخوخة عضوية قياسية أو أعلى.',
    constitutionTitle: 'يرجى تسجيل الدخول',
    constitutionBody: 'التمييز الأولي لنمط الجسم يتطلب تسجيل الدخول وعضوية قياسية أو أعلى.',
    register: 'إنشاء حساب',
    login: 'تسجيل الدخول',
    home: 'العودة للرئيسية',
    deniedTitle: 'غير مسموح',
    deniedBody: (name) => `تتطلب هذه الوحدة ${name} أو أعلى. يرجى ترقية العضوية.`,
    upgrade: 'ترقية العضوية',
  },
}

export default function ProtectedModule({ children }) {
  const location = useLocation()
  const { user } = useAuth()
  const { lang } = useLocale()
  const t = COPY[lang] || COPY.zh
  const path = location.pathname
  const allowed = canAccess(path, user?.level, { isGuest: !user })
  const required = getRequiredLevel(path)

  if (allowed) return children

  const isRisk = path === '/solutions/risk' || path.startsWith('/solutions/risk/')
  const isAging = path === '/solutions/aging' || path.startsWith('/solutions/aging/')
  const isConsult = path === '/consult' || path.startsWith('/consult/')
  const isConstitution = path === '/tcm-prevention/constitution' || path.startsWith('/tcm-prevention/constitution/')
  const returnTo = { from: { pathname: path, search: location.search || '' } }

  if (!user) {
    return (
      <div className="page-content page-register-required">
        {isConsult ? (
          <aside className="page-callout page-callout--warn" role="note">
            <p>{t.consultDisclaimer}</p>
          </aside>
        ) : null}
        <h1>{isConstitution ? t.constitutionTitle : isConsult ? t.consultTitle : isAging ? t.agingTitle : isRisk ? t.riskTitle : t.registerTitle}</h1>
        <p>{isConstitution ? t.constitutionBody : isConsult ? t.consultBody : isAging ? t.agingBody : isRisk ? t.riskBody : t.registerBody}</p>
        <p className="register-actions">
          <Link to="/register" className="btn-primary">{t.register}</Link>
          <span className="action-sep"> </span>
          <Link to="/login" state={returnTo}>{t.login}</Link>
        </p>
        <p><Link to="/" className="back-link">{t.home}</Link></p>
      </div>
    )
  }

  const levelName = required
    ? getMembershipLevelLabel(required, lang)
    : (lang === 'en' ? 'sign-in' : lang === 'ar' ? 'تسجيل الدخول' : '登录')
  return (
    <div className="page-content">
      {isConsult ? (
        <aside className="page-callout page-callout--warn" role="note">
          <p>{t.consultDisclaimer}</p>
        </aside>
      ) : null}
      <h1>{t.deniedTitle}</h1>
      <p>{t.deniedBody(levelName)}</p>
      <p>
        <Link to={required === 'premium' ? '/payment?plan=premium_monthly' : '/payment?plan=standard_monthly'}>
          {t.upgrade}
        </Link>
      </p>
      <p><Link to="/">{t.home}</Link></p>
    </div>
  )
}
