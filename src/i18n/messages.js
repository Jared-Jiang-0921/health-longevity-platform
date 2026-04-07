const MESSAGES = {
  zh: {
    loadFail: '加载失败',
    requestFail: '请求失败',
    saveFail: '保存失败',
    operationFail: '操作失败',
    networkError: '网络错误：',
    invalidInput: '输入无效',
  },
  en: {
    loadFail: 'Load failed',
    requestFail: 'Request failed',
    saveFail: 'Save failed',
    operationFail: 'Operation failed',
    networkError: 'Network error: ',
    invalidInput: 'Invalid input',
  },
  ar: {
    loadFail: 'فشل التحميل',
    requestFail: 'فشل الطلب',
    saveFail: 'فشل الحفظ',
    operationFail: 'فشلت العملية',
    networkError: 'خطأ في الشبكة: ',
    invalidInput: 'إدخال غير صالح',
  },
}

export function getMessages(lang = 'zh') {
  return MESSAGES[lang] || MESSAGES.zh
}
