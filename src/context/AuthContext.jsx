import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'health-platform-auth'

const AuthContext = createContext(null)

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveStored(data) {
  if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  else localStorage.removeItem(STORAGE_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStored)

  useEffect(() => {
    saveStored(user)
  }, [user])

  const login = (email, password, level = 'standard') => {
    setUser({ email, level, name: email.split('@')[0] })
  }

  const register = (email, password, level = 'free') => {
    setUser({ email, level, name: email.split('@')[0] })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
