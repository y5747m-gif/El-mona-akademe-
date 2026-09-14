import { createContext, useContext, useEffect, useState } from 'react'
import { getStudents, OWNER_CREDENTIALS, initStore, addLoginLog, getWhatsAppLinksForStudent } from '../data/store'

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
            reject('بيانات الإدارة غير صحيحة. هذا الدخول محمي ومخصص للمالك فقط.')
          }
        } else {
          const students = getStudents()
          if (students.length === 0) {
            setLoading(false)
            reject('لا يوجد طلاب مسجلين بعد. تواصل مع إدارة الأكاديمية على 01140752330 أو 01061240956 للحصول على كود الدخول.')
            return
          }

          let found = null

          // الحالة الجديدة: تسجيل دخول بالاسم واسم ولي الأمر ورقم الهاتف (مثل نموذج التسجيل بالضبط)
          if (typeof identifier === 'object' && identifier !== null) {
            const { studentName, parentName, primaryPhone, secondaryPhone } = identifier
            const sName = (studentName || '').trim()
            const pName = (parentName || '').trim()
            const pPhone = (primaryPhone || '').trim()
            const sPhone = (secondaryPhone || '').trim()

            found = students.find(s => {
              const matchName = s.studentName ? s.studentName.trim() === sName : s.name.trim() === sName
              const matchParent = s.parentName ? s.parentName.trim() === pName : false
              const matchPhone = s.primaryPhone ? s.primaryPhone.trim() === pPhone : s.phone === pPhone
              // إذا كان رقم ولي الأمر موجود، نتأكد أيضاً (اختياري)
              const matchParentPhone = sPhone ? (s.secondaryPhone ? s.secondaryPhone.trim() === sPhone : true) : true
              return matchName && matchParent && matchPhone && matchParentPhone
            })
            // توافق خلفي: لو لم يوجد بالمطابقة الدقيقة، جرب مطابقة الاسم والهاتف فقط
            if (!found) {
              found = students.find(s => {
                const n = s.studentName || s.name
                const ph = s.primaryPhone || s.phone
                return n.trim() === sName && ph === pPhone
              })
            }
          } else {
            // الطريقة القديمة: كود/إيميل/هاتف + كلمة سر
            found = students.find(s =>
              (s.email === identifier || s.id === identifier || s.phone === identifier || s.primaryPhone === identifier || s.studentName === identifier) && s.password === password
            )
          }

          if (found) {
            const u = { ...found, role: 'student' }
            localStorage.setItem('elmona_user', JSON.stringify(u))
            setUser(u)

            const entry = {
              id: Date.now(),
              studentId: found.id,
              name: found.studentName || found.name,
              email: found.email,
              phone: found.primaryPhone || found.phone,
              level: found.grade || found.level,
              group: found.group,
              at: new Date().toISOString(),
            }
            addLoginLog(entry)

            try {
              const links = getWhatsAppLinksForStudent(found)
              localStorage.setItem('elmona_last_login_whatsapp', JSON.stringify({ student: found, links, at: entry.at }))
              setTimeout(() => {
                window.open(links.etisalat, '_blank')
              }, 400)
              setTimeout(() => {
                window.open(links.vodafone, '_blank')
              }, 900)
            } catch {}

            setLoading(false)
            resolve(u)
          } else {
            setLoading(false)
            if (typeof identifier === 'object') {
              reject('بيانات الطالب غير صحيحة. تأكد من كتابة اسم الطالب واسم ولي الأمر ورقم الهاتف مثل ما سجلت بالضبط. للمساعدة: 01140752330 / 01061240956')
            } else {
              reject('بيانات الطالب غير صحيحة. تأكد من الكود وكلمة السر المرسلة لك من الإدارة. للمساعدة: 01140752330 / 01061240956')
            }
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
