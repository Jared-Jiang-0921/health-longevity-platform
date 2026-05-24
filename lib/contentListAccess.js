import { canViewContent, parseContentRequiredLevel } from './contentAccess.js'

/** 列表/详情项：附加 content_level、can_view（与 module-assets / product-catalog 一致） */
export function attachContentAccessFields(row, viewer) {
  const content_level = parseContentRequiredLevel(row.required_level)
  const can_view =
    viewer?.isAdmin ||
    canViewContent(viewer?.level, row.required_level, { isGuest: viewer?.isGuest })
  return { content_level, can_view }
}
