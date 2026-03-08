import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
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
        <h1>会员登录</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <span>邮箱</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </label>
          <label>
            <span>密码</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </label>
          <label>
            <span>登录为（演示）</span>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="free">免费会员</option>
              <option value="standard">标准会员</option>
              <option value="premium">高级会员</option>
            </select>
          </label>
          <button type="submit" className="btn-primary">登录</button>
        </form>
        <p className="auth-switch">
          还没有账号？<Link to="/register">注册</Link>
        </p>
      </div>
    </div>
  )
}
