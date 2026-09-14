import { useEffect, useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Search, Trash2, Edit3, Radio, Video, Square, Crown, GraduationCap, BookOpen, TrendingUp, Bell, Shield, LogOut, Eye, EyeOff, Filter, Download, Award, Clock, MessageCircle, Send, Check, X, AlertTriangle, Sparkles, Phone, MessageCircleMore, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getStudents, saveStudents, getLive, saveLive, getCourses, getAnnouncements, saveAnnouncements, OWNER_CREDENTIALS, CONTACT_NUMBERS, getLoginLogs, getWhatsAppLinksForStudent, buildStudentLoginMessage } from '../data/store'
import { Link } from 'react-router-dom'

export default function OwnerDashboard() {
  const { user, logout } = useAuth()
  const [students, setStudents] = useState(getStudents())
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('الكل')
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [live, setLive] = useState(getLive())
  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({ name: '', email: '', phone: '', level: 'الثانوية العامة', group: 'المجموعة A - فيزياء', password: '123456' })
  const [loginLogs, setLoginLogs] = useState(getLoginLogs())

  useEffect(() => {
    const onUpdate = () => { setStudents(getStudents()); setLive(getLive()); setLoginLogs(getLoginLogs()) }
    window.addEventListener('students-updated', onUpdate)
    window.addEventListener('live-updated', onUpdate)
    const i = setInterval(() => { setLive(getLive()); setLoginLogs(getLoginLogs()) }, 1500)
    return () => { window.removeEventListener('students-updated', onUpdate); window.removeEventListener('live-updated', onUpdate); clearInterval(i) }
  }, [])

  // Live viewers simulation
  useEffect(() => {
    if (!live.isLive) return
    const id = setInterval(() => {
      const cur = getLive()
      if (cur.isLive) {
        const delta = Math.floor(Math.random() * 7) - 3
        const next = Math.max(10, cur.viewers + delta)
        saveLive({ ...cur, viewers: next })
        setLive({ ...cur, viewers: next })
      }
    }, 3000)
    return () => clearInterval(id)
  }, [live.isLive])

  const filtered = useMemo(() => {
    let arr = [...students]
    if (query) {
      const q = query.toLowerCase()
      arr = arr.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.phone.includes(q))
    }
    if (filter !== 'الكل') arr = arr.filter(s => s.group.includes(filter) || s.status === filter || s.level === filter)
    return arr
  }, [students, query, filter])

  const stats = useMemo(() => {
    const active = students.filter(s => s.status === 'نشط').length
    const avgAtt = Math.round(students.reduce((a, b) => a + (b.attendance || 0), 0) / (students.length || 1))
    return { total: students.length, active, avgAtt, courses: getCourses().length }
  }, [students])

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) return alert('أكمل البيانات الأساسية')
    if (editing) {
      const updated = students.map(s => s.id === editing.id ? { ...s, ...form } : s)
      saveStudents(updated); setStudents(updated); setEditing(null); setShowAdd(false)
    } else {
      const id = `STU-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`
      const newStudent = { id, ...form, avatar: form.name.slice(0, 2), status: 'نشط', joinDate: new Date().toISOString().slice(0, 10), attendance: Math.floor(85 + Math.random() * 15), avg: Math.floor(70 + Math.random() * 25) }
      const updated = [newStudent, ...students]
      saveStudents(updated); setStudents(updated); setShowAdd(false)
    }
    setForm({ name: '', email: '', phone: '', level: 'الثانوية العامة', group: 'المجموعة A - فيزياء', password: '123456' })
  }

  const handleDelete = (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع.')) return
    const updated = students.filter(s => s.id !== id)
    saveStudents(updated); setStudents(updated)
  }

  const startLive = async () => {
    const title = prompt('عنوان البث المباشر:', 'فيزياء - المراجعة النهائية (البث المباشر)')
    if (title === null) return
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(media)
      if (videoRef.current) videoRef.current.srcObject = media
    } catch {
      alert('تم بدء البث بدون كاميرا (تجريبي). سيظهر للطلاب أن البث مباشر.')
    }
    const payload = { isLive: true, title: title || 'بث مباشر', startedAt: new Date().toISOString(), viewers: Math.floor(80 + Math.random() * 40), chat: live.chat || [] }
    saveLive(payload); setLive(payload)
  }

  const stopLive = () => {
    if (stream) stream.getTracks().forEach(t => t.stop())
    setStream(null)
    const payload = { isLive: false, title: '', startedAt: null, viewers: 0, chat: live.chat || [] }
    saveLive(payload); setLive(payload)
  }

  const sendChat = (e) => {
    e.preventDefault()
    if (!chatMsg.trim()) return
    const nextChat = [...(live.chat || []), { id: Date.now(), from: 'المالك', text: chatMsg, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]
    const payload = { ...live, chat: nextChat.slice(-50) }
    saveLive(payload); setLive(payload); setChatMsg('')
  }

  const addAnnouncement = (e) => {
    e.preventDefault()
    if (!annTitle || !annContent) return alert('أكمل عنوان ومحتوى الإعلان')
    const list = getAnnouncements()
    const next = [{ id: Date.now(), title: annTitle, content: annContent, date: new Date().toISOString().slice(0, 10), important: true }, ...list]
    saveAnnouncements(next); setAnnTitle(''); setAnnContent(''); alert('تم نشر الإعلان للطلاب ✅')
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] pt-[88px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B2447] to-[#19376D] flex items-center justify-center text-white shadow-lg">
              <Crown className="w-7 h-7 text-[#FDE68A]" />
            </div>
            <div className="text-right">
              <h1 className="font-black text-xl sm:text-2xl text-[#0B2447] flex items-center gap-2">
                لوحة تحكم المالك
                <span className="bg-[#C5A253] text-white text-xs font-black px-2.5 py-1 rounded-full">OWNER</span>
              </h1>
              <p className="text-sm font-bold text-[#64748B]">إدارة الطلاب • البث المباشر • الإعلانات • التقارير</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-full px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A253] to-[#D4AF37] flex items-center justify-center text-white font-black text-xs">
                {user?.name?.slice(0, 2)}
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-[#0B2447] leading-none">{user?.name}</div>
                <div className="text-[11px] font-bold text-[#64748B]">{user?.email}</div>
              </div>
            </div>
            <Link to="/" className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC] text-[#64748B]">
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* أرقام التواصل */}
        <div className="mt-6 bg-white rounded-[20px] border border-[#E2E8F0] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircleMore className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="font-black text-[#0B2447]">أرقام التواصل — للشكاوى والاستفسارات</div>
                <div className="text-xs font-bold text-[#64748B]">بيانات دخول الطلاب تُرسل تلقائياً لهذين الرقمين على واتساب</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`tel:+${CONTACT_NUMBERS.etisalat.raw}`} className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#0B2447] to-[#19376D] text-white px-5 py-3 rounded-full font-black text-sm hover:scale-[1.02] transition">
                <Phone className="w-4 h-4" />
                <span dir="ltr">{CONTACT_NUMBERS.etisalat.display}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">اتصالات</span>
              </a>
              <a href={`tel:+${CONTACT_NUMBERS.vodafone.raw}`} className="flex items-center justify-center gap-2 bg-white border-2 border-[#E2E8F0] text-[#0B2447] px-5 py-3 rounded-full font-black text-sm hover:bg-[#F8FAFC] transition">
                <Phone className="w-4 h-4" />
                <span dir="ltr">{CONTACT_NUMBERS.vodafone.display}</span>
                <span className="bg-[#F1F5F9] px-2 py-0.5 rounded-full text-xs">فودافون</span>
              </a>
              <a href={`https://wa.me/${CONTACT_NUMBERS.etisalat.raw}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-black text-sm hover:bg-[#128C7E] transition">
                <MessageCircle className="w-4 h-4" />
                واتساب
              </a>
            </div>
          </div>
        </div>

        {/* سجل دخول الطلاب */}
        <div className="mt-6 bg-gradient-to-br from-[#0B2447] to-[#19376D] rounded-[24px] p-5 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-black flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center"><Smartphone className="w-4 h-4" /></span>
                سجل دخول الطلاب — يُرسل تلقائياً لواتساب
                <span className="bg-[#C5A253] text-white text-xs px-2.5 py-1 rounded-full">{loginLogs.length}</span>
              </h3>
              {loginLogs.length > 0 && (
                <button onClick={() => { if(confirm('مسح سجل الدخول؟')){ localStorage.setItem('elmona_login_logs', JSON.stringify([])); setLoginLogs([]) } }} className="text-xs font-black bg-white/15 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/20 transition">مسح السجل</button>
              )}
            </div>
            {loginLogs.length === 0 ? (
              <div className="mt-4 bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-6 text-center">
                <Clock className="w-8 h-8 text-white/60 mx-auto" />
                <div className="font-black mt-2">لا يوجد تسجيل دخول بعد</div>
                <div className="text-white/60 text-xs font-bold mt-1">عندما يسجل أي طالب دخوله، ستصلك بياناته كاملة فوراً على واتساب الرقمين + واتسجل هنا</div>
              </div>
            ) : (
              <div className="mt-4 space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {loginLogs.slice(0, 20).map(log => {
                  const student = { id: log.studentId, name: log.name, email: log.email, phone: log.phone, level: log.level, group: log.group, status: 'نشط', attendance: 0, avg: 0 }
                  const links = getWhatsAppLinksForStudent(student)
                  return (
                    <div key={log.id} className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-right">
                        <div className="font-black text-sm text-[#0B2447]">{log.name} • <span className="text-[#C5A253]">{log.studentId}</span></div>
                        <div className="text-xs font-bold text-[#64748B]">{log.group} • {log.phone} • {log.email}</div>
                        <div className="text-[11px] font-bold text-[#94A3B8] mt-1">{new Date(log.at).toLocaleString('ar-EG')}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a href={links.etisalat} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-[#25D366] text-white px-3 py-2 rounded-full text-xs font-black hover:bg-[#128C7E] transition">
                          <MessageCircle className="w-3.5 h-3.5" />
                          واتساب اتصالات
                        </a>
                        <a href={links.vodafone} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-[#0B2447] text-white px-3 py-2 rounded-full text-xs font-black hover:bg-[#19376D] transition">
                          <MessageCircle className="w-3.5 h-3.5" />
                          فودافون
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-3 text-[11px] font-bold text-white/60">يتم الإرسال التلقائي عند كل تسجيل دخول طالب — إذا حجب المتصفح النوافذ، استخدم أزرار إعادة الإرسال أعلاه</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {[
            { k: stats.total, l: 'إجمالي الطلاب', sub: `${stats.active} نشط`, icon: Users, grad: 'from-[#0B2447] to-[#19376D]' },
            { k: `${stats.avgAtt}%`, l: 'متوسط الحضور', sub: 'هذا الشهر', icon: TrendingUp, grad: 'from-[#059669] to-[#10B981]' },
            { k: stats.courses, l: 'الكورسات', sub: 'نشطة الآن', icon: BookOpen, grad: 'from-[#C5A253] to-[#D4AF37]' },
            { k: live.isLive ? `${live.viewers}` : '—', l: 'مشاهدو البث', sub: live.isLive ? 'مباشر الآن' : 'لا يوجد بث', icon: Radio, grad: live.isLive ? 'from-red-600 to-red-500' : 'from-[#64748B] to-[#94A3B8]' },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-[20px] border border-[#E2E8F0] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-3 sm:gap-4">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white shadow-md`}>
                <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-right">
                <div className="font-black text-xl sm:text-2xl leading-none text-[#0B2447]">{s.k}</div>
                <div className="font-black text-xs sm:text-sm text-[#0B2447]">{s.l}</div>
                <div className="text-[11px] font-bold text-[#64748B]">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.7fr_0.9fr] gap-6 mt-6">
          {/* Students */}
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-black text-lg text-[#0B2447] flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#0B2447] text-white flex items-center justify-center"><Users className="w-4 h-4" /></span>
                  إدارة الطلاب
                  <span className="bg-[#F1F5F9] text-[#475569] text-xs font-black px-2.5 py-1 rounded-full">{filtered.length} / {students.length}</span>
                </h2>
                <button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', level: 'الثانوية العامة', group: 'المجموعة A - فيزياء', password: '123456' }); setShowAdd(true) }} className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#0B2447] to-[#19376D] text-white px-5 py-3 rounded-full font-black text-sm shadow-[0_8px_20px_rgba(11,36,71,0.25)] hover:shadow-[0_12px_28px_rgba(11,36,71,0.3)] hover:scale-[1.02] transition">
                  <UserPlus className="w-4 h-4" />
                  إضافة طالب
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <div className="flex-1 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث بالاسم، الكود، الإيميل، الهاتف..." className="w-full pr-10 pl-4 py-3 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] focus:ring-4 focus:ring-[#0B2447]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8]" />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {['الكل', 'المجموعة A', 'المجموعة B', 'نشط', 'موقوف'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-full text-xs font-black whitespace-nowrap border transition ${filter === f ? 'bg-[#0B2447] text-white border-[#0B2447]' : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#64748B]">
                <Filter className="w-3.5 h-3.5" />
                اضغط على <Edit3 className="w-3 h-3 inline" /> للتعديل و <Trash2 className="w-3 h-3 inline" /> للحذف • كلمة السر الافتراضية 123456
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-xs font-black text-[#64748B]">
                    <th className="text-right px-4 py-3">الطالب</th>
                    <th className="text-right px-4 py-3">الكود / التواصل</th>
                    <th className="text-right px-4 py-3">المجموعة</th>
                    <th className="text-center px-4 py-3">الحالة</th>
                    <th className="text-center px-4 py-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/70 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2447] to-[#19376D] flex items-center justify-center text-white font-black text-sm">
                            {s.avatar}
                          </div>
                          <div className="text-right">
                            <div className="font-black text-sm text-[#0B2447] leading-tight">{s.name}</div>
                            <div className="text-xs font-bold text-[#64748B]">{s.level} • انضم {s.joinDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-black text-[#0B2447]">{s.id}</div>
                        <div className="text-xs font-bold text-[#64748B]">{s.email}</div>
                        <div className="text-xs font-bold text-[#64748B]">{s.phone} • {s.password}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs font-black px-2.5 py-1 rounded-full">
                          <GraduationCap className="w-3 h-3" />
                          {s.group}
                        </span>
                        <div className="text-[11px] font-bold text-[#64748B] mt-1 flex items-center gap-2">
                          <span className="flex items-center gap-1"><Award className="w-3 h-3" />{s.avg}%</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.attendance}% حضور</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-black px-3 py-1 rounded-full border ${s.status === 'نشط' ? 'bg-[#F0FDF4] text-[#059669] border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{s.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => { setEditing(s); setForm({ name: s.name, email: s.email, phone: s.phone, level: s.level, group: s.group, password: s.password }); setShowAdd(true) }}
                            className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0B2447] hover:bg-[#0B2447] hover:text-white transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-red-600 hover:text-white hover:border-red-600 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-10 text-sm font-bold text-[#94A3B8]">لا يوجد طلاب يطابقون البحث</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#64748B]">إجمالي {students.length} طالب • يتم الحفظ تلقائياً في المتصفح</span>
              <button onClick={() => { const blob = new Blob([JSON.stringify(students, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'students.json'; a.click() }} className="inline-flex items-center gap-1.5 text-xs font-black bg-white border border-[#E2E8F0] px-3 py-2 rounded-full hover:bg-[#0B2447] hover:text-white hover:border-[#0B2447] transition">
                <Download className="w-3.5 h-3.5" />
                تصدير البيانات
              </button>
            </div>
          </div>

          {/* Live & Announcements */}
          <div className="space-y-6">
            {/* Live Control */}
            <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-5">
                <h3 className="font-black text-[#0B2447] flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${live.isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                    <Radio className="w-4 h-4" />
                  </span>
                  التحكم في البث المباشر
                  {live.isLive && <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full animate-pulse">LIVE • {live.viewers}</span>}
                </h3>

                <div className="mt-4 rounded-2xl overflow-hidden bg-[#0B2447] aspect-[16/10] relative">
                  <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${live.isLive ? 'block' : 'hidden'}`} />
                  {!live.isLive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white">
                        <Video className="w-7 h-7" />
                      </div>
                      <div className="font-black text-white mt-3">البث متوقف</div>
                      <div className="text-white/60 text-xs font-bold mt-1">اضغط بدء البث ليظهر للطلاب فوراً</div>
                    </div>
                  )}
                  {live.isLive && (
                    <>
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        مباشر • {live.viewers} مشاهد
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                        {live.title}
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {!live.isLive ? (
                    <button onClick={startLive} className="col-span-2 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-br from-red-600 to-red-500 text-white font-black shadow-[0_8px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_12px_28px_rgba(220,38,38,0.4)] hover:scale-[1.01] transition">
                      <Radio className="w-5 h-5" />
                      بدء البث المباشر
                    </button>
                  ) : (
                    <>
                      <button onClick={stopLive} className="inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#0B2447] text-white font-black hover:bg-black transition">
                        <Square className="w-4 h-4 fill-white" />
                        إنهاء البث
                      </button>
                      <Link to="/live" className="inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white border border-[#E2E8F0] font-black hover:bg-[#F8FAFC] transition">
                        <Eye className="w-4 h-4" />
                        معاينة كطالب
                      </Link>
                    </>
                  )}
                </div>

                <div className="mt-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-3">
                  <div className="text-xs font-black text-[#0B2447] flex items-center gap-1.5 mb-2">
                    <MessageCircle className="w-4 h-4" />
                    شات البث (يظهر للطلاب فوراً)
                  </div>
                  <div className="h-[140px] overflow-y-auto bg-white rounded-xl border border-[#E2E8F0] p-3 space-y-2">
                    {(live.chat || []).length === 0 ? (
                      <div className="text-center py-6 text-xs font-bold text-[#94A3B8]">لا توجد رسائل بعد — ابدأ الترحيب بالطلاب</div>
                    ) : (
                      (live.chat || []).slice(-20).map(m => (
                        <div key={m.id} className="flex gap-2">
                          <span className="text-[11px] font-black text-[#0B2447] whitespace-nowrap">{m.from}:</span>
                          <span className="text-xs font-bold text-[#475569]">{m.text}</span>
                          <span className="text-[10px] text-[#94A3B8] mr-auto">{m.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={sendChat} className="flex gap-2 mt-3">
                    <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="اكتب رسالة للطلاب..." className="flex-1 px-4 py-2.5 rounded-full bg-white border border-[#E2E8F0] text-sm font-bold focus:border-[#0B2447] focus:ring-4 focus:ring-[#0B2447]/10 outline-none" />
                    <button type="submit" className="w-10 h-10 rounded-full bg-[#0B2447] text-white flex items-center justify-center hover:bg-[#19376D] transition">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5">
              <h3 className="font-black text-[#0B2447] flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#FFF7ED] border border-orange-200 flex items-center justify-center text-[#EA580C]"><Bell className="w-4 h-4" /></span>
                نشر إعلان للطلاب
              </h3>
              <form onSubmit={addAnnouncement} className="mt-4 space-y-3">
                <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="عنوان الإعلان" className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] outline-none text-sm font-bold" />
                <textarea value={annContent} onChange={e => setAnnContent(e.target.value)} placeholder="محتوى الإعلان..." rows={3} className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] outline-none text-sm font-bold resize-none" />
                <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-br from-[#C5A253] to-[#D4AF37] text-white font-black hover:shadow-lg transition flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  نشر الإعلان
                </button>
              </form>

              <div className="mt-6">
                <div className="text-xs font-black text-[#64748B] mb-2">آخر الإعلانات</div>
                <div className="space-y-2 max-h-[180px] overflow-y-auto">
                  {getAnnouncements().map(a => (
                    <div key={a.id} className="bg-[#F8FAFC] rounded-xl p-3 border border-[#F1F5F9]">
                      <div className="font-black text-xs text-[#0B2447]">{a.title}</div>
                      <div className="text-xs font-bold text-[#64748B] mt-1 leading-relaxed line-clamp-2">{a.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-gradient-to-br from-[#0B2447] to-[#19376D] rounded-[24px] p-5 text-white relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="font-black flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#FDE68A]" />
                  نصائح سريعة
                </div>
                <ul className="mt-3 space-y-2 text-xs font-bold text-white/80 list-disc pr-4 leading-relaxed">
                  <li>يمكنك إضافة عدد لا نهائي من الطلاب وحذفهم في أي وقت.</li>
                  <li>البث المباشر يظهر فوراً لكل الطلاب المسجلين.</li>
                  <li>كلمة السر الافتراضية 123456 ويمكن للطالب تغييرها لاحقاً.</li>
                </ul>
                <Link to="/live" className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white text-[#0B2447] font-black hover:bg-[#FFFBEB] transition">
                  <Video className="w-4 h-4" />
                  فتح صفحة البث
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setShowAdd(false)} className="absolute inset-0 bg-[#0B2447]/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.96, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 20, opacity: 0 }} className="relative w-full max-w-[560px] bg-white rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.3)] overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2447] to-[#19376D] flex items-center justify-center text-white">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#0B2447]">{editing ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</div>
                    <div className="text-xs font-bold text-[#64748B]">سيتمكن الطالب من الدخول فوراً</div>
                  </div>
                </div>
                <button onClick={() => setShowAdd(false)} className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#0B2447] mb-2">اسم الطالب الكامل</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: أحمد محمد السيد" className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] outline-none text-sm font-bold" required />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#0B2447] mb-2">الإيميل</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="student@elmona.edu" className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] outline-none text-sm font-bold" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#0B2447] mb-2">رقم الهاتف</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="01012345678" className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] outline-none text-sm font-bold" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#0B2447] mb-2">المرحلة</label>
                    <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] outline-none text-sm font-bold">
                      <option>الصف الأول الثانوي</option>
                      <option>الصف الثاني الثانوي</option>
                      <option>الصف الثالث الثانوي</option>
                      <option>الثانوية العامة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#0B2447] mb-2">المجموعة</label>
                    <select value={form.group} onChange={e => setForm({ ...form, group: e.target.value })} className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] outline-none text-sm font-bold">
                      <option>المجموعة A - فيزياء</option>
                      <option>المجموعة B - كيمياء</option>
                      <option>المجموعة C - أحياء</option>
                      <option>المجموعة D - رياضيات</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0B2447] mb-2">كلمة السر</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] outline-none text-sm font-bold pl-11" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-[11px] font-bold text-[#64748B] mt-1.5">سيستخدمها الطالب لتسجيل الدخول مع الإيميل أو الكود</div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3.5 rounded-full bg-[#F1F5F9] font-black hover:bg-[#E2E8F0] transition">إلغاء</button>
                  <button type="submit" className="flex-[1.4] py-3.5 rounded-full bg-gradient-to-br from-[#0B2447] to-[#19376D] text-white font-black shadow-[0_8px_20px_rgba(11,36,71,0.25)] hover:shadow-[0_12px_28px_rgba(11,36,71,0.3)] transition flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    {editing ? 'حفظ التعديلات' : 'إضافة الطالب'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
