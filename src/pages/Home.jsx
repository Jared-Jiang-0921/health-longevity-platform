import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { canAccess, getRequiredLevel, MEMBERSHIP_LEVELS } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
import { getUi } from '../i18n/ui'
import { SITE_LEGAL } from '../data/siteLegal'
import RegisterRequiredModal from '../components/RegisterRequiredModal'
import './Home.css'

const modules = [
  {
    path: '/health-skills',
    title: '长寿知识技能',
    desc: '系统化健康知识与技能课程',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  },
  {
    path: '/solutions',
    title: '综合长寿方案',
    desc: '个性化健康管理与长寿方案',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
  },
  {
    path: '/products',
    title: '循证健康产品',
    desc: '精选循证健康产品与用品',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  },
  {
    path: '/longevity-news',
    title: '前沿长寿医学资讯',
    desc: '国际权威期刊高影响因子健康长寿研究月更',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  },
  {
    path: '/translation-opportunities',
    title: '转化应用机遇',
    desc: '筛选前沿研究可转化项目，助力商业落地，弥合科研与应用鸿沟',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
  },
  {
    path: '/tcm-prevention',
    title: '中医药特色 · 治未病',
    desc: '中草药单药与经典治未病处方：药性、功效、适宜人群、出处',
    image: 'https://images.pexels.com/photos/2064359/pexels-photo-2064359.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
]

export default function Home() {
  const { lang, setLang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: { tagline: '长寿知识技能 · 综合长寿方案 · 循证健康产品 · 前沿医学资讯', welcome: '欢迎', modules: '服务模块', guestHint: '点击查看需注册', need: '需', upgrade: '升级会员', andAbove: '及以上' },
    en: { tagline: 'Longevity skills · integrated solutions · evidence-based products · frontier medical insights', welcome: 'Welcome', modules: 'Modules', guestHint: 'Login required to view', need: 'Requires', upgrade: 'Upgrade', andAbove: '+' },
    ar: { tagline: 'مهارات طول العمر · حلول متكاملة · منتجات قائمة على الدليل · مستجدات طبية', welcome: 'مرحبًا', modules: 'الوحدات', guestHint: 'يتطلب التسجيل للعرض', need: 'يتطلب', upgrade: 'ترقية', andAbove: 'أو أعلى' },
  }[lang || 'zh']
  const { user } = useAuth()
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  return (
    <div className="page-home">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <h1>{SITE_LEGAL.brandName}</h1>
          <p className="tagline">{t.tagline}</p>
          <div className="hero-lang" role="group" aria-label={ui.language}>
            <span className="hero-lang-label">{ui.language}</span>
            <select
              className="hero-lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={ui.language}
            >
              <option value="zh">简体中文</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div className="hero-auth">
            {user ? (
              <span className="hero-user">{t.welcome}，{user.name}（{getMembershipLevelLabel(user.level, lang)}）</span>
            ) : (
              <>
                <Link to="/login" className="btn-hero btn-login">{ui.login}</Link>
                <Link to="/register" className="btn-hero btn-register">{ui.register}</Link>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="modules">
        <h2>{t.modules}</h2>
        <div className="module-grid">
          {modules.map(({ path, title, desc, image }) => {
            const allowed = canAccess(path, user?.level)
            const requiredLevel = getRequiredLevel(path)
            const requiredName = requiredLevel ? getMembershipLevelLabel(requiredLevel, lang) : null

            if (!user) {
              return (
                <div
                  key={path}
                  className="module-card module-card-guest"
                  onClick={() => setShowRegisterModal(true)}
                  onKeyDown={(e) => e.key === 'Enter' && setShowRegisterModal(true)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="module-card-image" style={{ backgroundImage: `url(${image})` }} />
                  <div className="module-card-body">
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <p className="module-guest-hint">{t.guestHint}</p>
                  </div>
                </div>
              )
            }
            if (allowed) {
              return (
                <Link key={path} to={path} className="module-card">
                  <div className="module-card-image" style={{ backgroundImage: `url(${image})` }} />
                  <div className="module-card-body">
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </Link>
              )
            }
            return (
              <div key={path} className="module-card module-card-locked">
                <div className="module-card-image" style={{ backgroundImage: `url(${image})` }} />
                <div className="module-card-body">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <p className="module-lock">{t.need}{requiredName}{t.andAbove}</p>
                  <Link to="/payment" className="btn-upgrade">{t.upgrade}</Link>
                </div>
              </div>
            )
          })}
        </div>
      {showRegisterModal && (
        <RegisterRequiredModal onClose={() => setShowRegisterModal(false)} />
      )}
      </section>
    </div>
  )
}
