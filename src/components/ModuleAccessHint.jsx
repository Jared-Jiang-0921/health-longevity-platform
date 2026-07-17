import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { getMembershipLevelLabel } from '../i18n/terms'
import { getModuleAccessHint, getModuleAccessHintUi } from '../data/moduleAccessHints'
import { hasLevelAccess } from '../data/membership'
import '../styles/membership-badge.css'
import './ModuleAccessHint.css'

const TIERS = ['free', 'standard', 'premium']

/**
 * 非管理员：只展示模块三级可见说明，不渲染示例正文。
 * @param {{ moduleKey: string, className?: string }} props
 */
export default function ModuleAccessHint({ moduleKey, className = '' }) {
  const { lang } = useLocale()
  const { user } = useAuth()
  const hint = getModuleAccessHint(moduleKey, lang)
  const ui = getModuleAccessHintUi(lang)
  if (!hint) return null

  const isGuest = !user
  const needsUpgrade = !isGuest && !hasLevelAccess(user?.level, 'premium', { isGuest: false })

  return (
    <aside className={`module-access-hint ${className}`.trim()} role="note">
      <h2 className="module-access-hint-title">{hint.title}</h2>
      <p className="module-access-hint-lead">{hint.lead}</p>
      <ul className="module-access-hint-list">
        {TIERS.map((level) => (
          <li key={level} className="module-access-hint-item">
            <span className={`membership-badge membership-${level}`}>
              {getMembershipLevelLabel(level, lang)}
            </span>
            <span className="module-access-hint-desc">{hint.tiers[level]}</span>
          </li>
        ))}
      </ul>
      <p className="content-lock-actions module-access-hint-actions">
        {isGuest ? (
          <>
            <Link to="/login">{ui.login}</Link>
            <span className="page-sep"> · </span>
            <Link to="/register">{ui.register}</Link>
          </>
        ) : needsUpgrade ? (
          <Link to="/payment">{ui.upgrade}</Link>
        ) : null}
      </p>
    </aside>
  )
}
