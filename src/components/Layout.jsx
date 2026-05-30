import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { canAccess } from '../data/membership'
import { SITE_LEGAL } from '../data/siteLegal'
import CookieConsentBanner from './CookieConsentBanner'
import './Layout.css'

const LOGO_SRC = '/images/logo-longevity-atlas.png'

/** 顶栏主菜单：首页 + 六大模块（C 端） */
const primaryNavItems = [
  { path: '/', label: { zh: '首页', en: 'Home', ar: 'الرئيسية' } },
  { path: '/solutions', label: { zh: 'AI长寿师', en: 'AI Coach', ar: 'مدرب AI' } },
  { path: '/health-skills', label: { zh: '长寿知识技能', en: 'Health Skills', ar: 'مهارات' } },
  { path: '/products', label: { zh: '长寿产品证据库', en: 'Evidence Library', ar: 'مكتبة الأدلة' } },
  { path: '/tcm-prevention', label: { zh: '中医治未病', en: 'Preventive TCM', ar: 'وقاية صينية' } },
  { path: '/longevity-news', label: { zh: '前沿医学资讯', en: 'Medical Insights', ar: 'مستجدات' } },
  { path: '/translation-opportunities', label: { zh: '转化应用机会', en: 'Commercialization', ar: 'فرص' }, muted: true },
]

const adminFooterItems = [
  { path: '/ops/payment-monitor', label: { zh: '支付巡检', en: 'Payment Monitor', ar: 'مراقبة الدفع' } },
  { path: '/ops/users', label: { zh: '用户管理', en: 'Users Admin', ar: 'إدارة المستخدمين' } },
  { path: '/ops/health-questionnaires', label: { zh: '问卷记录', en: 'Questionnaires', ar: 'استبيانات' } },
]

const I18N = {
  zh: {
    login: '登录',
    register: '注册',
    logout: '退出',
    language: '语言',
    legalAria: '法律条款',
    footerMore: '更多',
    footerDisclaimer:
      '本平台内容仅供健康教育与生活方式参考，不替代专业诊疗、处方或紧急医疗处置；特殊人群（妊娠、儿童、慢病用药者等）请咨询医生。',
    footerMethodology: '证据分级说明',
    footerSources: '来源：临床指南 · PubMed · 注册试验 · 监管公开信息',
    footerContact: '联系',
    footerFavorites: '我的收藏',
    footerPayment: '支付结算',
    footerAccount: '会员信息',
    footerOrg: '企业管理',
    footerAdmin: '站点管理',
  },
  en: {
    login: 'Login',
    register: 'Sign up',
    logout: 'Logout',
    language: 'Language',
    legalAria: 'Legal',
    footerMore: 'More',
    footerDisclaimer:
      'Content is for education and lifestyle guidance only—not medical diagnosis or treatment. Consult a clinician for special populations.',
    footerMethodology: 'Evidence grading',
    footerSources: 'Sources: guidelines · PubMed · trials · regulatory disclosures',
    footerContact: 'Contact',
    footerFavorites: 'Favorites',
    footerPayment: 'Payment',
    footerAccount: 'Account',
    footerOrg: 'Organization',
    footerAdmin: 'Admin',
  },
  ar: {
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    language: 'اللغة',
    legalAria: 'قانوني',
    footerMore: 'المزيد',
    footerDisclaimer: 'المحتوى تعليمي فقط وليس بديلاً عن الرعاية الطبية.',
    footerMethodology: 'تصنيف الأدلة',
    footerSources: 'المصادر: إرشادات · PubMed · تجارب · معلومات تنظيمية',
    footerContact: 'تواصل',
    footerFavorites: 'المفضلة',
    footerPayment: 'الدفع',
    footerAccount: 'الحساب',
    footerOrg: 'المؤسسة',
    footerAdmin: 'إدارة',
  },
}

export default function Layout({ children }) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { lang, setLang } = useLocale()
  const t = I18N[lang] || I18N.zh
  const isHome = location.pathname === '/'

  const visibleNavItems = primaryNavItems.filter((item) => canAccess(item.path, user?.level))

  return (
    <>
      <header className="site-header site-header--clinical">
        <div className="header-inner header-inner--clinical">
          <Link to="/" className="logo" aria-label={SITE_LEGAL.brandName}>
            <span className="logo-wrap">
              <img
                src={LOGO_SRC}
                alt=""
                className="logo-img"
                width={200}
                height={48}
                decoding="async"
              />
            </span>
            <span className="logo-sr">{SITE_LEGAL.brandName}</span>
          </Link>
          <nav className="nav nav--clinical" aria-label="Main">
            {visibleNavItems.map(({ path, label, muted }) => {
              const active =
                location.pathname === path
                || (path !== '/' && location.pathname.startsWith(path))
              return (
                <Link
                  key={path}
                  to={path}
                  className={[active ? 'active' : '', muted ? 'nav-link--muted' : ''].filter(Boolean).join(' ')}
                >
                  {label[lang] || label.zh}
                </Link>
              )
            })}
          </nav>
          <div className="header-actions">
            <div className="header-lang" role="group" aria-label={t.language}>
              <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label={t.language}>
                <option value="zh">简体中文</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <span className="nav-auth">
              {user ? (
                <>
                  <Link to="/account" className="header-account-link">
                    {user.name}
                  </Link>
                  <button type="button" className="btn-logout" onClick={logout}>{t.logout}</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="header-auth-link">{t.login}</Link>
                  <Link to="/register" className="header-auth-register">{t.register}</Link>
                </>
              )}
            </span>
          </div>
        </div>
      </header>
      <main className={`main${isHome ? ' main--home' : ''}`}>{children}</main>
      <footer className="site-footer site-footer--clinical">
        <div className="footer-inner footer-inner--clinical">
          <p className="footer-disclaimer">{t.footerDisclaimer}</p>
          <div className="footer-meta-row">
            <Link to="/disclaimer">{t.footerMethodology}</Link>
            <span className="footer-sep">·</span>
            <span className="footer-sources">{t.footerSources}</span>
          </div>
          <p className="footer-contact">
            {t.footerContact}：
            <a href={`mailto:${SITE_LEGAL.contactEmail}`}>{SITE_LEGAL.contactEmail}</a>
          </p>
          <nav className="footer-more" aria-label={t.footerMore}>
            <span className="footer-more-label">{t.footerMore}</span>
            {user && canAccess('/favorites', user?.level) ? (
              <Link to="/favorites">{t.footerFavorites}</Link>
            ) : null}
            {canAccess('/payment', user?.level) ? (
              <Link to="/payment">{t.footerPayment}</Link>
            ) : null}
            {user ? (
              <Link to="/account">{t.footerAccount}</Link>
            ) : null}
            {user?.site_admin ? (
              <Link to="/org">{t.footerOrg}</Link>
            ) : null}
          </nav>
          {user?.site_admin ? (
            <nav className="footer-admin" aria-label={t.footerAdmin}>
              {adminFooterItems.map(({ path, label }) => (
                <Link key={path} to={path}>{label[lang] || label.zh}</Link>
              ))}
            </nav>
          ) : null}
          <p className="footer-copy">© {SITE_LEGAL.brandName}</p>
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
