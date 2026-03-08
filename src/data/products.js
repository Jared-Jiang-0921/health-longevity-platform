export const PRODUCT_CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'supplement', label: '营养补充剂' },
  { id: 'equipment', label: '健康设备' },
  { id: 'food', label: '健康食品' },
  { id: 'care', label: '日常养护' },
]

export const PRODUCTS = [
  { id: 1, title: '维生素 D3 + K2', category: 'supplement', price: 128, currency: 'CNY', desc: '促进钙吸收，支持骨骼与心血管健康。', unit: '瓶' },
  { id: 2, title: 'Omega-3 鱼油', category: 'supplement', price: 198, currency: 'CNY', desc: '高纯度 EPA/DHA，维护心血管与认知健康。', unit: '瓶' },
  { id: 3, title: '复合维生素', category: 'supplement', price: 158, currency: 'CNY', desc: '每日一片，满足基础营养需求。', unit: '瓶' },
  { id: 4, title: '褪黑素片', category: 'supplement', price: 68, currency: 'CNY', desc: '低剂量配方，辅助改善睡眠质量。', unit: '瓶' },
  { id: 5, title: '智能手环', category: 'equipment', price: 299, currency: 'CNY', desc: '心率、睡眠、运动监测，续航 7 天。', unit: '只' },
  { id: 6, title: '体脂秤', category: 'equipment', price: 199, currency: 'CNY', desc: '多指标测量，数据同步 App。', unit: '台' },
  { id: 7, title: '筋膜枪', category: 'equipment', price: 259, currency: 'CNY', desc: '多档位按摩，运动后放松与恢复。', unit: '台' },
  { id: 8, title: '有机燕麦', category: 'food', price: 48, currency: 'CNY', desc: '无糖添加，高膳食纤维，即食可冲泡。', unit: '袋' },
  { id: 9, title: '蓝莓干', category: 'food', price: 58, currency: 'CNY', desc: '抗氧化，适量食用有益认知。', unit: '盒' },
  { id: 10, title: '杏仁坚果', category: 'food', price: 38, currency: 'CNY', desc: '优质脂肪与蛋白质，每日一小把。', unit: '袋' },
  { id: 11, title: '护眼贴', category: 'care', price: 28, currency: 'CNY', desc: '缓解眼疲劳，适合长时间用眼人群。', unit: '盒' },
  { id: 12, title: '助眠精油', category: 'care', price: 78, currency: 'CNY', desc: '薰衣草等天然成分，辅助放松入睡。', unit: '瓶' },
]

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id))
}
