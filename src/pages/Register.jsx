import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, GraduationCap, MessageCircle, Phone } from 'lucide-react'
import { getStudents, saveStudents, CONTACT_NUMBERS, buildStudentLoginMessage } from '../data/store'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    studentName: '',
    studentAge: '',
    gender: '',
    grade: '',
    parentName: '',
    primaryPhone: '',
    secondaryPhone: '',
    relationship: '',
    governorate: '',
    region: '',
    address: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [createdStudent, setCreatedStudent] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.studentName.trim()) return setError('من فضلك اكتب اسم الطالب بالكامل')
    if (!form.studentAge.trim()) return setError('من فضلك اكتب عمر الطالب')
    if (!form.gender) return setError('من فضلك اختر النوع')
    if (!form.grade.trim()) return setError('من فضلك اكتب الصف الدراسي')
    if (!form.parentName.trim()) return setError('من فضلك اكتب اسم ولي الأمر')
    if (!form.primaryPhone.trim() || !/^01\d{9}$/.test(form.primaryPhone.trim())) return setError('رقم الهاتف الأساسي غير صحيح — يجب أن يبدأ بـ 01 ويتكون من 11 رقم')
    if (!form.relationship) return setError('من فضلك اختر صلة القرابة')
    if (!form.governorate.trim()) return setError('من فضلك اكتب المحافظة')
    if (!form.region.trim()) return setError('من فضلك اكتب المنطقة / المركز')
    if (!form.address.trim()) return setError('من فضلك اكتب العنوان بالتفصيل')

    const students = getStudents()
    // تحقق من التكرار بالهاتف أو الاسم + ولي الأمر
    const exists = students.find(s => s.primaryPhone === form.primaryPhone || (s.studentName === form.studentName && s.parentName === form.parentName))
    if (exists) return setError('هذا الطالب مسجل بالفعل بنفس الاسم أو رقم الهاتف. إذا نسيت بيانات الدخول تواصل على ' + CONTACT_NUMBERS.etisalat.display)

    const id = `STU-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`
    const newStudent = {
      id,
      // للتوافق مع النظام القديم
      name: form.studentName.trim(),
      email: `${form.primaryPhone}@student.elmona`,
      phone: form.primaryPhone.trim(),
      password: form.primaryPhone.trim(), // كلمة السر هي رقم الهاتف الأساسي
      avatar: form.studentName.trim().slice(0, 2),
      status: 'نشط',
      joinDate: new Date().toISOString().slice(0, 10),
      attendance: 100,
      avg: 0,
      level: form.grade.trim(),
      group: form.grade.trim(),
      // الحقول الجديدة المطابقة للصورة
      studentName: form.studentName.trim(),
      studentAge: form.studentAge.trim(),
      gender: form.gender,
      grade: form.grade.trim(),
      parentName: form.parentName.trim(),
      primaryPhone: form.primaryPhone.trim(),
      secondaryPhone: form.secondaryPhone.trim(),
      relationship: form.relationship,
      governorate: form.governorate.trim(),
      region: form.region.trim(),
      address: form.address.trim(),
    }

    const updated = [newStudent, ...students]
    saveStudents(updated)

    // إرسال البيانات كاملة لواتساب الإدارة
    try {
      const now = new Date().toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })
      const msg = `🔔 *تسجيل طالب جديد - أكاديمية المنى*\n━━━━━━━━━━━━━━━\n👤 *اسم الطالب:* ${newStudent.studentName}\n🎂 *العمر:* ${newStudent.studentAge}\n⚧ *النوع:* ${newStudent.gender}\n🎓 *الصف الدراسي:* ${newStudent.grade}\n\n👨‍👩‍👧 *بيانات ولي الأمر:*\n• الاسم: ${newStudent.parentName}\n• الهاتف الأساسي: ${newStudent.primaryPhone}\n• الهاتف الإضافي: ${newStudent.secondaryPhone || '—'}\n• صلة القرابة: ${newStudent.relationship}\n\n🏠 *بيانات السكن:*\n• المحافظة: ${newStudent.governorate}\n• المنطقة/المركز: ${newStudent.region}\n• العنوان: ${newStudent.address}\n\n🆔 *الكود:* ${newStudent.id}\n🕐 *وقت التسجيل:* ${now}\n━━━━━━━━━━━━━━━\nتم التسجيل عبر نموذج الموقع.`
      const enc = encodeURIComponent(msg)
      localStorage.setItem('elmona_last_register_whatsapp', JSON.stringify({ student: newStudent, at: new Date().toISOString() }))
      setTimeout(() => window.open(`https://wa.me/${CONTACT_NUMBERS.etisalat.raw}?text=${enc}`, '_blank'), 400)
      setTimeout(() => window.open(`https://wa.me/${CONTACT_NUMBERS.vodafone.raw}?text=${enc}`, '_blank'), 900)
    } catch {}

    setCreatedStudent(newStudent)
    setSuccess(true)
    setTimeout(() => {
      // navigate('/login')
    }, 2000)
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-white border border-[#E5E9E7] focus:bg-white focus:border-[#14332B] focus:ring-4 focus:ring-[#14332B]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8] transition"
  const labelClass = "block text-xs font-black text-[#14332B] mb-2 pr-1"
  const sectionTitleClass = "font-black text-[15px] text-[#14332B] flex items-center gap-2"
  const badgeClass = "w-7 h-7 rounded-full bg-[#E6F0EA] text-[#14332B] flex items-center justify-center text-[11px] font-black"

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F8F6]">
      {/* Top nav مطابق للصورة */}
      <header className="bg-white border-b border-[#E5E9E7] sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between gap-4">
          <Link to="/login?role=owner&key=elmona2026" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#14332B] text-white text-xs font-black hover:bg-[#1a4a3a] transition">
            دخول المالك
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/#contact" className="text-xs font-bold text-[#6B7C75] hover:text-[#14332B] transition">تواصل معنا</a>
            <a href="/#about" className="text-xs font-bold text-[#6B7C75] hover:text-[#14332B] transition">عن الأكاديمية</a>
            <Link to="/register" className="text-xs font-black text-[#14332B] border-b-2 border-[#14332B] pb-1">تسجيل الطالب</Link>
            <Link to="/" className="text-xs font-bold text-[#6B7C75] hover:text-[#14332B] transition">الرئيسية</Link>
          </nav>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <div className="font-black text-[15px] leading-none text-[#14332B]">أكاديمية المنى</div>
              <div className="text-[11px] font-bold text-[#6B7C75]">EL-MONA AKADEME</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#14332B] flex items-center justify-center text-white shadow-md">
              <span className="font-black text-lg">م</span>
            </div>
          </Link>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] border border-[#E5E9E7] shadow-[0_8px_32px_rgba(20,51,43,0.06)] overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {/* 01 بيانات الطالب */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={badgeClass}>01</span>
                    <h2 className={sectionTitleClass}>بيانات الطالب</h2>
                  </div>
                  <span className="text-[11px] font-bold text-[#94A3B8] hidden sm:inline">الحقول المميزة بـ * مطلوبة</span>
                </div>
                <div className="h-[1px] bg-[#E5E9E7] mt-4 mb-6" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>اسم الطالب بالكامل *</label>
                    <input name="studentName" value={form.studentName} onChange={handleChange} placeholder="اكتب اسم الطالب بالكامل" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>عمر الطالب *</label>
                    <input name="studentAge" value={form.studentAge} onChange={handleChange} placeholder="العمر" type="number" min="5" max="25" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>النوع *</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                      <option value="">اختر النوع</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>الصف الدراسي *</label>
                    <input name="grade" value={form.grade} onChange={handleChange} placeholder="مثال: الصف السادس" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* 02 بيانات ولي الأمر */}
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <span className={badgeClass}>02</span>
                  <h2 className={sectionTitleClass}>بيانات ولي الأمر</h2>
                </div>
                <div className="h-[1px] bg-[#E5E9E7] mt-4 mb-6" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>اسم ولي الأمر *</label>
                    <input name="parentName" value={form.parentName} onChange={handleChange} placeholder="اسم ولي الأمر" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>رقم الهاتف الأساسي *</label>
                    <input name="primaryPhone" value={form.primaryPhone} onChange={handleChange} placeholder="01xxxxxxxxx" dir="ltr" className={inputClass + " text-left"} style={{ direction: 'ltr' }} />
                  </div>

                  <div>
                    <label className={labelClass}>رقم إضافي <span className="font-bold text-[#94A3B8] text-[11px]">(اختياري)</span></label>
                    <input name="secondaryPhone" value={form.secondaryPhone} onChange={handleChange} placeholder="01xxxxxxxxx" dir="ltr" className={inputClass + " text-left"} style={{ direction: 'ltr' }} />
                  </div>
                  <div>
                    <label className={labelClass}>صلة القرابة *</label>
                    <select name="relationship" value={form.relationship} onChange={handleChange} className={inputClass}>
                      <option value="">اختر صلة القرابة</option>
                      <option value="الأب">الأب</option>
                      <option value="الأم">الأم</option>
                      <option value="الأخ">الأخ</option>
                      <option value="الأخت">الأخت</option>
                      <option value="العم">العم</option>
                      <option value="الخال">الخال</option>
                      <option value="الجد">الجد</option>
                      <option value="ولي أمر">ولي أمر</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 03 بيانات السكن */}
              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <span className={badgeClass}>03</span>
                  <h2 className={sectionTitleClass}>بيانات السكن</h2>
                </div>
                <div className="h-[1px] bg-[#E5E9E7] mt-4 mb-6" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>المحافظة *</label>
                    <input name="governorate" value={form.governorate} onChange={handleChange} placeholder="مثال: القاهرة" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>المنطقة / المركز *</label>
                    <input name="region" value={form.region} onChange={handleChange} placeholder="اسم المنطقة أو المركز" className={inputClass} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>العنوان بالتفصيل *</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="الشارع - رقم المنزل - تفاصيل إضافية" className={inputClass} />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-bold">
                  {error}
                </div>
              )}

              {success && createdStudent && (
                <div className="mt-6 bg-[#F0FDF4] border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 font-black text-[#065F46]">
                    <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
                    تم تسجيل الطالب بنجاح ✅
                  </div>
                  <div className="text-xs font-bold text-[#047857] mt-2 leading-relaxed">
                    الكود الخاص بك: <span className="font-black bg-white border border-green-200 px-2 py-0.5 rounded-full">{createdStudent.id}</span> — كلمة السر هي رقم هاتفك الأساسي.<br />
                    سيتم إرسال بياناتك تلقائياً لواتساب الإدارة على الرقمين. يمكنك الآن تسجيل الدخول باسمك واسم ولي الأمر ورقم الهاتف.
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link to="/login" className="inline-flex items-center gap-2 bg-[#14332B] text-white px-5 py-2.5 rounded-full text-xs font-black hover:bg-[#1a4a3a] transition">
                      الذهاب لتسجيل الدخول
                    </Link>
                    <a href={`https://wa.me/${CONTACT_NUMBERS.etisalat.raw}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-xs font-black hover:bg-[#128C7E] transition">
                      <MessageCircle className="w-4 h-4" />
                      تواصل واتساب
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={success}
                className="w-full mt-8 py-4 rounded-full bg-[#14332B] text-white font-black text-[15px] hover:bg-[#1a4a3a] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(20,51,43,0.2)] transition"
              >
                {success ? 'تم التسجيل بنجاح' : 'تسجيل الطالب'}
              </button>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs font-bold text-[#6B7C75]">
                <span>لديك حساب بالفعل؟</span>
                <Link to="/login" className="font-black text-[#14332B] hover:underline">تسجيل الدخول</Link>
                <span className="mx-1">•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{CONTACT_NUMBERS.etisalat.display}</span>
                </span>
              </div>
            </form>
          </motion.div>

          {/* Right sidebar - مطابق للصورة */}
          <div className="bg-[#14332B] rounded-[24px] p-6 sm:p-8 text-white relative overflow-hidden order-first lg:order-last">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-white/[0.02] rounded-full blur-3xl" />

            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center">
                <span className="font-black text-2xl">م</span>
              </div>
              <h3 className="font-black text-xl mt-4">أكاديمية المنى</h3>
              <p className="text-white/60 text-xs font-bold mt-1">العلم طريق النجاح</p>

              <div className="w-12 h-[2px] bg-white/15 mx-auto mt-6 mb-6" />

              <h4 className="font-black text-lg leading-tight">أهلاً بك في أكاديمية المنى</h4>
              <p className="text-white/60 text-xs font-bold leading-7 mt-3">
                يسعدنا انضمام طالب جديد إلى أكاديميتنا. يرجى كتابة البيانات المطلوبة بدقة حتى نستطيع التواصل مع ولي الأمر.
              </p>

              <div className="mt-8 space-y-4 text-right">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/15 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div>
                    <div className="font-black text-sm">تسجيل سهل</div>
                    <div className="text-white/50 text-xs font-bold leading-relaxed">عملية التسجيل بسيطة وسريعة</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/15 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div>
                    <div className="font-black text-sm">بيانات منظمة</div>
                    <div className="text-white/50 text-xs font-bold leading-relaxed">يتم حفظ بيانات الطالب بشكل منظم</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/15 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div>
                    <div className="font-black text-sm">تواصل مباشر</div>
                    <div className="text-white/50 text-xs font-bold leading-relaxed">إرسال بيانات الطلب مباشرة إلى الإدارة</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
