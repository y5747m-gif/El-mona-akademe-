import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Award, BookOpen, Radio, Star, ArrowLeft, Check, GraduationCap, Clock, Video, MessageCircle, Shield, Zap, Crown, Sparkles, ChevronLeft, Trophy, Target, Users, Layers, FileText } from 'lucide-react'
import { getLive, getCourses } from '../data/store'
import { useEffect, useState } from 'react'

function useLivePoll() {
  const [live, setLive] = useState(getLive())
  useEffect(() => {
    const i = setInterval(() => setLive(getLive()), 1500)
    return () => clearInterval(i)
  }, [])
  return live
}

export default function Landing() {
  const live = useLivePoll()
  const courses = getCourses()

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] overflow-hidden">
      {/* HERO */}
      <section className="relative pt-[96px] pb-12 sm:pb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] bg-gradient-to-br from-[#0B2447]/[0.06] to-transparent rounded-full blur-3xl" />
          <div className="absolute -top-[20%] -right-[15%] w-[60%] h-[60%] bg-gradient-to-bl from-[#C5A253]/[0.08] to-transparent rounded-full blur-3xl" />
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-b from-white to-transparent rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-2 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#E2E8F0]">
              <span className="bg-gradient-to-br from-[#C5A253] to-[#D4AF37] text-white text-xs font-black px-3 py-1 rounded-full">جديد</span>
              <span className="text-sm font-bold text-[#0B2447] pr-1">المنصة الآن متاحة — سجل كطالب</span>
              <ChevronLeft className="w-4 h-4 text-[#C5A253] ml-1" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-right"
            >
              <div className="inline-flex items-center gap-2 bg-[#0B2447] text-white rounded-full px-4 py-2 text-xs font-black mb-5 shadow-lg">
                <Crown className="w-4 h-4 text-[#C5A253]" />
                أكاديمية المنى — للثانوية العامة
                <span className="bg-[#C5A253] text-white px-2 py-0.5 rounded-full text-[10px]">2026</span>
              </div>

              <h1 className="font-black leading-[0.95] tracking-tight">
                <span className="block text-[36px] sm:text-[56px] lg:text-[64px] text-[#0B2447]">مستقبلك</span>
                <span className="block text-[36px] sm:text-[56px] lg:text-[64px] bg-gradient-to-l from-[#0B2447] via-[#19376D] to-[#C5A253] bg-clip-text text-transparent">يبدأ من هنا</span>
              </h1>

              <p className="mt-5 text-[15px] sm:text-[18px] leading-8 text-[#64748B] font-medium max-w-[560px] mx-auto lg:mx-0">
                منصة <span className="font-black text-[#0B2447]">أكاديمية المنى</span> التعليمية المتكاملة — بث مباشر، متابعة يومية، ومراجعات نهائية. المنصة فارغة الآن وسيقوم المالك بإضافة الكورسات والطلاب.
              </p>

              <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                <Link to="/login" className="inline-flex items-center gap-3 bg-gradient-to-br from-[#0B2447] to-[#19376D] text-white px-7 sm:px-8 py-4 rounded-full font-black text-[15px] shadow-[0_12px_32px_rgba(11,36,71,0.3)] hover:shadow-[0_16px_40px_rgba(11,36,71,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all btn-shimmer">
                  دخول الطلاب
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </Link>
                <Link to="/live" className={`inline-flex items-center gap-2 px-6 py-4 rounded-full font-black text-[15px] border-2 transition ${live.isLive ? 'bg-red-600 border-red-600 text-white animate-pulse shadow-[0_12px_32px_rgba(220,38,38,0.3)]' : 'bg-white border-[#E2E8F0] text-[#0B2447] hover:bg-[#F8FAFC]'}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${live.isLive ? 'bg-white animate-ping absolute' : 'bg-red-500'}`} />
                  {live.isLive ? 'انضم للبث المباشر' : 'استكشف البث المباشر'}
                  <Video className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-full px-4 py-2 shadow-sm">
                  <div className="flex -space-x-1 space-x-reverse">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B2447] to-[#19376D] border-2 border-white flex items-center justify-center text-white">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-black text-[#0B2447]">منصة آمنة</span>
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />)}
                    <span className="font-black text-[#0B2447] mr-2">4.9/5</span>
                  </div>
                  <div className="text-xs text-[#64748B] font-bold">نظام تعليمي متكامل</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16,1,0.3,1] }}
              className="relative lg:h-[560px]"
            >
              <div className="relative bg-white rounded-[32px] shadow-[0_24px_64px_rgba(11,36,71,0.14)] border border-[#E2E8F0] overflow-hidden p-3 sm:p-4">
                <div className="flex items-center justify-between bg-[#F8FAFC] rounded-2xl px-4 py-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-[#E2E8F0] text-xs font-bold text-[#64748B]">
                    <Shield className="w-3.5 h-3.5 text-green-600" />
                    elmona.live
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div className="w-16" />
                </div>

                <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#0B2447] via-[#19376D] to-[#0B2447] aspect-[16/10] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white rounded-full px-3 py-1.5 text-xs font-black shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping absolute" />
                    <span className="w-2 h-2 bg-white rounded-full relative" />
                    LIVE
                    <span className="bg-white/20 px-2 py-0.5 rounded-full">{live.isLive ? `${live.viewers} • مباشر` : 'جاهز للبث'}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white rounded-full px-3 py-1.5 text-xs font-bold border border-white/20">
                    البث المباشر • جودة عالية
                  </div>

                  <div className="relative z-10 text-center p-6">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 mx-auto rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
                    >
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <Video className="w-6 h-6 text-[#0B2447]" />
                      </div>
                    </motion.div>
                    <div className="mt-4 text-white font-black text-lg">أكاديمية المنى</div>
                    <div className="text-white/70 text-sm font-bold">بث مباشر تفاعلي • شات فوري • سبورة ذكية</div>
                    <div className="mt-3 inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 text-white rounded-full px-4 py-1.5 text-xs font-black">
                      <Radio className="w-3.5 h-3.5 text-red-400" />
                      سيبدأ المالك البث من لوحة التحكم
                    </div>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"><Video className="w-4 h-4 text-white" /></span>
                        <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"><MessageCircle className="w-4 h-4 text-white" /></span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 text-xs font-black text-[#0B2447]">
                        <Clock className="w-3.5 h-3.5" />
                        بث حي
                      </div>
                    </div>
                    <div className="h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                      <div className="h-full w-[68%] bg-[#C5A253] rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    { icon: Layers, label: 'كورسات', value: courses.length ? `${courses.length}` : '—', color: 'bg-[#EFF6FF] text-[#0284C7]' },
                    { icon: BookOpen, label: 'حصص', value: 'جاهزة', color: 'bg-[#FFFBEB] text-[#D97706]' },
                    { icon: Trophy, label: 'بث حي', value: live.isLive ? 'مباشر' : 'انتظار', color: 'bg-[#F0FDF4] text-[#059669]' },
                  ].map(card => (
                    <div key={card.label} className="bg-[#F8FAFC] rounded-2xl p-3 text-center border border-[#F1F5F9]">
                      <div className={`w-8 h-8 rounded-xl ${card.color} flex items-center justify-center mx-auto mb-2`}>
                        <card.icon className="w-4 h-4" />
                      </div>
                      <div className="font-black text-[#0B2447] text-sm leading-none">{card.value}</div>
                      <div className="text-[11px] font-bold text-[#64748B]">{card.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-2 sm:-right-4 top-[22%] hidden sm:flex bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#E2E8F0] p-3 items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A253] to-[#D4AF37] flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-[#0B2447] leading-none">منصة جاهزة</div>
                  <div className="text-xs font-bold text-[#059669] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> الآن</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -left-2 sm:-left-6 bottom-[18%] hidden sm:flex bg-[#0B2447] text-white rounded-2xl shadow-[0_12px_32px_rgba(11,36,71,0.3)] p-3 items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="font-black text-sm leading-none">نظام آمن</div>
                  <div className="text-xs text-white/70">دخول الطلاب محمي</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#C5A253] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 sm:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {[
              { value: 'HD', label: 'جودة بث', sub: 'عالية ومستقرة', icon: Video },
              { value: 'آمن', label: 'نظام محمي', sub: 'دخول بكود', icon: Shield },
              { value: 'فوري', label: 'شات مباشر', sub: 'تفاعل حي', icon: MessageCircle },
              { value: '24/7', label: 'دعم فني', sub: 'متابعة مستمرة', icon: Zap },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-[20px] p-4 sm:p-5 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-3 sm:gap-4 group hover:shadow-[0_8px_32px_rgba(11,36,71,0.08)] hover:-translate-y-1 transition-all">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#0B2447] to-[#19376D] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-right">
                  <div className="font-black text-xl sm:text-2xl text-[#0B2447] leading-none">{s.value}</div>
                  <div className="font-black text-sm text-[#0B2447]">{s.label}</div>
                  <div className="text-xs font-bold text-[#64748B]">{s.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COURSES - فارغ */}
      <section id="courses" className="py-14 sm:py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-full px-4 py-1.5 text-xs font-black mb-3">
                <BookOpen className="w-4 h-4" />
                الكورسات
              </div>
              <h2 className="font-black text-[28px] sm:text-[40px] leading-none text-[#0B2447]">كل المواد في مكان واحد</h2>
              <p className="mt-3 text-[#64748B] font-medium max-w-[560px] mx-auto lg:mx-0">سيقوم المالك بإضافة الكورسات والمواد هنا — المنصة جاهزة لاستقبال المحتوى.</p>
            </div>
            <Link to="/login" className="hidden lg:inline-flex items-center gap-2 bg-[#0B2447] text-white px-6 py-3 rounded-full font-black hover:bg-[#19376D] transition">
              دخول الطلاب
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-[24px] p-10 sm:p-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
                <Layers className="w-8 h-8 text-[#94A3B8]" />
              </div>
              <h3 className="font-black text-lg text-[#0B2447] mt-4">لا توجد كورسات بعد</h3>
              <p className="text-sm font-bold text-[#64748B] mt-2 max-w-[420px] mx-auto leading-relaxed">المنصة فارغة حالياً. سيقوم المالك بإضافة الكورسات والحصص وستظهر هنا تلقائياً للطلاب.</p>
              <div className="mt-6 inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-full px-4 py-2 text-xs font-black text-[#475569]">
                <Clock className="w-4 h-4" />
                في انتظار إضافة المحتوى
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {courses.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(11,36,71,0.12)] transition-all duration-300"
                >
                  <div className={`h-28 bg-gradient-to-br ${c.color} relative p-5 flex items-center justify-between overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '18px 18px' }} />
                    <div className="relative w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg">
                      {c.image}
                    </div>
                    <span className="relative bg-white text-[#0B2447] text-xs font-black px-3 py-1.5 rounded-full shadow-md">{c.level}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-[17px] leading-tight text-[#0B2447] group-hover:text-[#19376D] transition">{c.title}</h3>
                    <p className="text-sm font-bold text-[#64748B] mt-1">{c.teacher}</p>
                    <div className="flex items-center justify-between mt-5">
                      <span className="text-xs font-black bg-[#F0FDF4] text-[#059669] border border-green-200 px-3 py-1.5 rounded-full">{c.price}</span>
                      <Link to="/login" className="w-9 h-9 rounded-full bg-[#0B2447] text-white flex items-center justify-center group-hover:bg-[#C5A253] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY US - بدون صور أشخاص */}
      <section id="about" className="py-14 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-full px-4 py-1.5 text-xs font-black text-[#0B2447] shadow-sm mb-4">
                <Sparkles className="w-4 h-4 text-[#C5A253]" />
                لماذا أكاديمية المنى؟
              </div>
              <h2 className="font-black text-[30px] sm:text-[42px] leading-[1.1] text-[#0B2447]">تعليم يُشبهك<br /><span className="text-[#C5A253]">ويفهم حلمك</span></h2>
              <p className="mt-4 text-[#64748B] font-medium leading-7">نظام متكامل صُمم ليأخذ بيدك من أول حصة حتى ليلة الامتحان — بث مباشر، واجبات مصححة، متابعة، ومراجعات ليلة الامتحان.</p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {[
                  { icon: Video, title: 'بث مباشر تفاعلي', desc: 'حصص لايف مع شات مباشر وسبورة ذكية' },
                  { icon: BookOpen, title: 'مذكرات وملازم', desc: 'PDF + فيديوهات مسجلة' },
                  { icon: Users, title: 'متابعة يومية', desc: 'تقرير حضور ودرجات' },
                  { icon: Trophy, title: 'مراجعات نهائية', desc: 'ليلة الامتحان + توقعات' },
                ].map(f => (
                  <div key={f.title} className="bg-white rounded-2xl p-4 border border-[#E2E8F0] flex gap-3 hover:shadow-md transition">
                    <div className="w-10 h-10 rounded-xl bg-[#0B2447] flex items-center justify-center text-white shrink-0">
                      <f.icon className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <div className="font-black text-sm text-[#0B2447]">{f.title}</div>
                      <div className="text-xs font-bold text-[#64748B] leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-full px-4 py-2 text-sm font-bold">
                  <Check className="w-4 h-4 text-green-600" />
                  منصة آمنة ومحمية
                </div>
                <div className="flex items-center gap-2 bg-[#0B2447] text-white rounded-full px-4 py-2 text-sm font-black">
                  <Shield className="w-4 h-4 text-[#C5A253]" />
                  دخول بكود خاص
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="order-1 lg:order-2 relative">
              <div className="relative rounded-[32px] overflow-hidden shadow-[0_24px_64px_rgba(11,36,71,0.15)] border border-white bg-gradient-to-br from-[#0B2447] via-[#19376D] to-[#0B2447] p-8 sm:p-10">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
                <div className="relative text-center">
                  <div className="w-20 h-20 mx-auto rounded-[20px] bg-white flex items-center justify-center shadow-xl">
                    <GraduationCap className="w-10 h-10 text-[#0B2447]" />
                  </div>
                  <h3 className="font-black text-white text-2xl mt-6">أكاديمية المنى</h3>
                  <p className="text-white/70 font-bold mt-2 leading-relaxed">منصة تعليمية متكاملة<br />بث مباشر • متابعة يومية • مذكرات</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { icon: Video, label: 'بث حي' },
                      { icon: FileText, label: 'مذكرات' },
                      { icon: Award, label: 'متابعة' },
                    ].map(b => (
                      <div key={b.label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 text-center">
                        <b.icon className="w-6 h-6 text-white mx-auto" />
                        <div className="text-xs font-black text-white mt-1">{b.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 bg-white rounded-2xl p-4 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C5A253] to-[#D4AF37] flex items-center justify-center text-white">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="font-black text-[#0B2447] leading-none">جاهز للانطلاق</div>
                        <div className="text-xs font-bold text-[#64748B]">المنصة فارغة — بانتظار الإضافات</div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#0B2447] text-white flex items-center justify-center">
                      <Crown className="w-5 h-5 text-[#C5A253]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-4 sm:left-0 bg-white rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-[#E2E8F0] p-4 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#059669]"><Clock className="w-5 h-5" /></div>
                <div className="text-right">
                  <div className="font-black text-sm">البث المباشر</div>
                  <div className="text-xs font-bold text-[#64748B]">يبدأه المالك بضغطة زر</div>
                </div>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#0B2447] via-[#0B2447] to-[#19376D] p-8 sm:p-12">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#C5A253]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#0EA5E9]/15 rounded-full blur-3xl" />

            <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
              <div className="text-center lg:text-right">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white rounded-full px-4 py-1.5 text-xs font-black mb-4">
                  <Zap className="w-4 h-4 text-[#FDE68A]" />
                  المنصة جاهزة — ابدأ الآن
                </div>
                <h3 className="font-black text-[28px] sm:text-[42px] leading-[1] text-white">جاهز تبدأ<br /><span className="text-[#FDE68A]">رحلة التفوق؟</span></h3>
                <p className="mt-3 text-white/70 font-medium leading-7 max-w-[560px] mx-auto lg:mx-0">سجل كطالب الآن. ستحصل على الكود وكلمة السر من إدارة الأكاديمية.</p>
                <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                  <Link to="/login" className="inline-flex items-center gap-2 bg-white text-[#0B2447] px-7 py-3.5 rounded-full font-black hover:bg-[#FFFBEB] transition">
                    دخول الطلاب
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <Link to="/live" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-7 py-3.5 rounded-full font-black hover:bg-white/15 transition">
                    <Video className="w-4 h-4" />
                    معاينة البث
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="bg-white rounded-[20px] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0B2447] flex items-center justify-center text-white"><Shield className="w-5 h-5" /></div>
                    <div className="text-right">
                      <div className="font-black text-sm text-[#0B2447]">دخول آمن</div>
                      <div className="text-xs font-bold text-[#059669] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> بكود خاص من الإدارة</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { l: 'كورسات منظمة', v: 'قريباً' },
                      { l: 'بث مباشر', v: 'جاهز' },
                      { l: 'متابعة يومية', v: 'فعال' },
                    ].map(r => (
                      <div key={r.l} className="flex items-center justify-between bg-[#F8FAFC] rounded-xl px-3 py-2.5 border border-[#F1F5F9]">
                        <span className="text-xs font-black text-[#0B2447]">{r.l}</span>
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-[#0B2447] text-white">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#070F1F] text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C5A253] to-[#D4AF37] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="font-black">أكاديمية المنى</div>
                  <div className="text-xs tracking-[0.2em] text-white/60 font-bold">EL-MONA AKADEME</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/60 font-medium max-w-[420px]">منصة تعليمية متكاملة للثانوية العامة — بث مباشر، متابعة يومية، ومراجعات نهائية.</p>
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-white/50">
                <Shield className="w-4 h-4" />
                جميع الحقوق محفوظة © 2026 أكاديمية المنى
              </div>
            </div>
            <div>
              <div className="font-black mb-3">روابط سريعة</div>
              <ul className="space-y-2 text-sm text-white/60 font-bold">
                <li><a href="#courses" className="hover:text-white">الكورسات</a></li>
                <li><a href="#about" className="hover:text-white">عن الأكاديمية</a></li>
                <li><Link to="/live" className="hover:text-white">البث المباشر</Link></li>
                <li><Link to="/login" className="hover:text-white">دخول الطلاب</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-black mb-3">تواصل معنا</div>
              <ul className="space-y-2 text-sm text-white/60 font-bold">
                <li>0100 123 4567</li>
                <li>info@elmona.edu.eg</li>
                <li>القاهرة - مدينة نصر</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
