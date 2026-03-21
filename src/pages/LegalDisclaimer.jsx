import { Link } from 'react-router-dom'
import { SITE_LEGAL } from '../data/siteLegal'
import './LegalPages.css'

export default function LegalDisclaimer() {
  const { legalEntityName, contactEmail, lastUpdated } = SITE_LEGAL

  return (
    <div className="page-content page-legal">
      <p className="legal-meta">更新日期：{lastUpdated}</p>
      <h1>健康与医疗免责声明（简版）</h1>
      <p className="legal-lead legal-notice">
        <strong>{legalEntityName}</strong> 提供的内容仅供一般健康教育参考，不能替代执业医疗人员的专业判断与当面诊疗。
      </p>

      <h2>一、非诊疗与紧急情况</h2>
      <p>
        文章、课程、工具及外链均不构成诊断、治疗或用药建议。出现急症或危重症状请立即就医或拨打当地急救电话，勿因本网站延误救治。
      </p>

      <h2>二、个体差异与第三方</h2>
      <p>
        健康状况因人而异；妊娠、哺乳、慢病、服药等情形下，任何饮食、运动或补剂方案均应先咨询医生。我们对第三方链接的内容、产品及服务不承担责任；本站信息力求可靠但不保证完整、及时或适用于您个人。
      </p>

      <h2>三、责任限制</h2>
      <p>
        因参考或使用本站信息而产生的任何直接或间接损失，在法律允许范围内我们不承担责任。疑问请联系：{contactEmail}
      </p>

      <p className="legal-back">
        <Link to="/">返回首页</Link>
      </p>
    </div>
  )
}
