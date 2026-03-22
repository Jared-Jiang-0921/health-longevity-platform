import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canAccess, getRequiredLevel, MEMBERSHIP_LEVELS } from '../data/membership'

export default function ProtectedModule({ children }) {
  const location = useLocation()
  const { user } = useAuth()
  const path = location.pathname
  const allowed = canAccess(path, user?.level)
  const required = getRequiredLevel(path)

  if (allowed) return children

  if (!user) {
    return (
      <div className="page-content page-register-required">
        <h1>需要注册为会员才能查看</h1>
        <p>请先注册或登录后访问该模块内容。</p>
        <p className="register-actions">
          <Link to="/register" className="btn-primary">注册</Link>
          <span className="action-sep"> </span>
          <Link to="/login">登录</Link>
        </p>
        <p><Link to="/" className="back-link">返回首页</Link></p>
      </div>
    )
  }

  const levelName = required ? MEMBERSHIP_LEVELS[required]?.name : '登录'
  return (
    <div className="page-content">
      <h1>权限不足</h1>
      <p>该模块需要「{levelName}」及以上等级。请升级会员后使用。</p>
      <p><Link to="/payment">升级会员</Link></p>
      <p><Link to="/">返回首页</Link></p>
    </div>
  )
}
