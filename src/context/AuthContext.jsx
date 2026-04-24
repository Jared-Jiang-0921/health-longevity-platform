import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'health-platform-token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  /** unauthorized：应清 token；error：网络/5xx，保留 token 与当前 user，避免误清空已登录态 */
  const fetchUser = useCallback(async (token) => {
    if (!token) return { user: null, status: 'no_token' }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        return { user: null, status: 'unauthorized' }
      }
      if (!res.ok) {
        return { user: null, status: 'error' }
      }
      const { user } = await res.json()
      return { user, status: 'ok' }
    } catch {
      return { user: null, status: 'error' }
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    fetchUser(token).then(({ user, status }) => {
      if (status === 'unauthorized') {
        localStorage.removeItem(STORAGE_KEY)
        setUser(null)
      } else if (user) {
        setUser(user)
      }
      setLoading(false)
    })
  }, [fetchUser])

  async function parseJsonRes(res) {
    const text = await res.text()
    const trimmed = text.trim()
    const status = res.status
    if (!trimmed) {
      throw new Error(
        `服务器返回空响应（HTTP ${status}）。请确认本机 API 进程已运行，且 Nginx 将 /api 反代到 Node（如 127.0.0.1:3000）。可在服务器执行 curl -sS http://127.0.0.1:3000/api/health`,
      )
    }
    try {
      return JSON.parse(trimmed)
    } catch {
      const looksLikeHtml = trimmed.startsWith('<!') || trimmed.startsWith('<html')
      const detail = looksLikeHtml
        ? '当前返回了 HTML 页面（常见于 /api 被当成静态页、未反代、或 502/504 错误页），请检查 Nginx 的 location /api/ 与 healthlongevity-api 服务。'
        : '响应体不是合法 JSON。'
      throw new Error(`服务器返回异常（HTTP ${status}）。${detail}`)
    }
  }

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await parseJsonRes(res)
      if (!res.ok) throw new Error(data.error || '登录失败')
      if (data.requires2fa && data.preAuthToken) {
        return { ok: true, requires2fa: true, preAuthToken: data.preAuthToken }
      }
      localStorage.setItem(STORAGE_KEY, data.token)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  const login2fa = async (preAuthToken, code) => {
    try {
      const res = await fetch('/api/auth/login-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preAuthToken, code }),
      })
      const data = await parseJsonRes(res)
      if (!res.ok) throw new Error(data.error || '验证失败')
      localStorage.setItem(STORAGE_KEY, data.token)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  const register = async (email, password, name) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || email?.split('@')[0] }),
      })
      const data = await parseJsonRes(res)
      if (!res.ok) throw new Error(data.error || '注册失败')
      localStorage.setItem(STORAGE_KEY, data.token)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const getToken = () => localStorage.getItem(STORAGE_KEY)

  const refreshUser = async () => {
    const token = getToken()
    const { user, status } = await fetchUser(token)
    if (status === 'unauthorized') {
      localStorage.removeItem(STORAGE_KEY)
      setUser(null)
      return
    }
    if (user) setUser(user)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, login2fa, register, logout, getToken, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
