import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { canAccess, getRequiredLevel, MEMBERSHIP_LEVELS } from '../data/membership'

const COPY = {
  zh: {
    registerTitle: '注册会员观看课程',
    registerBody: '普通用户需先注册并登录会员后，才能查看长寿知识技能课程内容。',
    monitorTitle: '请先登录',
    monitorBody: 'AI健康监测需登录后使用，并仅向高级会员开放。',
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
    monitorTitle: 'Please sign in',
    monitorBody: 'AI Health Monitor requires sign-in and a Premium membership.',
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
    monitorTitle: 'يرجى تسجيل الدخول',
    monitorBody: 'رصد الصحة يتطلب تسجيل الدخول وعضوية مميزة.',
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

  const isMonitor = path === '/health-monitor' || path.startsWith('/health-monitor/')

  if (!user) {
    return (
      <div className="page-content page-register-required">
        <h1>{isMonitor ? t.monitorTitle : t.registerTitle}</h1>
        <p>{isMonitor ? t.monitorBody : t.registerBody}</p>
        <p className="register-actions">
          <Link to="/register" className="btn-primary">{t.register}</Link>
          <span className="action-sep"> </span>
          <Link to="/login">{t.login}</Link>
        </p>
        <p><Link to="/" className="back-link">{t.home}</Link></p>
      </div>
    )
  }

  const levelName = required ? MEMBERSHIP_LEVELS[required]?.name : '登录'
  return (
    <div className="page-content">
      <h1>{t.deniedTitle}</h1>
      <p>{t.deniedBody(levelName)}</p>
      <p><Link to="/payment">{t.upgrade}</Link></p>
      <p><Link to="/">{t.home}</Link></p>
    </div>
  )
}
