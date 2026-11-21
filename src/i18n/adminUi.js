const ADMIN_UI = {
  zh: {
    edit: '编辑',
    revoke: '撤销',
    resend: '重发',
    enable: '启用',
    disable: '禁用',
    actions: '操作',
    noRecords: '暂无记录',
  },
  en: {
    edit: 'Edit',
    revoke: 'Revoke',
    resend: 'Resend',
    enable: 'Enable',
    disable: 'Disable',
    actions: 'Actions',
    noRecords: 'No records',
  },
}

export function getAdminUi(lang = 'zh') {
  return ADMIN_UI[lang] || ADMIN_UI.zh
}
