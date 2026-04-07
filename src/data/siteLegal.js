/**
 * 站点品牌与合规信息 —— 上线前按需改为真实文案
 *
 * - brandName：对外品牌（页眉 Logo、首页主标题、页脚 ©）
 * - legalEntityName：法律主体（仅用户协议/隐私/免责声明正文；公司未注册时可写「运营方：xxx（主体待定）」等）
 *
 * 收款货币（美元 / 人民币）：产品侧可在支付页展示双币种或按 Stripe 结算货币配置；
 * 法律文本不必写死币种，必要时在《用户协议》「价格与支付」一节补充。
 *
 * 多语文本见 src/data/legalDocumentsI18n.js（英/简中/阿；律师审阅前为模板）。
 */
export const SITE_LEGAL = {
  /** 对外品牌名，与 Logo 一致 */
  brandName: 'Health Longevity Platform',
  /**
   * 法律上的运营/责任主体名称；未注册公司时可保留占位
   * 例：「[拟注册主体名称]（筹备中）」或「某某（自然人运营，主体待定）」
   */
  /** 中英文对外法律主体名称（与注册信息一致者为准） */
  legalEntityName: '恒悦生国际有限公司（Longvity International Limited）',
  /** 用户联系邮箱 */
  contactEmail: 'jiangyong_gpt@outlook.com',
  /** 可选：注册地址或办公地址（留空则法律页不展示地址行） */
  contactAddress: '',
  /** 文档更新日期，展示用 */
  lastUpdated: '2026-03-30',
}
