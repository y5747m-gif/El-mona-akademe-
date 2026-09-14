import { createContext, useContext, useEffect, useState } from 'react'
import { getStudents, OWNER_CREDENTIALS, initStore } from '../data/store'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('elmona_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initStore()
  }, [])

  const login = (identifier, password, role) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (role === 'owner') {
          if (identifier === OWNER_CREDENTIALS.email && password === OWNER_CREDENTIALS.password) {
            const u = { ...OWNER_CREDENTIALS, id: 'OWNER-001' }
            localStorage.setItem('elmona_user', JSON.stringify(u))
            setUser(u)
            setLoading(false)
            resolve(u)
          } else {
            setLoading(false)
            reject('بيانات المالك غير صحيحة. جرب owner@elmona.com / owner123')
          }
        } else {
          const students = getStudents()
          const found = students.find(s =>
            (s.email === identifier || s.id === identifier || s.phone === identifier) && s.password === password
          )
          if (found) {
            const u = { ...found, role: 'student' }
            localStorage.setItem('elmona_user', JSON.stringify(u))
            setUser(u)
            setLoading(false)
            resolve(u)
          } else {
            setLoading(false)
            reject('بيانات الطالب غير صحيحة. تأكد من الكود/الإيميل وكلمة السر (الافتراضية 123456)')
          }
        }
      }, 700)
    })
  }

  const logout = () => {
    localStorage.removeItem('elmona_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isOwner: user?.role === 'owner', isStudent: user?.role === 'student' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
