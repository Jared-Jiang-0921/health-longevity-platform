import { MEMBERSHIP_LEVELS } from '../data/membership'

const MEMBERSHIP_LABELS = {
  zh: { free: '普通会员', standard: '标准会员', premium: '高级会员' },
  en: { free: 'Member', standard: 'Standard Member', premium: 'Premium Member' },
  ar: { free: 'عضو', standard: 'عضو قياسي', premium: 'عضو مميز' },
}

const ORG_ROLE_LABELS = {
  zh: { owner: '所有者', admin: '管理员', member: '成员' },
  en: { owner: 'Owner', admin: 'Admin', member: 'Member' },
  ar: { owner: 'مالك', admin: 'مسؤول', member: 'عضو' },
}

export function getMembershipLevelLabel(level, lang = 'zh') {
  const key = String(level || 'free').toLowerCase()
  const table = MEMBERSHIP_LABELS[lang] || MEMBERSHIP_LABELS.zh
  return table[key] || MEMBERSHIP_LEVELS[key]?.name || key
}

export function getOrgRoleLabel(role, lang = 'zh') {
  const key = String(role || '').toLowerCase()
  const table = ORG_ROLE_LABELS[lang] || ORG_ROLE_LABELS.zh
  return table[key] || role || '—'
}
