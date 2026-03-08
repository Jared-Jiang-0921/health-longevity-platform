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

  const levelName = required ? MEMBERSHIP_LEVELS[required]?.name : '登录'

  return (
    <div className="page-content">
      <h1>权限不足</h1>
      <p>
        {user
          ? `该模块需要「${levelName}」及以上等级。请升级会员后使用。`
          : `请先登录或注册后使用。部分模块需升级会员。`}
      </p>
      {!user ? (
        <p>
          <Link to="/login">登录</Link>
          {' · '}
          <Link to="/register">注册</Link>
        </p>
      ) : (
        <p><Link to="/">返回首页</Link></p>
      )}
    </div>
  )
}
