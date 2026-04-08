import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { MEMBERSHIP_LEVELS, canAccess } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
import { SITE_LEGAL } from '../data/siteLegal'
import CookieConsentBanner from './CookieConsentBanner'
import './Layout.css'

const navItems = [
  { path: '/', label: { zh: '首页', en: 'Home', ar: 'الرئيسية' } },
  { path: '/health-skills', label: { zh: '长寿知识技能', en: 'Health Skills', ar: 'مهارات الصحة' } },
  { path: '/solutions', label: { zh: '综合长寿方案', en: 'Solutions', ar: 'الحلول' } },
  { path: '/products', label: { zh: '循证健康产品', en: 'Evidence-Based Products', ar: 'منتجات مبنية على الدليل' } },
  { path: '/longevity-news', label: { zh: '前沿长寿医学资讯', en: 'Longevity News', ar: 'أخبار طول العمر' } },
  { path: '/tcm-prevention', label: { zh: '治未病', en: 'TCM Prevention', ar: 'الطب الوقائي' } },
  { path: '/translation-opportunities', label: { zh: '转化应用机遇', en: 'Translation Opportunities', ar: 'فرص التطبيق' } },
  { path: '/favorites', label: { zh: '我的收藏', en: 'Favorites', ar: 'المفضلة' } },
  { path: '/payment', label: { zh: '支付结算', en: 'Payment', ar: 'الدفع' } },
  { path: '/ops/payment-monitor', label: { zh: '支付巡检', en: 'Payment Monitor', ar: 'مراقبة الدفع' }, authOnly: true },
  { path: '/ops/users', label: { zh: '用户管理', en: 'Users Admin', ar: 'إدارة المستخدمين' }, authOnly: true },
  { path: '/ops/health-questionnaires', label: { zh: '问卷记录', en: 'Questionnaires', ar: 'سجلات الاستبيان' }, authOnly: true },
  { path: '/org', label: { zh: '企业管理', en: 'Organization', ar: 'المؤسسة' }, authOnly: true },
  { path: '/account', label: { zh: '会员信息', en: 'Account', ar: 'الحساب' }, authOnly: true },
]

const I18N = {
  zh: {
    login: '登录',
    register: '注册',
    logout: '退出',
    language: '语言',
    legalAria: '法律条款',
    footerCopy: '长寿知识 · 综合方案 · 循证产品.',
  },
  en: {
    login: 'Login',
    register: 'Sign up',
    logout: 'Logout',
    language: 'Language',
    legalAria: 'Legal',
    footerCopy: 'Longevity knowledge · integrated solutions · evidence-based products.',
  },
  ar: {
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    language: 'اللغة',
    legalAria: 'قانوني',
    footerCopy: 'معرفة طول العمر · حلول متكاملة · منتجات قائمة على الدليل.',
  },
}

export default function Layout({ children }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { lang, setLang } = useLocale()
  const t = I18N[lang] || I18N.zh
  const visibleNavItems = navItems.filter(
    (item) => (!item.authOnly || user) && canAccess(item.path, user?.level),
  )

  return (
    <>
      <div className="floating-lang" role="group" aria-label={t.language}>
        <span>{t.language}</span>
        <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label={t.language}>
          <option value="zh">简体中文</option>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            {SITE_LEGAL.brandName}
          </Link>
          <label className="header-lang">
            <span>{t.language}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label={t.language}>
              <option value="zh">简体中文</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <nav className="nav">
            {visibleNavItems.map(({ path, label }) => {
            const active = location.pathname === path || (path !== '/' && path !== '/favorites' && location.pathname.startsWith(path))
            return (
              <Link
                key={path}
                to={path}
                className={active ? 'active' : ''}
              >
                {label[lang] || label.zh}
              </Link>
            )
            })}
            <span className="nav-auth">
              {user ? (
                <>
                  <span className="nav-user">{user.name}（{getMembershipLevelLabel(user.level, lang)}）</span>
                  <button type="button" className="btn-logout" onClick={logout}>{t.logout}</button>
                </>
              ) : (
                <>
                  <Link to="/login">{t.login}</Link>
                  <span className="nav-sep">|</span>
                  <Link to="/register">{t.register}</Link>
                </>
              )}
            </span>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <label className="footer-lang">
            <span>{t.language}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label={t.language}>
              <option value="zh">简体中文</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <p className="footer-copy">© {SITE_LEGAL.brandName}. {t.footerCopy}</p>
          <nav className="footer-legal" aria-label={t.legalAria}>
            <Link to="/terms">Terms of Service</Link>
            <span className="footer-sep">·</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer-sep">·</span>
            <Link to="/disclaimer">Health Disclaimer</Link>
            <span className="footer-sep">·</span>
            <Link to="/legal/sale">Terms of Sale</Link>
            <span className="footer-sep">·</span>
            <Link to="/legal/health-data">Health Data Notice</Link>
            <span className="footer-sep">·</span>
            <Link to="/legal/cookies">Cookie Notice</Link>
          </nav>
        </div>
      </footer>
      <CookieConsentBanner />
    </>
  )
}
