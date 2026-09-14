import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Radio, Clock, Award, Video, FileText, CheckCircle, Play, Calendar, Target, TrendingUp, Bell, Layers, Star, ChevronLeft, GraduationCap, Phone, MessageCircle, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getCourses, getLive, getAnnouncements, CONTACT_NUMBERS, getWhatsAppLinksForStudent } from '../data/store'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [live, setLive] = useState(getLive())
  const [courses, setCourses] = useState(getCourses())
  const [announcements, setAnnouncements] = useState(getAnnouncements())

  useEffect(() => {
    const i = setInterval(() => {
      setLive(getLive())
      setCourses(getCourses())
      setAnnouncements(getAnnouncements())
    }, 1500)
    const onUpd = () => { setCourses(getCourses()); setAnnouncements(getAnnouncements()) }
    window.addEventListener('courses-updated', onUpd)
    window.addEventListener('announcements-updated', onUpd)
    return () => { clearInterval(i); window.removeEventListener('courses-updated', onUpd); window.removeEventListener('announcements-updated', onUpd) }
  }, [])

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] pt-[88px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0B2447] via-[#0B2447] to-[#19376D] p-6 sm:p-8"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#C5A253]/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-gradient-to-br from-[#C5A253] to-[#D4AF37] flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-xl">
                  {user.avatar || user.name?.slice(0,2)}
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </span>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-xs font-black tracking-widest">مرحباً بعودتك</div>
                <h1 className="font-black text-xl sm:text-2xl text-white leading-tight">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="bg-white text-[#0B2447] text-xs font-black px-3 py-1 rounded-full">{user.id}</span>
                  <span className="bg-white/15 backdrop-blur border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{user.group}</span>
                  <span className="bg-[#C5A253] text-white text-xs font-black px-3 py-1 rounded-full">{user.level}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              {[
                { k: `${user.attendance ?? 0}%`, l: 'الحضور', icon: Target },
                { k: `${user.avg ?? 0}%`, l: 'المعدل', icon: Award },
                { k: '—', l: 'واجبات', icon: FileText },
              ].map(s => (
                <div key={s.l} className="bg-white rounded-2xl p-3 sm:p-4 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-1.5 text-[#0B2447]">
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div className="font-black text-[#0B2447] leading-none">{s.k}</div>
                  <div className="text-[11px] font-bold text-[#64748B]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {live.isLive && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative mt-6 bg-gradient-to-l from-red-600 to-red-500 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_12px_32px_rgba(220,38,38,0.3)]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 animate-pulse">
                  <Radio className="w-5 h-5" />
                </span>
                <div className="text-right">
                  <div className="font-black text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping absolute" />
                    <span className="w-2 h-2 bg-white rounded-full relative" />
                    بث مباشر الآن — {live.title || 'حصة مباشرة'}
                  </div>
                  <div className="text-white/80 text-xs font-bold">{live.viewers} طالب يشاهد الآن • انضم فوراً</div>
                </div>
              </div>
              <Link to="/live" className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-black hover:bg-red-50 transition">
                انضم للبث
                <Video className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* تنبيه إرسال البيانات */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="relative mt-4 bg-[#F0FDF4] border border-green-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </span>
              <div className="text-right">
                <div className="font-black text-sm text-[#065F46]">تم إرسال بياناتك لإدارة الأكاديمية ✅</div>
                <div className="text-xs font-bold text-[#047857]">بيانات دخولك أُرسلت تلقائياً لواتساب الإدارة على الرقمين التاليين للمتابعة</div>
                <div className="text-xs font-black text-[#065F46] mt-1 flex flex-wrap gap-2" dir="ltr">
                  <span className="bg-white border border-green-200 px-2 py-0.5 rounded-full">{CONTACT_NUMBERS.etisalat.display} (اتصالات)</span>
                  <span className="bg-white border border-green-200 px-2 py-0.5 rounded-full">{CONTACT_NUMBERS.vodafone.display} (فودافون)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <a href={getWhatsAppLinksForStudent(user).etisalat} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-black hover:bg-[#128C7E] transition">
                <MessageCircle className="w-3.5 h-3.5" />
                إعادة إرسال
              </a>
              <a href={`tel:+${CONTACT_NUMBERS.etisalat.raw}`} className="inline-flex items-center gap-1.5 bg-white border border-green-200 text-[#065F46] px-4 py-2 rounded-full text-xs font-black hover:bg-[#F0FDF4] transition">
                <Phone className="w-3.5 h-3.5" />
                اتصال
              </a>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.7fr_0.9fr] gap-6 mt-6">
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 pb-4 flex items-center justify-between">
                <h2 className="font-black text-lg text-[#0B2447] flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#0B2447] text-white flex items-center justify-center"><BookOpen className="w-4 h-4" /></span>
                  كورساتي
                </h2>
                <span className="text-xs font-black bg-[#F1F5F9] text-[#475569] px-3 py-1.5 rounded-full">{courses.length} كورسات</span>
              </div>

              {courses.length === 0 ? (
                <div className="px-6 pb-8">
                  <div className="bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-2xl p-8 text-center">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center">
                      <Layers className="w-7 h-7 text-[#94A3B8]" />
                    </div>
                    <div className="font-black text-[#0B2447] mt-3">لا توجد كورسات مضافة بعد</div>
                    <div className="text-xs font-bold text-[#64748B] mt-1">سيقوم المالك بإضافة الكورسات وستظهر هنا تلقائياً</div>
                  </div>
                  <Link to="/live" className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#0B2447] text-white font-black hover:bg-[#19376D] transition">
                    <Video className="w-4 h-4" />
                    الذهاب للبث المباشر
                  </Link>
                </div>
              ) : (
                <>
                  <div className="px-4 sm:px-6 pb-6 grid sm:grid-cols-2 gap-4">
                    {courses.slice(0, 4).map((c, i) => (
                      <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }} className="group rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_8px_24px_rgba(11,36,71,0.08)] hover:-translate-y-1 transition-all">
                        <div className={`h-20 bg-gradient-to-br ${c.color} relative p-4 flex items-center justify-between`}>
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-xl">{c.image}</div>
                          <span className="bg-white text-[#0B2447] text-[11px] font-black px-2.5 py-1 rounded-full">{c.level}</span>
                        </div>
                        <div className="p-4">
                          <div className="font-black text-sm text-[#0B2447] leading-tight">{c.title}</div>
                          <div className="text-xs font-bold text-[#64748B] mt-1">{c.teacher || 'أكاديمية المنى'}</div>
                          <div className="mt-3">
                            <div className="flex justify-between text-[11px] font-black mb-1"><span className="text-[#64748B]">التقدم</span><span className="text-[#0B2447]">{c.progress ?? 0}%</span></div>
                            <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-l ${c.color} rounded-full`} style={{ width: `${c.progress ?? 0}%` }} /></div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button className="flex-1 py-2 rounded-full bg-[#0B2447] text-white text-xs font-black flex items-center justify-center gap-1 hover:bg-[#19376D] transition">
                              <Play className="w-3 h-3 fill-white" />
                              متابعة
                            </button>
                            <button className="px-3 py-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-black hover:bg-white transition flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              مذكرة
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-6 pb-6">
                    <Link to="/live" className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] font-black hover:bg-[#FEF3C7] transition">
                      <Video className="w-4 h-4" />
                      دخول البث المباشر
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
              <h3 className="font-black text-[#0B2447] flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706]"><Calendar className="w-4 h-4" /></span>
                جدول الحصص
              </h3>
              <div className="bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-2xl p-8 text-center">
                <Calendar className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <div className="font-black text-sm text-[#0B2447] mt-2">الجدول فارغ حالياً</div>
                <div className="text-xs font-bold text-[#64748B] mt-1">سيتم تحديث الجدول عند إضافة الحصص من الإدارة</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-5">
                <h3 className="font-black text-[#0B2447] flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600"><Radio className="w-4 h-4" /></span>
                  البث المباشر
                </h3>
                <div className={`mt-4 rounded-2xl overflow-hidden relative aspect-[16/10] flex items-center justify-center ${live.isLive ? 'bg-gradient-to-br from-[#0B2447] to-[#19376D]' : 'bg-[#F1F5F9] border-2 border-dashed border-[#E2E8F0]'}`}>
                  {live.isLive ? (
                    <>
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full" />
                        LIVE • {live.viewers}
                      </div>
                      <div className="text-center text-white">
                        <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center mx-auto">
                          <Play className="w-6 h-6 fill-white text-white" />
                        </div>
                        <div className="font-black mt-2">{live.title || 'حصة مباشرة'}</div>
                        <div className="text-white/70 text-xs font-bold">أكاديمية المنى • الآن</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#94A3B8]">
                        <Video className="w-6 h-6" />
                      </div>
                      <div className="font-black text-sm text-[#0B2447] mt-3">لا يوجد بث حالياً</div>
                      <div className="text-xs font-bold text-[#64748B] mt-1">سيظهر البث هنا فور بدء المالك</div>
                    </div>
                  )}
                </div>
                <Link to="/live" className={`mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-black transition ${live.isLive ? 'bg-red-600 text-white hover:bg-red-700 shadow-[0_8px_20px_rgba(220,38,38,0.3)]' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}>
                  <Video className="w-4 h-4" />
                  {live.isLive ? 'انضم الآن' : 'فتح صفحة البث'}
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5">
              <h3 className="font-black text-[#0B2447] flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#FFF7ED] border border-orange-200 flex items-center justify-center text-[#EA580C]"><Bell className="w-4 h-4" /></span>
                الإعلانات
              </h3>
              {announcements.length === 0 ? (
                <div className="bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-2xl p-6 text-center">
                  <Bell className="w-8 h-8 text-[#94A3B8] mx-auto" />
                  <div className="font-black text-sm text-[#0B2447] mt-2">لا توجد إعلانات</div>
                  <div className="text-xs font-bold text-[#64748B] mt-1">ستظهر الإعلانات هنا عند نشرها من الإدارة</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map(a => (
                    <div key={a.id} className={`rounded-2xl p-4 border ${a.important ? 'bg-[#FFFBEB] border-[#FDE68A]' : 'bg-[#F8FAFC] border-[#F1F5F9]'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {a.important && <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">مهم</span>}
                        <span className="text-[11px] font-bold text-[#64748B]">{a.date}</span>
                      </div>
                      <div className="font-black text-sm text-[#0B2447] leading-tight">{a.title}</div>
                      <div className="text-xs font-bold text-[#64748B] leading-relaxed mt-1">{a.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#0B2447] to-[#19376D] rounded-[24px] p-5 text-white relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 font-black">
                  <TrendingUp className="w-5 h-5 text-[#FDE68A]" />
                  مستواك
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    { k: '—', l: 'واجبات' },
                    { k: '—', l: 'حضور' },
                    { k: '—', l: 'تقييم' },
                  ].map(s => (
                    <div key={s.l} className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                      <div className="font-black">{s.k}</div>
                      <div className="text-[11px] font-bold text-white/70">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 w-full py-3 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-black flex items-center justify-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-[#FDE68A]" />
                  سيظهر تقريرك هنا بعد بدء الدراسة
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
