import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState('standard')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password, level)
    navigate('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t('login.title')}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <span>{t('login.email')}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </label>
          <label>
            <span>{t('login.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              required
            />
          </label>
          <label>
            <span>{t('login.demoAs')}</span>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="free">{t('membership.free')}</option>
              <option value="standard">{t('membership.standard')}</option>
              <option value="premium">{t('membership.premium')}</option>
            </select>
          </label>
          <button type="submit" className="btn-primary">{t('login.submit')}</button>
        </form>
        <p className="auth-switch">
          {t('login.noAccount')}<Link to="/register">{t('nav.register')}</Link>
        </p>
      </div>
    </div>
  )
}
