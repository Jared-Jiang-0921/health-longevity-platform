import { Link } from 'react-router-dom'
import { SITE_LEGAL } from '../data/siteLegal'
import './LegalPages.css'

export default function LegalTerms() {
  const { legalEntityName, contactEmail, lastUpdated } = SITE_LEGAL

  return (
    <div className="page-content page-legal">
      <p className="legal-meta">更新日期：{lastUpdated}</p>
      <h1>用户服务协议（简版）</h1>
      <p className="legal-lead">
        <strong>{legalEntityName}</strong>（「我们」）向您提供本网站的健康教育类在线服务。使用即表示您同意本协议要点。
      </p>

      <h2>一、账户与协议变更</h2>
      <p>
        您应妥善保管账号与密码并对账号行为负责。我们可更新本协议并在网站公布，您继续使用视为接受更新。异常请邮件 {contactEmail}。
      </p>

      <h2>二、会员与付费</h2>
      <p>
        等级、价格与权益以页面及支付时展示为准。数字服务与已开通权益除法律另有规定外一般不予退款，具体以届时公示为准。
      </p>

      <h2>三、服务性质与知识产权</h2>
      <p>
        本服务为健康教育资讯与工具，不构成诊疗建议；医疗相关说明见《健康免责声明》。网站内容的知识产权归我们或权利人所有，未经许可不得擅自复制或商用。
      </p>

      <h2>四、责任范围</h2>
      <p>
        在法律允许范围内，我们对因使用本服务产生的间接损失等不承担责任；我们赔偿责任以您就该争议已支付金额为上限（若有）。
      </p>

      <p className="legal-back">
        <Link to="/">返回首页</Link>
      </p>
    </div>
  )
}
