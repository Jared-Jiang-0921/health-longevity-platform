import { useState } from 'react'
import ChatWindow from '../components/consult/ChatWindow'
import '../pages/Consult.css'

const COPY = {
  modeLabel: '咨询类型',
  composerModeNow: '当前模式',
  composerSourcesOff: '此模式不检索 PubMed、Cochrane、欧洲 PMC。',
  composerSourcesHere: '文献检索在输入框上方，默认关闭，可按需打开。',
  composerTcmSources: '中医咨询不检索 PubMed、Cochrane、欧洲 PMC。',
  composerUseProfessional: '切换到专业健康长寿',
  composerUseGeneral: '切换到自我健康促进',
  sessionGeneralNote: '这条历史属于自我健康促进，所以没有 PubMed、Cochrane、欧洲 PMC 开关。记录类型保持不变。',
  sessionProfessionalNote: '这条历史属于专业健康长寿。文献开关只对这一条记录有效，不会把其它历史改成专业咨询。',
  general: '自我健康促进',
  professional: '专业健康长寿',
  placeholder: '输入问题，也可上传检查单或点语音录音…',
  send: '发送',
  attach: '上传',
  speech: '语音',
  attachHint: '图片和 PDF 不限张数。此页是本地模拟，上传和发送都已停用。',
  empty: '向助手提问健康与长寿相关问题。回答仅供参考。',
  pubmed: '检索 PubMed',
  pubmedHint: '默认关闭',
  cochrane: '检索 Cochrane',
  cochraneHint: '默认关闭',
  europepmc: '检索欧洲 PMC',
  europepmcHint: '默认关闭',
  disclaimer: '本地模拟界面，不会发送到咨询接口。',
}

const LONG = '这是一条用于检查滚动的模拟回复。睡眠、步行和饮食记录只放在对话区里，输入框、当前模式和文献开关应留在下方，不应被顶出可视区域。'.repeat(4)

function copyFor(entry, sessionOpen) {
  const modeName = entry === 'professional' ? COPY.professional : COPY.general
  const sessionModeNote = !sessionOpen
    ? ''
    : entry === 'professional'
      ? COPY.sessionProfessionalNote
      : COPY.sessionGeneralNote
  return { ...COPY, modeName, sessionModeNote }
}

function seedMessages() {
  const rows = []
  for (let i = 0; i < 4; i += 1) {
    rows.push({ id: `q-${i}`, role: 'user', content: `模拟问题 ${i + 1}：如何安排一周的步行和睡眠？`, sources: [] })
    rows.push({ id: `a-${i}`, role: 'assistant', content: LONG, sources: [] })
  }
  return rows
}

function Panel({ title, initialEntry, initialSession }) {
  const [entry, setEntry] = useState(initialEntry)
  const [sessionOpen, setSessionOpen] = useState(initialSession)
  return (
    <section className="dev-consult-panel">
      <h2>{title}</h2>
      <ChatWindow
        previewLocked
        token=""
        lang="zh"
        entry={entry}
        rtl={false}
        copy={copyFor(entry, sessionOpen)}
        seedMessages={initialSession ? seedMessages() : []}
        initialDraft="模拟问题：每周步行多久比较合适？"
        onSelectEntry={(next) => {
          setEntry(next)
          setSessionOpen(false)
        }}
      />
    </section>
  )
}

/** 仅开发服务器挂载。生产包不应包含这段文案。 */
export default function DevConsultPreview() {
  return (
    <div className="page-content dev-consult-preview">
      <p className="dev-consult-banner" role="note">
        本地模拟界面，不是线上后端，也不会发送提问。没有登录，没有调用模型。上面演示打开一条普通历史后开关消失但记录类型不变；下面演示专业入口的三个文献开关，默认关闭。
      </p>
      <Panel title="已打开的普通咨询历史" initialEntry="general" initialSession />
      <Panel title="专业健康长寿入口" initialEntry="professional" initialSession={false} />
    </div>
  )
}
