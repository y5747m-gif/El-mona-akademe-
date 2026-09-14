import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Eye, EyeOff, ArrowRight, Shield, Sparkles, Users, Radio, BookOpen, Lock, Crown, Phone, MessageCircle, User, UsersRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CONTACT_NUMBERS } from '../data/store'

export default function Login() {
  const [search] = useSearchParams()
  const isOwnerAccess = search.get('role') === 'owner' && search.get('key') === 'elmona2026'
  const initialRole = isOwnerAccess ? 'owner' : 'student'
  const [role, setRole] = useState(initialRole)

  // owner fields
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // student fields - مثل نموذج التسجيل بالضبط
  const [studentName, setStudentName] = useState('')
  const [parentName, setParentName] = useState('')
  const [primaryPhone, setPrimaryPhone] = useState('')
  const [secondaryPhone, setSecondaryPhone] = useState('')

  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (role === 'owner') {
      if (!identifier || !password) { setError('من فضلك أكمل جميع الحقول'); return }
      try {
        const u = await login(identifier.trim(), password, 'owner')
        if (u.role === 'owner') navigate('/owner')
      } catch (err) { setError(err) }
    } else {
      // تسجيل دخول الطالب باسم الطالب واسم ولي الأمر ورقمي الهاتف - مثل ما سجل بالضبط
      if (!studentName.trim() || !parentName.trim() || !primaryPhone.trim()) {
        setError('من فضلك اكتب اسم الطالب واسم ولي الأمر ورقم الهاتف الأساسي مثل ما سجلت بالضبط')
        return
      }
      if (!/^01\d{9}$/.test(primaryPhone.trim())) {
        setError('رقم الهاتف الأساسي غير صحيح — يجب أن يكون 11 رقم ويبدأ بـ 01')
        return
      }
      try {
        const details = {
          studentName: studentName.trim(),
          parentName: parentName.trim(),
          primaryPhone: primaryPhone.trim(),
          secondaryPhone: secondaryPhone.trim(),
        }
        const u = await login(details, '', 'student')
        navigate('/student')
      } catch (err) { setError(err) }
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] flex">
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="px-6 sm:px-8 py-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-[#0B2447] hover:gap-3 transition-all">
            <span className="w-8 h-8 rounded-full bg-[#0B2447] text-white flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
            العودة للرئيسية
          </Link>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2447] to-[#19376D] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-[#0B2447] hidden sm:inline">أكاديمية المنى</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[520px]"
          >
            {!isOwnerAccess ? (
              <div className="bg-[#EDEEF3] rounded-full p-1.5 flex gap-1.5 mb-6 shadow-inner opacity-60">
                <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-[#0B2447] font-black text-sm">
                  <GraduationCap className="w-4 h-4" />
                  دخول الطلاب
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[#94A3B8] font-bold text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  دخول محمي
                </div>
              </div>
            ) : (
              <div className="bg-[#0B2447] rounded-full p-1.5 flex gap-1.5 mb-6 shadow-inner">
                <button
                  onClick={() => { setRole('student'); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-black text-sm transition-all ${role === 'student' ? 'bg-white text-[#0B2447]' : 'text-white/70 hover:text-white'}`}
                >
                  <GraduationCap className="w-4 h-4" />
                  طالب
                </button>
                <button
                  onClick={() => { setRole('owner'); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-black text-sm transition-all ${role === 'owner' ? 'bg-[#C5A253] text-white shadow-lg' : 'text-white/70 hover:text-white'}`}
                >
                  <Crown className="w-4 h-4" />
                  المالك
                </button>
              </div>
            )}

            <div className="bg-white rounded-[28px] shadow-[0_16px_48px_rgba(11,36,71,0.10)] border border-[#E2E8F0] overflow-hidden">
              <div className="px-6 sm:px-8 pt-7 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-right">
                    <h1 className="font-black text-[22px] sm:text-[24px] leading-none text-[#0B2447] flex items-center gap-2">
                      {role === 'owner' ? 'دخول الإدارة' : 'تسجيل دخول الطالب'}
                      <Sparkles className="w-5 h-5 text-[#C5A253]" />
                    </h1>
                    <p className="text-sm font-bold text-[#64748B] mt-2">
                      {role === 'owner' ? 'واجهة محمية — للمالك فقط' : 'ادخل باسمك واسم ولي الأمر ورقم الهاتف مثل ما سجلت بالضبط'}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${role === 'owner' ? 'bg-gradient-to-br from-[#C5A253] to-[#D4AF37] text-white' : 'bg-[#14332B] text-white'}`}>
                    {role === 'owner' ? <Shield className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {role === 'owner' ? (
                    <motion.form
                      key="owner"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onSubmit={handleSubmit}
                      className="mt-6 space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-black text-[#0B2447] mb-2 pr-1">اسم المستخدم</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 right-3 flex items-center text-[#94A3B8]"><User className="w-4 h-4" /></span>
                          <input value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="اسم المستخدم الخاص بالمالك" className="w-full pr-10 pl-4 py-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] focus:ring-4 focus:ring-[#0B2447]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8] transition" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-[#0B2447] mb-2 pr-1">كلمة السر</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 right-3 flex items-center text-[#94A3B8]"><Lock className="w-4 h-4" /></span>
                          <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pr-10 pl-11 py-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] focus:ring-4 focus:ring-[#0B2447]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8] transition" />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 left-3 flex items-center text-[#94A3B8] hover:text-[#0B2447]">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                        </div>
                      </div>
                      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-bold">{error}</motion.div>}
                      <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-br from-[#0B2447] to-[#19376D] text-white font-black text-[15px] shadow-[0_12px_28px_rgba(11,36,71,0.3)] hover:shadow-[0_16px_36px_rgba(11,36,71,0.4)] disabled:opacity-60 transition-all btn-shimmer">
                        {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري الدخول...</> : <>تسجيل الدخول <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight className="w-4 h-4 rotate-180" /></span></>}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="student"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onSubmit={handleSubmit}
                      className="mt-6 space-y-4"
                    >
                      <div className="bg-[#14332B] text-white rounded-xl px-4 py-3 flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><BookOpen className="w-4 h-4" /></div>
                        <div className="text-right">
                          <div className="text-xs font-black">ادخل مثل ما سجلت بالضبط</div>
                          <div className="text-[11px] font-bold text-white/70 leading-relaxed">اكتب اسم الطالب واسم ولي الأمر ورقمي الهاتف كما سجلت في نموذج التسجيل — مطابقة حرفية.</div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-black text-[#14332B] mb-2 pr-1">اسم الطالب بالكامل *</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 right-3 flex items-center text-[#94A3B8]"><User className="w-4 h-4" /></span>
                            <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="اكتب اسم الطالب بالكامل" className="w-full pr-10 pl-4 py-3 rounded-xl bg-white border border-[#E5E9E7] focus:border-[#14332B] focus:ring-4 focus:ring-[#14332B]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8] transition" />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-black text-[#14332B] mb-2 pr-1">اسم ولي الأمر *</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 right-3 flex items-center text-[#94A3B8]"><UsersRound className="w-4 h-4" /></span>
                            <input value={parentName} onChange={e => setParentName(e.target.value)} placeholder="اسم ولي الأمر" className="w-full pr-10 pl-4 py-3 rounded-xl bg-white border border-[#E5E9E7] focus:border-[#14332B] focus:ring-4 focus:ring-[#14332B]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8] transition" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-black text-[#14332B] mb-2 pr-1">رقم الهاتف الأساسي *</label>
                          <input value={primaryPhone} onChange={e => setPrimaryPhone(e.target.value)} placeholder="01xxxxxxxxx" dir="ltr" style={{ direction: 'ltr' }} className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E9E7] focus:border-[#14332B] focus:ring-4 focus:ring-[#14332B]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8] transition text-left" />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-[#14332B] mb-2 pr-1">رقم ولي الأمر <span className="text-[11px] font-bold text-[#94A3B8]">(رقم إضافي)</span></label>
                          <input value={secondaryPhone} onChange={e => setSecondaryPhone(e.target.value)} placeholder="01xxxxxxxxx" dir="ltr" style={{ direction: 'ltr' }} className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E9E7] focus:border-[#14332B] focus:ring-4 focus:ring-[#14332B]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8] transition text-left" />
                        </div>
                      </div>

                      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-bold">{error}</motion.div>}

                      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-4 py-3 flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-[#FDE68A] flex items-center justify-center shrink-0"><Shield className="w-4 h-4 text-[#D97706]" /></div>
                        <div className="text-right">
                          <div className="text-xs font-black text-[#92400E]">مطابقة دقيقة</div>
                          <div className="text-[11px] font-bold text-[#B45309] leading-relaxed">يجب كتابة الاسمين ورقم الهاتف مطابقة تماماً لما تم تسجيله. الحروف والمسافات مهمة.</div>
                        </div>
                      </div>

                      <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#14332B] text-white font-black text-[15px] shadow-[0_12px_28px_rgba(20,51,43,0.3)] hover:bg-[#1a4a3a] disabled:opacity-60 transition-all">
                        {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري التحقق...</> : <>تسجيل الدخول <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight className="w-4 h-4 rotate-180" /></span></>}
                      </button>

                      <div className="text-center">
                        <Link to="/register" className="inline-flex items-center gap-2 text-xs font-black text-[#14332B] bg-[#E6F0EA] px-4 py-2 rounded-full hover:bg-[#D1E7D9] transition">
                          ليس لديك حساب؟ سجل كطالب جديد
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </Link>
                      </div>

                      <div className="bg-[#F0FDF4] border border-green-200 rounded-xl p-3">
                        <div className="text-xs font-black text-[#065F46] flex items-center gap-1.5 mb-2"><Phone className="w-3.5 h-3.5" /> للشكاوى والاستفسارات</div>
                        <div className="grid grid-cols-2 gap-2">
                          <a href={`tel:+${CONTACT_NUMBERS.etisalat.raw}`} className="flex items-center justify-center gap-1.5 bg-[#14332B] text-white rounded-full py-2.5 text-xs font-black hover:bg-[#1a4a3a] transition"><Phone className="w-3.5 h-3.5" /><span dir="ltr">{CONTACT_NUMBERS.etisalat.display}</span></a>
                          <a href={`tel:+${CONTACT_NUMBERS.vodafone.raw}`} className="flex items-center justify-center gap-1.5 bg-white border border-green-200 text-[#065F46] rounded-full py-2.5 text-xs font-black hover:bg-white transition"><Phone className="w-3.5 h-3.5" /><span dir="ltr">{CONTACT_NUMBERS.vodafone.display}</span></a>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <a href={`https://wa.me/${CONTACT_NUMBERS.etisalat.raw}?text=${encodeURIComponent('السلام عليكم، أريد الاستفسار عن أكاديمية المنى')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white rounded-full py-2 text-xs font-black hover:bg-[#128C7E] transition"><MessageCircle className="w-3.5 h-3.5" /> واتساب اتصالات</a>
                          <a href={`https://wa.me/${CONTACT_NUMBERS.vodafone.raw}?text=${encodeURIComponent('السلام عليكم، أريد الاستفسار عن أكاديمية المنى')}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white rounded-full py-2 text-xs font-black hover:bg-[#128C7E] transition"><MessageCircle className="w-3.5 h-3.5" /> واتساب فودافون</a>
                        </div>
                        <div className="text-[11px] font-bold text-[#047857] mt-2 text-center">بعد تسجيل دخولك سيتم إرسال بياناتك تلقائياً لهذين الرقمين</div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-6 sm:px-8 py-4 flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B]">ليس لديك حساب؟ <Link to="/register" className="font-black text-[#14332B] hover:underline">سجل الآن</Link></span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0B2447] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full"><Shield className="w-3.5 h-3.5 text-green-600" /> دخول آمن</span>
              </div>
            </div>

            <p className="text-center text-xs font-bold text-[#94A3B8] mt-4">
              بالتسجيل أنت توافق على الشروط وسيتم إرسال بياناتك لواتساب الإدارة
            </p>
            {isOwnerAccess && <p className="text-center text-[11px] font-black text-[#C5A253] mt-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-full px-4 py-2">وضع المالك نشط — لا تشارك هذا الرابط</p>}
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#14332B] via-[#14332B] to-[#1a4a3a] p-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '22px 22px' }} />
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-[#C5A253]/15 rounded-full blur-3xl" />
        </div>
        <div className="relative w-full max-w-[520px] mx-auto flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 text-white rounded-full px-4 py-2 text-xs font-black w-fit"><Sparkles className="w-4 h-4 text-[#FDE68A]" /> دخول بالاسم واسم ولي الأمر ورقم الهاتف</div>
          <h2 className="mt-6 font-black text-[42px] leading-[0.95] text-white">ادخل<br /><span className="text-[#FDE68A]">مثل ما سجلت</span></h2>
          <p className="mt-4 text-white/70 font-medium leading-7">اكتب اسم الطالب واسم ولي الأمر ورقمي الهاتف مطابقة تماماً لنموذج التسجيل — حرفاً بحرف.</p>
          <div className="mt-8 bg-white rounded-[24px] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14332B] flex items-center justify-center"><BookOpen className="w-5 h-5 text-white" /></div>
              <div className="text-right"><div className="font-black text-sm text-[#0B2447]">مثال للدخول</div><div className="text-xs font-bold text-[#64748B]">الاسم + ولي الأمر + الهاتف</div></div>
            </div>
            <div className="mt-4 space-y-2 text-xs font-bold">
              <div className="bg-[#F8FAFC] rounded-xl px-3 py-2.5 border border-[#F1F5F9] flex justify-between"><span className="text-[#64748B]">اسم الطالب:</span><span className="text-[#0B2447]">أحمد محمد السيد</span></div>
              <div className="bg-[#F8FAFC] rounded-xl px-3 py-2.5 border border-[#F1F5F9] flex justify-between"><span className="text-[#64748B]">ولي الأمر:</span><span className="text-[#0B2447]">محمد السيد</span></div>
              <div className="bg-[#F8FAFC] rounded-xl px-3 py-2.5 border border-[#F1F5F9] flex justify-between"><span className="text-[#64748B]">الهاتف:</span><span className="text-[#0B2447]" dir="ltr">01140752330</span></div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white/80 text-xs font-black"><Phone className="w-4 h-4 text-[#FDE68A]" /><span dir="ltr">{CONTACT_NUMBERS.etisalat.display} (اتصالات)</span><span className="mx-1">•</span><span dir="ltr">{CONTACT_NUMBERS.vodafone.display} (فودافون)</span></div>
            <div className="flex items-center gap-3 text-white/60 text-xs font-bold"><Shield className="w-4 h-4" /> منصة آمنة • مطابقة دقيقة للبيانات</div>
          </div>
        </div>
      </div>
    </div>
  )
}
