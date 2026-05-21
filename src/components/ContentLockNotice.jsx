import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { getMembershipLevelLabel } from '../i18n/terms'
import { parseContentRequiredLevel } from '../data/membership'
import '../styles/membership-badge.css'

const COPY = {
  zh: {
    guest: (label) => `该内容需${label}，请登录或注册后查看。`,
    member: (label) => `该内容需${label}，请升级会员后查看。`,
    login: '登录',
    register: '注册',
    upgrade: '升级会员',
  },
  en: {
    guest: (label) => `This content requires ${label}. Please sign in or register.`,
    member: (label) => `This content requires ${label}. Please upgrade your membership.`,
    login: 'Login',
    register: 'Sign up',
    upgrade: 'Upgrade',
  },
  ar: {
    guest: (label) => `يتطلب هذا المحتوى ${label}. يرجى تسجيل الدخول أو إنشاء حساب.`,
    member: (label) => `يتطلب هذا المحتوى ${label}. يرجى ترقية العضوية.`,
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    upgrade: 'ترقية العضوية',
  },
}

/**
 * @param {{ requiredLevel?: string | null, user?: { level?: string } | null, className?: string }} props
 */
export default function ContentLockNotice({ requiredLevel, user, className = '' }) {
  const { lang } = useLocale()
  const t = COPY[lang] || COPY.zh
  const required = parseContentRequiredLevel(requiredLevel)
  if (!required) return null
  const label = getMembershipLevelLabel(required, lang)
  const isGuest = !user

  return (
    <div className={`content-lock-notice ${className}`.trim()} role="note">
      <span className={`membership-badge membership-${required}`}>{label}</span>
      <p>{isGuest ? t.guest(label) : t.member(label)}</p>
      <p className="content-lock-actions">
        {isGuest ? (
          <>
            <Link to="/login">{t.login}</Link>
            <span className="page-sep"> · </span>
            <Link to="/register">{t.register}</Link>
          </>
        ) : (
          <Link to="/payment">{t.upgrade}</Link>
        )}
      </p>
    </div>
  )
}
