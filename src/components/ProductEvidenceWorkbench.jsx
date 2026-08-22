import { useState } from 'react'
import ProductEvidenceCard from './ProductEvidenceCard'
import './ProductEvidenceCard.css'

const REGIONS = [
  { value: 'CN', label: '中国 CN' },
  { value: 'US', label: '美国 US' },
  { value: 'AU', label: '澳洲 AU' },
  { value: 'EU', label: '欧盟 EU' },
  { value: 'JP', label: '日本 JP' },
  { value: 'KR', label: '韩国 KR' },
]

export default function ProductEvidenceWorkbench() {
  const [approvalNo, setApprovalNo] = useState('')
  const [productName, setProductName] = useState('')
  const [originRegion, setOriginRegion] = useState('CN')
  const [adText, setAdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [payload, setPayload] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setPayload(null)
    if (!approvalNo.trim() && adText.trim().length < 2) {
      setError('请填写批准文号，或粘贴宣传文案')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/product-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_no: approvalNo.trim() || undefined,
          product_name: productName.trim() || undefined,
          origin_region: originRegion,
          ad_text: adText.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || '核验失败')
      setPayload(data)
    } catch (err) {
      setError(err.message || '核验失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="verify" className="product-evidence-workbench" aria-labelledby="evidence-workbench-title">
      <h2 id="evidence-workbench-title">产品真伪与声称核验</h2>
      <p>
        粘贴包装上的批准文号或商家宣传语，系统直连市场监管总局 / FDA / TGA 等公开库，
        核对文号真伪、官方保健功能、不适宜人群，并检测宣传是否超出批准范围。
        不替代医生诊断，保健食品不是药物。
      </p>
      <form className="product-evidence-form" onSubmit={onSubmit}>
        <label>
          <span>批准 / 备案文号</span>
          <input
            value={approvalNo}
            onChange={(e) => setApprovalNo(e.target.value)}
            placeholder="如 国食健注G20250101、食健备J…、国械注准…"
          />
        </label>
        <label>
          <span>产品名称（可选，用于套号核对）</span>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="包装上的商品名"
          />
        </label>
        <label>
          <span>监管辖区</span>
          <select value={originRegion} onChange={(e) => setOriginRegion(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>
        <label className="product-evidence-form-full">
          <span>宣传文案（可选）</span>
          <textarea
            rows={3}
            value={adText}
            onChange={(e) => setAdText(e.target.value)}
            placeholder="粘贴详情页或广告语，检测疾病治疗 / 超范围声称"
          />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '核验中…' : '开始核验'}
        </button>
      </form>
      {(loading || error || payload) ? (
        <ProductEvidenceCard payload={payload} loading={loading} error={error} showHead={false} />
      ) : null}
    </section>
  )
}
