/**
 * Longevity 外链：咨询双端口 + 可选内容入口。
 * 优先级：新名 VITE_* → 旧名 VITE_MANUS_* → 可选别名 VITE_LONGEVITY_*
 *
 * 注意：Vite 仅在构建时注入 import.meta.env，改 .env 后需重新 npm run build 再部署 dist。
 */
const e = import.meta.env

/** 仅当 IMA/知识库配置为浏览器可打开的 http(s) 地址时用作内容入口；ima:// 等自定义协议会被忽略 */
function httpUrlOnly(raw) {
  const s = String(raw || '').trim()
  return /^https?:\/\//i.test(s) ? s : ''
}

/** 专业健康长寿咨询入口 */
export function getConsultProfessionalUrl() {
  return (
    String(e.VITE_CONSULT_PROFESSIONAL_URL || '').trim() ||
    String(e.VITE_MANUS_PROFESSIONAL_URL || '').trim() ||
    String(e.VITE_LONGEVITY_PROFESSIONAL_URL || '').trim() ||
    ''
  )
}

/**
 * 自我健康促进咨询入口；未单独配置时与专业入口同址，由查询参数 hl_consult_entry=general 区分。
 */
export function getConsultGeneralUrl() {
  const explicit =
    String(e.VITE_CONSULT_GENERAL_URL || '').trim() ||
    String(e.VITE_MANUS_SELF_URL || '').trim() ||
    String(e.VITE_MANUS_GENERAL_URL || '').trim() ||
    String(e.VITE_LONGEVITY_GENERAL_URL || '').trim()
  if (explicit) return explicit
  return getConsultProfessionalUrl()
}

/**
 * 内容资源 / 知识库 H5 入口（与咨询并列的「内容通道」）；须为 https 可跳转地址。
 */
export function getContentEntryUrl() {
  return (
    String(e.VITE_CONTENT_ENTRY_URL || '').trim() ||
    String(e.VITE_LONGEVITY_CONTENT_URL || '').trim() ||
    String(e.VITE_MANUS_CONTENT_URL || '').trim() ||
    httpUrlOnly(e.VITE_IMA_KB_URL) ||
    ''
  )
}
