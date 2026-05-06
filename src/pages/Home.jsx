import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { canAccess, getRequiredLevel } from '../data/membership'
import { getMembershipLevelLabel } from '../i18n/terms'
import { getUi } from '../i18n/ui'
import { SITE_LEGAL } from '../data/siteLegal'
import RegisterRequiredModal from '../components/RegisterRequiredModal'
import './Home.css'

const modules = [
  {
    path: '/health-skills',
    title: { zh: '长寿知识技能', en: 'Health Skills', ar: 'مهارات طول العمر' },
    desc: {
      zh: '知识卡片、实操清单、证据等级、适用人群与风险提示五位一体的课程结构。',
      en: 'Cards, checklists, evidence levels, audience fit, and risk notes—in one structured path.',
      ar: 'بطاقات وقوائم وأدلة وجمهور وتنبيهات مخاطر في مسار منهجي واحد.',
    },
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  },
  {
    path: '/solutions',
    title: { zh: 'AI长寿方案师', en: 'AI Longevity Coach', ar: 'مدرب طول العمر بالذكاء الاصطناعي' },
    desc: {
      zh: '健康画像、风险识别、综合建议、报告解读、行动计划与就医提示（教育信息，不替代诊疗）。',
      en: 'Profiles, risks, guidance, lab context, action plans, and care prompts (education only—not medical care).',
      ar: 'صورة صحية ومخاطر وإرشادات وتفسير تقارير وخطط وتنبيهات رعاية (تعليمي فقط).',
    },
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
  },
  {
    path: '/products',
    title: { zh: '长寿产品证据库', en: 'Product Evidence Library', ar: 'مكتبة أدلة المنتجات' },
    desc: {
      zh: '证据与监管信息、购买决策辅助；保健食品须显著提示「不是药物」；不做治疗方案包装。',
      en: 'Evidence & regulatory context, purchase support; health-food labeling rules in CN; not treatment packaging.',
      ar: 'أدلة وسياق تنظيمي ودعم شراء؛ قواعد تسمية الأغذية الصحية؛ لا تُعرض كعلاج.',
    },
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
  },
  {
    path: '/longevity-news',
    title: { zh: '前沿医学资讯', en: 'Frontier Medical Insights', ar: 'مستجدات طبية رائدة' },
    desc: {
      zh: 'PubMed/顶刊与指南速递、证据解读与试验追踪；统一审慎表述，不将前沿等同已证实有效。',
      en: 'Journal & guideline digests, explainers, trial tracking; cautious wording—not proof of efficacy.',
      ar: 'ملخصات دوريات وإرشادات وتفسيرات وتجارب؛ صياغة حذرة دون equating بالفعالية المثبتة.',
    },
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  },
  {
    path: '/translation-opportunities',
    title: { zh: '转化应用机遇', en: 'Translation & Commercialization', ar: 'فرص التحويل والتطبيق' },
    desc: {
      zh: '面向创业者/投资人/企业与研究者：产业趋势、转化雷达、商业模式、机会库与合规风险；可延伸报告与社群等服务。',
      en: 'For founders, investors, firms, researchers—trends, radar, models, opportunity bank, risks; room for reports & community.',
      ar: 'لرواد الأعمال والمستثمرين والشركات والباحثين—اتجاهات ورادار ونماذج ومخاطر؛ مجال للتقارير والمجتمعات.',
    },
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
  },
  {
    path: '/tcm-prevention',
    title: { zh: '中医药特色 · 治未病', en: 'TCM Preventive Care', ar: 'الوقاية بالطب الصيني التقليدي' },
    desc: {
      zh: '中医治未病 × 现代预防与生活方式医学；体质、四季、饮食、情志、运动与中西方对照（药食与经典方资料库持续扩展）。',
      en: 'TCM 治未病 plus preventive & lifestyle medicine—constitution, seasons, diet, mind–body, movement, East–West bridge (herbs & formulas growing).',
      ar: 'وقاية صينية + طب وقائي حديث؛ أنماط وفصول وتغذية وضغط وحركة وجسر شرقي-غربي.',
    },
    image: 'https://images.pexels.com/photos/2064359/pexels-photo-2064359.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
]

export default function Home() {
  const { lang } = useLocale()
  const ui = getUi(lang)
  const t = {
    zh: {
      heroIntro:
        '长健星图，是一个以循证医学和AI智能为核心的健康长寿解决方案平台，帮助每个人更科学、更低门槛地理解健康、管理风险、延长健康寿命。',
      tagline: '长寿知识技能 · AI长寿方案师 · 长寿产品证据库 · 前沿医学资讯',
      welcome: '欢迎',
      modules: '服务模块',
      guestHint: '点击查看需注册',
      need: '需',
      upgrade: '升级会员',
      andAbove: '及以上',
    },
    en: {
      heroIntro:
        'Changjian Xingtu is a healthy longevity platform built on evidence-based medicine and AI—helping everyone understand health, manage risk, and extend healthspan with more science and lower barriers.',
      tagline: 'Longevity skills · AI Longevity Coach · product evidence library · frontier medical insights',
      welcome: 'Welcome',
      modules: 'Modules',
      guestHint: 'Login required to view',
      need: 'Requires',
      upgrade: 'Upgrade',
      andAbove: '+',
    },
    ar: {
      heroIntro:
        'تشانغجيان شينغتو منصة لحلول الصحة وطول العمر قائمة على الطب المبني على الأدلة والذكاء الاصطناعي، تساعد الجميع على فهم الصحة وإدارة المخاطر وتمديد العمر الصحي بشكل أكثر علمية وبعوائق أقل.',
      tagline: 'مهارات طول العمر · مدرب طول العمر بالذكاء الاصطناعي · مكتبة أدلة المنتجات · مستجدات طبية',
      welcome: 'مرحبًا',
      modules: 'الوحدات',
      guestHint: 'يتطلب التسجيل للعرض',
      need: 'يتطلب',
      upgrade: 'ترقية',
      andAbove: 'أو أعلى',
    },
  }[lang || 'zh']
  const { user } = useAuth()
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  return (
    <div className="page-home">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <h1>{SITE_LEGAL.brandName}</h1>
          <div className="hero-intro-block">
            <p className="hero-intro">{t.heroIntro}</p>
          </div>
          <p className="tagline">{t.tagline}</p>
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
            const moduleTitle = title[lang] || title.zh
            const moduleDesc = desc[lang] || desc.zh

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
                    <h3>{moduleTitle}</h3>
                    <p>{moduleDesc}</p>
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
                    <h3>{moduleTitle}</h3>
                    <p>{moduleDesc}</p>
                  </div>
                </Link>
              )
            }
            return (
              <div key={path} className="module-card module-card-locked">
                <div className="module-card-image" style={{ backgroundImage: `url(${image})` }} />
                <div className="module-card-body">
                  <h3>{moduleTitle}</h3>
                  <p>{moduleDesc}</p>
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
