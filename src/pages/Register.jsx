import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Register() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirm) return
    register(email, password, 'free')
    navigate('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t('register.title')}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <span>{t('register.email')}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </label>
          <label>
            <span>{t('register.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('register.passwordPlaceholder')}
              required
            />
          </label>
          <label>
            <span>{t('register.confirmPassword')}</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t('register.confirmPlaceholder')}
              required
            />
          </label>
          <p className="auth-note">{t('register.note')}</p>
          <button type="submit" className="btn-primary">{t('register.submit')}</button>
        </form>
        <p className="auth-switch">
          {t('register.hasAccount')}<Link to="/login">{t('nav.login')}</Link>
        </p>
      </div>
    </div>
  )
}
