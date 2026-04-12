import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'

const I18N = {
  zh: {
    loading: '加载中…',
    needLogin: '请先登录后再访问该页面。',
    forbidden: '该页面仅限整站管理员访问（需在服务端配置 SITE_ADMIN_EMAILS）。',
    login: '登录',
    register: '注册',
    home: '返回首页',
  },
  en: {
    loading: 'Loading…',
    needLogin: 'Please sign in to access this page.',
    forbidden: 'This page is restricted to site administrators (SITE_ADMIN_EMAILS on the server).',
    login: 'Sign in',
    register: 'Sign up',
    home: 'Back to home',
  },
  ar: {
    loading: 'جارٍ التحميل…',
    needLogin: 'يرجى تسجيل الدخول للوصول إلى هذه الصفحة.',
    forbidden: 'هذه الصفحة مخصصة لمسؤولي الموقع فقط (SITE_ADMIN_EMAILS على الخادم).',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    home: 'العودة للرئيسية',
  },
}

export default function SiteAdminOnly({ children }) {
  const { user, loading, getToken } = useAuth()
  const { lang } = useLocale()
  const t = I18N[lang] || I18N.zh
  const hasToken = Boolean(getToken())

  if (loading && hasToken) {
    return (
      <div className="page-content">
        <p>{t.loading}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-content page-register-required">
        <h1>{t.needLogin}</h1>
        <p className="register-actions">
          <Link to="/login" className="btn-primary">{t.login}</Link>
          <span className="action-sep"> </span>
          <Link to="/register">{t.register}</Link>
        </p>
        <p><Link to="/" className="back-link">{t.home}</Link></p>
      </div>
    )
  }

  if (!user.site_admin) {
    return (
      <div className="page-content">
        <h1>{t.forbidden}</h1>
        <p><Link to="/">{t.home}</Link></p>
      </div>
    )
  }

  return children
}
