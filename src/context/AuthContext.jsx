import { createContext, useContext, useEffect, useState } from 'react'
import { getStudents, OWNER_CREDENTIALS, initStore, addLoginLog, buildStudentLoginMessage, getWhatsAppLinksForStudent } from '../data/store'

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
          const found = students.find(s =>
            (s.email === identifier || s.id === identifier || s.phone === identifier) && s.password === password
          )
          if (found) {
            const u = { ...found, role: 'student' }
            localStorage.setItem('elmona_user', JSON.stringify(u))
            setUser(u)

            // حفظ سجل الدخول + إرسال البيانات كاملة لرقم الإدارة عبر واتساب
            const entry = {
              id: Date.now(),
              studentId: found.id,
              name: found.name,
              email: found.email,
              phone: found.phone,
              level: found.level,
              group: found.group,
              at: new Date().toISOString(),
            }
            addLoginLog(entry)

            // إرسال تلقائي لواتساب الإدارة (نفتح في الخلفية + نحفظ للمالك)
            try {
              const links = getWhatsAppLinksForStudent(found)
              // نفتح واتساب اتصالات ثم فودافون بتأخير بسيط — مع منع البوب أب بلوك عبر تأخير
              // نحفظ أيضاً في localStorage ليظهر في لوحة المالك
              localStorage.setItem('elmona_last_login_whatsapp', JSON.stringify({ student: found, links, at: entry.at }))
              // محاولة فتح تلقائي (قد يُحجب، لذا نعرض أيضاً زر في لوحة الطالب)
              setTimeout(() => {
                // نستخدم window.open في سياق تفاعل المستخدم (الضغط على تسجيل دخول) لذا سيُسمح في معظم المتصفحات
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
            reject('بيانات الطالب غير صحيحة. تأكد من الكود وكلمة السر المرسلة لك من الإدارة. للمساعدة: 01140752330 / 01061240956')
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
