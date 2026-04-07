import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './CookieConsentBanner.css'

const STORAGE_KEY = 'hl_cookie_consent_v1'

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (show) document.body.classList.add('cookie-banner-visible')
    else document.body.classList.remove('cookie-banner-visible')
    return () => document.body.classList.remove('cookie-banner-visible')
  }, [show])

  const save = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie notice">
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          We use strictly necessary storage (e.g. login session) and remember your choice here. See{' '}
          <Link to="/legal/cookies?lang=en">Cookie Notice</Link> and{' '}
          <Link to="/privacy?lang=en">Privacy Policy</Link>.
          <span className="cookie-banner-zh">
            我们使用必要存储（如登录会话）并记录您的选择。详见《
            <Link to="/legal/cookies?lang=zh">Cookie 说明</Link>》与《
            <Link to="/privacy?lang=zh">隐私政策</Link>》。
          </span>
        </p>
        <div className="cookie-banner-actions">
          <button type="button" className="cookie-banner-btn primary" onClick={() => save('all')}>
            Accept all
          </button>
          <button type="button" className="cookie-banner-btn" onClick={() => save('essential')}>
            Essential only
          </button>
        </div>
      </div>
    </div>
  )
}
