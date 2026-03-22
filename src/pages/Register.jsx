import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!emailOk(email)) {
      setError('请输入有效邮箱，例如：name@example.com')
      return
    }
    if (!password || password.length < 6) {
      setError('密码至少 6 位')
      return
    }
    if (password !== confirm) {
      setError('两次密码不一致')
      return
    }
    setSubmitting(true)
    const { ok, error: err } = await register(email, password, name || undefined)
    setSubmitting(false)
    if (ok) {
      navigate('/')
    } else {
      setError(err || '注册失败')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>会员注册</h1>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            <span>邮箱</span>
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </label>
          <label>
            <span>昵称（可选）</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="显示名称"
            />
          </label>
          <label>
            <span>密码</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </label>
          <label>
            <span>确认密码</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="再次输入密码"
            />
          </label>
          <p className="auth-note">注册即成为普通会员，可体验部分模块。</p>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? '注册中…' : '注册'}
          </button>
        </form>
        <p className="auth-switch">
          已有账号？<Link to="/login">登录</Link>
        </p>
      </div>
    </div>
  )
}
