const BIBLIO_HEAD = /(?:^|\n)\s*(?:#{1,3}\s*|\*\*)?(?:参考文献|引用文献|参考资料|المراجع)(?:\*\*)?\s*(?:\n|$)/
const BIBLIO_HEAD_EN = /(?:^|\n)\s*#{1,3}\s*(?:References|Sources)\s*(?:\n|$)/i

function cutIndex(text) {
  const s = String(text || '')
  let idx = -1
  for (const re of [BIBLIO_HEAD, BIBLIO_HEAD_EN]) {
    const m = s.match(re)
    if (m && m.index != null && (idx < 0 || m.index < idx)) idx = m.index
  }
  return idx
}

/** 去掉文末「参考文献」章节，避免与可点击来源标签重复。 */
export function stripBibliographySection(text) {
  let s = String(text || '')
  const idx = cutIndex(s)
  if (idx >= 0) s = s.slice(0, idx)
  s = s.replace(/(?:\n|\r\n)\s*[-*]{3,}\s*$/u, '')
  s = stripFollowupBlock(s)
  return s.replace(/[ \t]+$/gm, '').replace(/\s+$/u, '')
}

export function stripFollowupBlock(text) {
  return String(text || '').replace(/(?:^|\n)\s*:::followups\b[\s\S]*$/i, '').replace(/\s+$/u, '')
}

export function parseFollowups(text) {
  const s = String(text || '')
  const m = s.match(/(?:^|\n)\s*:::followups\s*\n([\s\S]*?)(?:\n\s*:::)?\s*$/i)
  if (!m) return []
  return parseFollowupItems(m[1])
}

const FOLLOWUP_CATS = [
  { key: 'western', aliases: ['西医', '临床医学', 'western', 'clinical'] },
  { key: 'functional', aliases: ['功能医学', 'functional'] },
  { key: 'longevity', aliases: ['长寿医学', '长寿', 'longevity'] },
  { key: 'tcm', aliases: ['中医药', '中医', 'tcm'] },
  { key: 'related', aliases: ['相关', 'related'] },
]

function normalizeFollowupCat(raw) {
  const s = String(raw || '').trim().toLowerCase()
  for (const cat of FOLLOWUP_CATS) {
    if (cat.aliases.some((a) => a.toLowerCase() === s || s.includes(a.toLowerCase()))) return cat.key
  }
  return 'related'
}

export function parseFollowupItems(block) {
  const items = []
  const seen = new Set()
  for (const rawLine of String(block || '').replace(/:::\s*$/u, '').split(/\n/)) {
    let line = rawLine.replace(/^\s*[-*•]\s*/, '').replace(/^\s*\d+[.)、]\s*/, '').trim()
    if (!line || /^:::/u.test(line)) continue
    let key = 'related'
    let text = line
    const m = line.match(/^([^|｜]{1,16})\s*[|｜]\s*(.+)$/u)
    if (m) {
      key = normalizeFollowupCat(m[1])
      text = m[2].trim()
    }
    text = text.replace(/\s+/g, ' ').slice(0, 100)
    if (!text || text.length < 4) continue
    const dedupe = `${key}:${text}`
    if (seen.has(dedupe)) continue
    seen.add(dedupe)
    items.push({ key, text })
    if (items.length >= 6) break
  }
  const order = { western: 0, functional: 1, longevity: 2, tcm: 3, related: 4 }
  items.sort((a, b) => (order[a.key] ?? 9) - (order[b.key] ?? 9))
  return items
}

/** 兼容后端对象数组或旧的纯字符串列表 */
export function normalizeFollowups(raw) {
  if (!Array.isArray(raw) || !raw.length) return []
  if (typeof raw[0] === 'object' && raw[0]?.text) {
    const mapped = raw
      .map((row) => ({
        key: normalizeFollowupCat(row.key || row.label || 'related'),
        text: String(row.text || '').trim().slice(0, 100),
      }))
      .filter((row) => row.text.length >= 4)
      .slice(0, 6)
    const order = { western: 0, functional: 1, longevity: 2, tcm: 3, related: 4 }
    mapped.sort((a, b) => (order[a.key] ?? 9) - (order[b.key] ?? 9))
    return mapped
  }
  return parseFollowupItems(raw.join('\n'))
}
