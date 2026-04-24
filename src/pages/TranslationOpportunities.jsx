import './TranslationOpportunities.css'
import { useLocale } from '../context/LocaleContext'

export default function TranslationOpportunities() {
  const { lang } = useLocale()
  const t = {
    zh: { title: '转化应用机遇', lead: '本模块主要集中筛选和提供当前前沿研究中具有潜力转化应用的知识或项目，让健康长寿商业服务商找到开发方向，并帮助提供落地实践经验，弥补科研和应用的鸿沟，加速长寿研究的市场化推广。', more: '资料区支持管理员上传音频、视频、文档和图片。' },
    en: { title: 'Translation Opportunities', lead: 'This module highlights translational opportunities from frontier research to help longevity service providers identify practical commercialization directions.', more: 'The resource area supports admin uploads for audio, video, documents, and images.' },
    ar: { title: 'فرص التطبيق التحويلي', lead: 'تسلّط هذه الوحدة الضوء على فرص تحويل الأبحاث المتقدمة إلى تطبيقات عملية لدعم خدمات طول العمر.', more: 'تدعم منطقة الموارد رفع المسؤولين لملفات الصوت والفيديو والمستندات والصور.' },
  }[lang || 'zh']

  return (
    <div className="page-content page-translation-opportunities">
      <section className="opportunities-header">
        <h1>{t.title}</h1>
        <p className="opportunities-lead">
          {t.lead}
        </p>
      </section>
      <section className="opportunities-body">
        <p className="opportunities-placeholder">{t.more}</p>
      </section>
    </div>
  )
}
