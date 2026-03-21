import { Link } from 'react-router-dom'
import { SITE_LEGAL } from '../data/siteLegal'
import './LegalPages.css'

export default function LegalPrivacy() {
  const { legalEntityName, contactEmail, contactAddress, lastUpdated } = SITE_LEGAL

  return (
    <div className="page-content page-legal">
      <p className="legal-meta">更新日期：{lastUpdated}</p>
      <h1>隐私政策（简版）</h1>
      <p className="legal-lead">
        <strong>{legalEntityName}</strong>（「我们」）说明本网站如何收集与使用个人信息。
      </p>

      <h2>一、收集与用途</h2>
      <p>
        我们可能收集：您主动提供的账户信息（如邮箱、昵称、会员信息）；通过支付服务商（如 Stripe）处理的支付信息（我们不存完整卡号）；以及为安全与改进服务所需的技术与日志信息（如设备、浏览器、大致地区、Cookie/本地存储）。
        用途包括：提供登录与会员、处理订单、安全风控、合规与改进体验。
      </p>

      <h2>二、共享、跨境与安全</h2>
      <p>
        我们不出售个人信息。仅在您同意、为履行服务所必需的受托方（如支付、托管）、或法律法规要求时共享。数据可能存储在境外基础设施，我们将依法采取合理安全措施。
      </p>

      <h2>三、您的权利与未成年人</h2>
      <p>
        在适用法律范围内，您可联系我们行使访问、更正、删除等权利：{contactEmail}。未成年人请在监护人同意下使用。本政策可能更新，重大变更将在网站提示。
      </p>

      <h2>四、联系我们</h2>
      <p>
        主体：{legalEntityName}<br />
        邮箱：{contactEmail}<br />
        地址：{contactAddress}
      </p>

      <p className="legal-back">
        <Link to="/">返回首页</Link>
      </p>
    </div>
  )
}
