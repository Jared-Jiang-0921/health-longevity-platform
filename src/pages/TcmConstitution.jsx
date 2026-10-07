import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { CONSTITUTION_GROUPS } from '../data/tcmConstitutionSurvey'
import { TCM_CONSTITUTIONS } from '../data/tcmConstitutions'
import {
  TONGUE_COATINGS,
  TONGUE_COLORS,
  TONGUE_MARKS,
} from '../lib/tcmConstitution/score'
import {
  fetchTcmConstitution,
  saveTcmConstitution,
  suggestTongueFeatures,
} from '../lib/tcmConstitutionApi'
import './TcmConstitution.css'

const SCALE = [1, 2, 3, 4, 5]

const COPY = {
  zh: {
    back: '返回治未病',
    title: '初步体质辨识',
    lead: '标准会员及以上可以使用。问卷决定转化分。舌象只作对照，不改变分数。这不是当场辨证，不能作为用药依据。',
    redFlag: '现在是否有胸痛、呼吸困难、喉头发紧、一侧无力、言语不清、黑便或全身皮疹？',
    redFlagYes: '有，先去急诊',
    redFlagNo: '没有',
    redFlagStop: '这些是急症表现。请先联系急救或去急诊。这次不生成体质结果。',
    scale: ['没有', '很少', '有时', '经常', '总是'],
    consent: '我同意按健康数据告知保存这次自评结果。照片不会被保存。',
    tongueTitle: '舌象对照（可选）',
    tongueLead: '自然光下伸出舌头，关掉美颜。系统按望诊规范标出可见特征，你核对后才进入对照。对照只用体质标准里写明的舌象组合，不加分、不减分。',
    openCamera: '打开摄像头',
    choosePhoto: '选择照片',
    shoot: '拍摄',
    closeCamera: '关闭摄像头',
    cameraDenied: '没有打开摄像头。可以改用选择照片。',
    reading: '正在看照片…',
    confirmTongue: '我确认以上舌象特征，并知道它不改变问卷分数',
    skipTongue: '不做舌象对照',
    colors: { pale: '舌色淡', pink: '舌色淡红', red: '舌色红', dark: '舌色暗' },
    coatings: { 'thin-white': '薄白苔', 'white-greasy': '白腻苔', 'yellow-greasy': '黄腻苔', little: '少苔' },
    marks: { teeth: '齿痕', cracks: '裂纹', spots: '瘀点', plump: '舌体胖嫩' },
    cracksHint: '裂纹可以勾选，只作记录，不参与体质对照。这张舌面照片不判断舌下络脉。',
    tongueNotes: {
      'pale-without-plump': '只见舌色淡、未见胖嫩，不对照阳虚质。',
      'teeth-without-pink': '只见齿痕、舌色不是淡红，不对照气虚质。',
      'red-without-scanty': '只见舌红、未见少津，不对照阴虚质。',
      'yellow-without-red': '只见黄腻苔、舌质未见偏红，不对照湿热质。',
      'cracks-not-compared': '裂纹只作记录，不参与体质对照。',
      'pink-thin-white': '舌淡红、苔薄白，与平和质和气郁质的常见舌象描述相同。',
    },
    submit: '生成初步结果',
    submitting: '正在计算结果…',
    redo: '重新填写',
    saved: '结果已保存',
    primary: '问卷达到「是」',
    tendency: '问卷「倾向」',
    balanced: '平和质',
    none: '问卷里没有达到倾向的偏颇体质。',
    tongueResult: '舌象对照',
    aligned: '与问卷同向',
    divergent: '与问卷不一致',
    noTongue: '这次没有确认舌象，分数只来自问卷。',
    tongueNeutral: '已确认舌象，没有看到与偏颇体质对应的特征。',
    score: '转化分',
    judgment: { yes: '是', basic: '基本是', tendency: '倾向', no: '否' },
    cardLink: '查看调养要点',
    error: '暂时没有完成',
  },
  en: {
    back: 'Back to preventive TCM',
    title: 'Preliminary constitution check',
    lead: 'Available to Standard members and above. The questionnaire sets the score. The tongue photo is only a comparison and does not change it. This is not an in-person pattern diagnosis and cannot be used as a basis for taking medicine.',
    redFlag: 'Are you having chest pain, trouble breathing, throat tightness, one-sided weakness, trouble speaking, black stools, or a widespread rash right now?',
    redFlagYes: 'Yes — emergency care first',
    redFlagNo: 'No',
    redFlagStop: 'These are emergency symptoms. Contact emergency services. This check will not produce a constitution result.',
    scale: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    consent: 'I agree to store this self-check under the health-data notice. The photo is not stored.',
    tongueTitle: 'Tongue comparison (optional)',
    tongueLead: 'Use daylight, stick out your tongue, and turn off beauty filters. Suggestions follow inspection terms. They count only after you confirm them, and they do not change the score.',
    openCamera: 'Open camera',
    choosePhoto: 'Choose a photo',
    shoot: 'Capture',
    closeCamera: 'Close camera',
    cameraDenied: 'The camera did not open. You can choose a photo instead.',
    reading: 'Reading the photo…',
    confirmTongue: 'I confirm these tongue features, and I know they do not change the score',
    skipTongue: 'Skip tongue comparison',
    colors: { pale: 'Pale', pink: 'Pink-red', red: 'Red', dark: 'Dark' },
    coatings: { 'thin-white': 'Thin white coat', 'white-greasy': 'Greasy white coat', 'yellow-greasy': 'Greasy yellow coat', little: 'Little coating' },
    marks: { teeth: 'Teeth marks', cracks: 'Cracks', spots: 'Stasis spots', plump: 'Plump, tender body' },
    cracksHint: 'Cracks can be checked and are recorded only. They are not compared with a constitution type. This surface photo is not used for sublingual veins.',
    tongueNotes: {
      'pale-without-plump': 'Pale color without a plump body is not compared with yang deficiency.',
      'teeth-without-pink': 'Teeth marks without a pink-red tongue are not compared with qi deficiency.',
      'red-without-scanty': 'A red tongue without scant fluid is not compared with yin deficiency.',
      'yellow-without-red': 'A greasy yellow coat without a red tongue is not compared with damp-heat.',
      'cracks-not-compared': 'Cracks are recorded only and are not compared with a constitution type.',
      'pink-thin-white': 'A pink-red tongue with a thin white coat matches the usual description for balanced and qi-stagnation types.',
    },
    submit: 'Create preliminary result',
    submitting: 'Scoring…',
    redo: 'Start over',
    saved: 'Result saved',
    primary: 'Questionnaire: yes',
    tendency: 'Questionnaire: tendency',
    balanced: 'Balanced type',
    none: 'No biased type reached the tendency threshold.',
    tongueResult: 'Tongue comparison',
    aligned: 'Agrees with the questionnaire',
    divergent: 'Does not agree with the questionnaire',
    noTongue: 'No tongue features were confirmed. The score comes only from the questionnaire.',
    tongueNeutral: 'Tongue features were confirmed, with none linked to a biased type.',
    score: 'Converted score',
    judgment: { yes: 'Yes', basic: 'Basically yes', tendency: 'Tendency', no: 'No' },
    cardLink: 'Care notes',
    error: 'Could not finish',
  },
  ar: {
    back: 'العودة للوقاية',
    title: 'تمييز أولي لنمط الجسم',
    lead: 'متاح للعضوية القياسية فما فوق. الاستبيان يحدد الدرجة. صورة اللسان للمقارنة فقط ولا تغيّر الدرجة. هذا ليس تشخيصاً حضورياً ولا يصلح أساساً لتناول دواء.',
    redFlag: 'هل لديك الآن ألم صدر أو صعوبة تنفس أو ضيق حلق أو ضعف أحد الجانبين أو اضطراب كلام أو براز أسود أو طفح منتشر؟',
    redFlagYes: 'نعم — الطوارئ أولاً',
    redFlagNo: 'لا',
    redFlagStop: 'هذه أعراض طارئة. تواصل مع الطوارئ. لن نُنتج نتيجة نمط.',
    scale: ['أبداً', 'نادراً', 'أحياناً', 'غالباً', 'دائماً'],
    consent: 'أوافق على حفظ هذا التقييم وفق إشعار البيانات الصحية. لن تُحفظ الصورة.',
    tongueTitle: 'مقارنة اللسان (اختيارية)',
    tongueLead: 'في ضوء النهار، أخرج اللسان وأوقف مرشحات التجميل. الاقتراح يتبع مصطلحات المعاينة، ويُعتمد بعد تأكيدك فقط، ولا يغيّر الدرجة.',
    openCamera: 'فتح الكاميرا',
    choosePhoto: 'اختيار صورة',
    shoot: 'التقاط',
    closeCamera: 'إغلاق الكاميرا',
    cameraDenied: 'لم تُفتح الكاميرا. يمكنك اختيار صورة بدلاً من ذلك.',
    reading: 'جارٍ قراءة الصورة…',
    confirmTongue: 'أؤكد سمات اللسان هذه، وأعلم أنها لا تغيّر الدرجة',
    skipTongue: 'تجاوز مقارنة اللسان',
    colors: { pale: 'باهت', pink: 'وردي', red: 'أحمر', dark: 'داكن' },
    coatings: { 'thin-white': 'طبقة بيضاء رقيقة', 'white-greasy': 'طبقة بيضاء دهنية', 'yellow-greasy': 'طبقة صفراء دهنية', little: 'طبقة قليلة' },
    marks: { teeth: 'آثار أسنان', cracks: 'شقوق', spots: 'نقاط ركود', plump: 'جسم ممتلئ وناعم' },
    cracksHint: 'يمكن تحديد الشقوق للتسجيل فقط، دون مقارنتها بنمط. صورة سطح اللسان لا تُستخدم لأوردة أسفل اللسان.',
    tongueNotes: {
      'pale-without-plump': 'اللون الباهت دون جسم ممتلئ لا يُقارن بنقص اليانغ.',
      'teeth-without-pink': 'آثار الأسنان دون لسان وردي لا تُقارن بنقص التشي.',
      'red-without-scanty': 'اللسان الأحمر دون قلة الرطوبة لا يُقارن بنقص الين.',
      'yellow-without-red': 'الطبقة الصفراء الدهنية دون لسان أحمر لا تُقارن بالرطوبة الحارة.',
      'cracks-not-compared': 'الشقوق للتسجيل فقط ولا تُقارن بنمط.',
      'pink-thin-white': 'اللسان الوردي مع طبقة بيضاء رقيقة يوافق الوصف المعتاد للنمط المتوازن وركود التشي.',
    },
    submit: 'إنشاء النتيجة الأولية',
    submitting: 'جارٍ الحساب…',
    redo: 'إعادة',
    saved: 'تم الحفظ',
    primary: 'الاستبيان: نعم',
    tendency: 'الاستبيان: ميل',
    balanced: 'النمط المتوازن',
    none: 'لم يبلغ أي نمط منحرف حد الميل.',
    tongueResult: 'مقارنة اللسان',
    aligned: 'يتفق مع الاستبيان',
    divergent: 'لا يتفق مع الاستبيان',
    noTongue: 'لم تُؤكد سمات اللسان. الدرجة من الاستبيان فقط.',
    tongueNeutral: 'تم تأكيد اللسان دون سمات مرتبطة بنمط منحرف.',
    score: 'الدرجة المحوّلة',
    judgment: { yes: 'نعم', basic: 'نعم إلى حد كبير', tendency: 'ميل', no: 'لا' },
    cardLink: 'ملاحظات العناية',
    error: 'تعذر الإكمال',
  },
}

