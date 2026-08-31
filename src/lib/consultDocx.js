import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'

const THIN = { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' }
const BORDERS = { top: THIN, bottom: THIN, left: THIN, right: THIN }

function runsFrom(nodes, extra = {}) {
  const runs = []
  for (const n of nodes || []) {
    if (n.type === 'text') {
      runs.push(new TextRun({ text: n.value || '', ...extra }))
    } else if (n.type === 'strong') {
      runs.push(...runsFrom(n.children, { ...extra, bold: true }))
    } else if (n.type === 'emphasis') {
      runs.push(...runsFrom(n.children, { ...extra, italics: true }))
    } else if (n.type === 'delete') {
      runs.push(...runsFrom(n.children, { ...extra, strike: true }))
    } else if (n.type === 'inlineCode') {
      runs.push(new TextRun({ text: n.value || '', font: 'Consolas', ...extra }))
    } else if (n.type === 'break') {
      runs.push(new TextRun({ break: 1 }))
    } else if (n.type === 'link') {
      runs.push(...runsFrom(n.children, { ...extra, color: '1D4ED8' }))
      if (n.url) runs.push(new TextRun({ text: ` (${n.url})`, italics: true, color: '666666', size: 18 }))
    } else if (n.children) {
      runs.push(...runsFrom(n.children, extra))
    }
  }
  return runs
}

function paragraphFrom(node, opts = {}) {
  const runs = runsFrom(node.children)
  return new Paragraph({
    spacing: { after: 160 },
    ...opts,
    children: runs.length ? runs : [new TextRun('')],
  })
}

function listItems(node, ordered) {
  return (node.children || []).flatMap((item, i) => {
    const prefix = ordered ? `${i + 1}. ` : '• '
    const first = item.children?.[0]
    const rest = (item.children || []).slice(1)
    const blocks = []
    if (first?.type === 'paragraph') {
      blocks.push(new Paragraph({
        spacing: { after: 80 },
        indent: { left: 360 },
        children: [new TextRun(prefix), ...runsFrom(first.children)],
      }))
    } else {
      blocks.push(new Paragraph({
        spacing: { after: 80 },
        indent: { left: 360 },
        children: [new TextRun(prefix)],
      }))
    }
    for (const child of rest) {
      blocks.push(...blocksFrom(child))
    }
    return blocks
  })
}

function cellParagraphs(cell) {
  const kids = cell.children || []
  if (kids.some((c) => c.type === 'paragraph' || c.type === 'list' || c.type === 'table')) {
    const paras = kids.flatMap((child) => {
      if (child.type === 'paragraph') return [paragraphFrom(child, { spacing: { after: 40 } })]
      return blocksFrom(child)
    })
    return paras.length ? paras : [new Paragraph('')]
  }
  const runs = runsFrom(kids)
  return [new Paragraph({ children: runs.length ? runs : [new TextRun('')] })]
}

function tableFrom(node) {
  const rows = (node.children || []).map((row, rowIdx) => new TableRow({
    tableHeader: rowIdx === 0,
    children: (row.children || []).map((cell) => new TableCell({
      borders: BORDERS,
      width: { size: Math.round(9000 / Math.max(row.children.length, 1)), type: WidthType.DXA },
      shading: rowIdx === 0 ? { fill: 'EEF4FF' } : undefined,
      children: cellParagraphs(cell),
    })),
  }))
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: rows.length ? rows : [new TableRow({ children: [new TableCell({ children: [new Paragraph('')] })] })],
  })
}

function headingLevel(depth) {
  if (depth <= 1) return HeadingLevel.HEADING_1
  if (depth === 2) return HeadingLevel.HEADING_2
  return HeadingLevel.HEADING_3
}

function blocksFrom(node) {
  if (!node) return []
  if (node.type === 'root') return (node.children || []).flatMap(blocksFrom)
  if (node.type === 'paragraph') return [paragraphFrom(node)]
  if (node.type === 'heading') {
    return [paragraphFrom(node, { heading: headingLevel(node.depth || 2), spacing: { before: 240, after: 120 } })]
  }
  if (node.type === 'list') return listItems(node, Boolean(node.ordered))
  if (node.type === 'table') return [tableFrom(node), new Paragraph({ spacing: { after: 160 }, children: [] })]
  if (node.type === 'blockquote') return (node.children || []).flatMap(blocksFrom)
  if (node.type === 'code') {
    const lines = String(node.value || '').split('\n')
    return [new Paragraph({
      spacing: { after: 160 },
      shading: { fill: 'F4F4F5' },
      children: lines.flatMap((line, i) => {
        const run = new TextRun({ text: line, font: 'Consolas', size: 18 })
        return i < lines.length - 1 ? [run, new TextRun({ break: 1 })] : [run]
      }),
    })]
  }
  if (node.type === 'thematicBreak') {
    return [new Paragraph({ spacing: { before: 80, after: 80 }, border: { bottom: THIN }, children: [new TextRun('')] })]
  }
  if (node.children) return node.children.flatMap(blocksFrom)
  return []
}

function sourceLines(sources, heading) {
  const list = Array.isArray(sources) ? sources : []
  if (!list.length) return []
  const blocks = [new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 120 },
    children: [new TextRun(heading || '参考资料')],
  })]
  list.forEach((s, i) => {
    const title = s.title || s.source || s.book || `来源 ${i + 1}`
    const extra = [s.kind, s.journal, s.page ? `p.${s.page}` : '', s.url].filter(Boolean).join(' · ')
    blocks.push(new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: `[${i + 1}] ${title}`, bold: true }),
        extra ? new TextRun({ text: `  ${extra}`, color: '666666' }) : new TextRun(''),
      ],
    }))
  })
  return blocks
}

export async function buildConsultDocx({ markdown, sources, disclaimer, title, sourcesHeading, footer }) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(String(markdown || ''))
  const body = blocksFrom(tree)
  const children = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
      children: [new TextRun(title || 'AI 健康咨询')],
    }),
    disclaimer
      ? new Paragraph({
        spacing: { after: 280 },
        children: [new TextRun({ text: String(disclaimer).replace(/^⚠\s*/, ''), italics: true, color: '9A3412', size: 20 })],
      })
      : null,
    ...body,
    ...sourceLines(sources, sourcesHeading),
    new Paragraph({
      spacing: { before: 360 },
      alignment: AlignmentType.LEFT,
      children: [new TextRun({
        text: footer || '本文件由长健星图咨询导出，仅供参考，不能替代医生面诊。',
        color: '666666',
        size: 18,
      })],
    }),
  ].filter(Boolean)

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } },
      },
      children: children.length ? children : [new Paragraph('')],
    }],
  })
  return Packer.toBlob(doc)
}

export async function downloadConsultDocx(opts) {
  const blob = await buildConsultDocx(opts)
  const stamp = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const prefix = String(opts.filePrefix || '健康咨询').replace(/[\\/:*?"<>|]/g, '-')
  const name = `${prefix}-${stamp.getFullYear()}${pad(stamp.getMonth() + 1)}${pad(stamp.getDate())}-${pad(stamp.getHours())}${pad(stamp.getMinutes())}.docx`
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