function textOf(field, lang) {
  if (!field) return ''
  if (lang === 'en' || lang === 'ar') return field[lang] || field.zh
  return field.zh
}

function typeName(id, lang) {
  const row = TCM_CONSTITUTIONS.find((item) => item.id === id)
  return row ? textOf(row.name, lang) : id
}

async function compressImage(file) {
  const bitmap = await createImageBitmap(file)
  const max = 960
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsDataURL(blob)
  })
  const data = dataUrl.split(',')[1] || ''
  return { mediaType: 'image/jpeg', data, preview: dataUrl }
}

export default function TcmConstitution() {
  const { lang } = useLocale()
  const { getToken } = useAuth()
  const t = COPY[lang] || COPY.zh
  const [answers, setAnswers] = useState({})
  const [redFlagNow, setRedFlagNow] = useState(null)
  const [consent, setConsent] = useState(false)
  const [tongueOn, setTongueOn] = useState(false)
  const [tongueConfirmed, setTongueConfirmed] = useState(false)
  const [tongueColor, setTongueColor] = useState('')
  const [coating, setCoating] = useState('')
  const [marks, setMarks] = useState([])
  const [preview, setPreview] = useState('')
  const [tongueNote, setTongueNote] = useState('')
  const [readingPhoto, setReadingPhoto] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(null)
  const [cameraOn, setCameraOn] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    fetchTcmConstitution(token)
      .then((data) => {
        if (data.latest?.result) setSaved(data.latest)
      })
      .catch(() => {})
  }, [getToken])

  const names = useMemo(() => Object.fromEntries(
    TCM_CONSTITUTIONS.map((item) => [item.id, textOf(item.name, lang)]),
  ), [lang])

  function setAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function toggleMark(mark) {
    setTongueConfirmed(false)
    setMarks((prev) => (prev.includes(mark) ? prev.filter((item) => item !== mark) : [...prev, mark]))
  }

  function stopCamera() {
    const stream = streamRef.current
    streamRef.current = null
    stream?.getTracks().forEach((track) => track.stop())
    setCameraOn(false)
  }

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const stream = streamRef.current
    if (!cameraOn || !video || !stream) return undefined
    video.srcObject = stream
    video.play().catch(() => {})
    return undefined
  }, [cameraOn])

  async function useImageFile(file) {
    if (!file) return
    setError('')
    setTongueConfirmed(false)
    setReadingPhoto(true)
    try {
      const image = await compressImage(file)
      setPreview(image.preview)
      setTongueOn(true)
      const token = getToken()
      const suggested = await suggestTongueFeatures(token, { mediaType: image.mediaType, data: image.data })
      setTongueColor(suggested.features?.tongueColor || '')
      setCoating(suggested.features?.coating || '')
      setMarks(suggested.features?.marks || [])
      setTongueNote(suggested.note || '')
    } catch (err) {
      setError(err.message || t.error)
    } finally {
      setReadingPhoto(false)
    }
  }

  function onPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) useImageFile(file)
  }

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t.cameraDenied)
      return
    }
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' } },
      })
      streamRef.current = stream
      setCameraOn(true)
    } catch {
      setError(t.cameraDenied)
    }
  }

  async function shoot() {
    const video = videoRef.current
    if (!video) return
    if (!video.videoWidth) {
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve()
      })
    }
    if (!video.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    stopCamera()
    if (blob) useImageFile(new File([blob], 'tongue.jpg', { type: 'image/jpeg' }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    if (redFlagNow === true) return
    const token = getToken()
    const tongue = tongueOn && tongueConfirmed
      ? { tongueColor, coating, marks, confirmed: true }
      : null
    setBusy(true)
    try {
      const data = await saveTcmConstitution(token, {
        consentHealthData: consent,
        redFlagNow: false,
        answers,
        tongue,
      })
      setSaved({ result: data.result, summary: data.summary, createdAt: data.createdAt })
    } catch (err) {
      setError(err.message || t.error)
    } finally {
      setBusy(false)
    }
  }

  const result = saved?.result

  return (
    <div className="page-tcm-constitution page-content">
      <p><Link to="/tcm-prevention" className="back-link">{t.back}</Link></p>
      <h1>{t.title}</h1>
      <p className="tcm-const-lead">{t.lead}</p>

      {result ? (
        <section className="tcm-const-result content-card content-card--padded">
          <p className="tcm-const-saved">{t.saved}</p>
          <h2>{t.balanced}：{t.judgment[result.balanced] || result.balanced}</h2>
          <h2>{t.primary}</h2>
          {result.primary?.length ? (
            <ul>{result.primary.map((id) => <li key={id}>{names[id] || typeName(id, lang)}</li>)}</ul>
          ) : <p>{t.none}</p>}
          {result.tendencies?.length ? (
            <>
              <h2>{t.tendency}</h2>
              <ul>{result.tendencies.map((id) => <li key={id}>{names[id] || typeName(id, lang)}</li>)}</ul>
            </>
          ) : null}
          <ul className="tcm-const-scores">
            {(result.types || []).map((row) => (
              <li key={row.id}>
                <Link to="/tcm-prevention">{names[row.id] || row.id}</Link>
                {' '}{t.score} {row.score} · {t.judgment[row.judgment] || row.judgment}
              </li>
            ))}
          </ul>
          <h2>{t.tongueResult}</h2>
          {!result.tongue ? <p>{t.noTongue}</p> : (
            <>
              {result.tongue.aligned?.length ? (
                <p>{t.aligned}：{result.tongue.aligned.map((id) => names[id] || id).join('、')}</p>
              ) : null}
              {result.tongue.divergent?.length ? (
                <p>{t.divergent}：{result.tongue.divergent.map((id) => names[id] || id).join('、')}</p>
              ) : null}
              {!result.tongue.aligned?.length && !result.tongue.divergent?.length && !result.tongue.notes?.length ? <p>{t.tongueNeutral}</p> : null}
              {(result.tongue.notes || []).map((code) => (
                t.tongueNotes[code] ? <p key={code}>{t.tongueNotes[code]}</p> : null
              ))}
            </>
          )}
          <p>{saved.summary}</p>
          <button type="button" className="btn-primary" onClick={() => setSaved(null)}>{t.redo}</button>
        </section>
      ) : (
        <form className="tcm-const-form" onSubmit={onSubmit}>
          <fieldset className="content-card content-card--padded">
            <legend>{t.redFlag}</legend>
            <label><input type="radio" name="red-flag" checked={redFlagNow === true} onChange={() => setRedFlagNow(true)} /> {t.redFlagYes}</label>
            <label><input type="radio" name="red-flag" checked={redFlagNow === false} onChange={() => setRedFlagNow(false)} /> {t.redFlagNo}</label>
          </fieldset>
          {redFlagNow === true ? <p className="tcm-const-stop" role="alert">{t.redFlagStop}</p> : null}

          {redFlagNow === false && CONSTITUTION_GROUPS.map((group) => (
            <fieldset key={group.id} className="content-card content-card--padded">
              <legend>{names[group.id] || group.id}</legend>
              {group.items.map((question) => (
                <div key={question.id} className="tcm-const-q">
                  <p>{textOf(question.text, lang)}</p>
                  <div className="tcm-const-scale" role="radiogroup">
                    {SCALE.map((value, index) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name={question.id}
                          value={value}
                          checked={answers[question.id] === value}
                          onChange={() => setAnswer(question.id, value)}
                          required
                        />
                        <span>{t.scale[index]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </fieldset>
          ))}

          {redFlagNow === false ? (
            <fieldset className="content-card content-card--padded">
              <legend>{t.tongueTitle}</legend>
              <p>{t.tongueLead}</p>
              <div className="tcm-const-photo-actions">
                <button type="button" className="btn-primary" onClick={openCamera} disabled={readingPhoto || cameraOn}>{t.openCamera}</button>
                <label className="btn-primary tcm-const-file">
                  {readingPhoto ? t.reading : t.choosePhoto}
                  <input type="file" accept="image/*" onChange={onPhoto} disabled={readingPhoto} />
                </label>
              </div>
              {cameraOn ? (
                <div className="tcm-const-camera-wrap">
                  <video ref={videoRef} className="tcm-const-camera" autoPlay playsInline muted />
                  <div className="tcm-const-photo-actions">
                    <button type="button" className="btn-primary" onClick={shoot}>{t.shoot}</button>
                    <button type="button" onClick={stopCamera}>{t.closeCamera}</button>
                  </div>
                </div>
              ) : null}
              {preview ? <img className="tcm-const-preview" src={preview} alt="" /> : null}
              {tongueNote ? <p>{tongueNote}</p> : null}
              {tongueOn ? (
                <>
                  <div className="tcm-const-choices">
                    {TONGUE_COLORS.map((id) => (
                      <label key={id}>
                        <input type="radio" name="tongue-color" checked={tongueColor === id} onChange={() => { setTongueColor(id); setTongueConfirmed(false) }} />
                        {t.colors[id]}
                      </label>
                    ))}
                  </div>
                  <div className="tcm-const-choices">
                    {TONGUE_COATINGS.map((id) => (
                      <label key={id}>
                        <input type="radio" name="tongue-coating" checked={coating === id} onChange={() => { setCoating(id); setTongueConfirmed(false) }} />
                        {t.coatings[id]}
                      </label>
                    ))}
                  </div>
                  <div className="tcm-const-choices">
                    {TONGUE_MARKS.map((id) => (
                      <label key={id}>
                        <input type="checkbox" checked={marks.includes(id)} onChange={() => toggleMark(id)} />
                        {t.marks[id]}
                      </label>
                    ))}
                  </div>
                  <p className="tcm-const-hint">{t.cracksHint}</p>
                  <label>
                    <input type="checkbox" checked={tongueConfirmed} onChange={(e) => setTongueConfirmed(e.target.checked)} />
                    {t.confirmTongue}
                  </label>
                </>
              ) : null}
            </fieldset>
          ) : null}

          {redFlagNow === false ? (
            <>
              <label className="tcm-const-consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                {t.consent}
              </label>
              {error ? <p className="tcm-const-stop" role="alert">{error}</p> : null}
              <button type="submit" className="btn-primary" disabled={busy}>{busy ? t.submitting : t.submit}</button>
            </>
          ) : null}
        </form>
      )}
    </div>
  )
}
