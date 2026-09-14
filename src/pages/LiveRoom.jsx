import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Radio, Users, MessageCircle, Send, Video, Mic, MicOff, VideoOff, PhoneOff, Maximize2, Crown, GraduationCap, Clock, Eye, Share2, Heart, Sparkles, AlertCircle } from 'lucide-react'
import { getLive, saveLive, getStudents } from '../data/store'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function LiveRoom() {
  const { user, isOwner } = useAuth()
  const [live, setLive] = useState(getLive())
  const [msg, setMsg] = useState('')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [liked, setLiked] = useState(false)
  const chatRef = useRef(null)
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)

  useEffect(() => {
    const i = setInterval(() => setLive(getLive()), 1200)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [live.chat])

  // If owner and live, try to show camera
  useEffect(() => {
    if (isOwner && live.isLive && !stream) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(s => { setStream(s); if (videoRef.current) videoRef.current.srcObject = s })
        .catch(() => {})
    }
    return () => { }
  }, [isOwner, live.isLive])

  const send = (e) => {
    e.preventDefault()
    if (!msg.trim() || !live.isLive) return
    const entry = { id: Date.now(), from: user ? user.name : 'زائر', role: isOwner ? 'المالك' : 'طالب', text: msg, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }
    const next = { ...live, chat: [...(live.chat || []), entry].slice(-80) }
    saveLive(next); setLive(next); setMsg('')
  }

  const studentsCount = getStudents().length

  return (
    <div dir="rtl" className="min-h-screen bg-[#070F1F] pt-[72px]">
      {/* Top bar */}
      <div className="sticky top-[72px] z-30 bg-[#0B2447] border-y border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${live.isLive ? 'bg-red-600 animate-pulse' : 'bg-white/10'}`}>
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <div className="font-black text-white flex items-center gap-2">
                {live.isLive ? live.title : 'لا يوجد بث مباشر حالياً'}
                {live.isLive && <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full animate-pulse">LIVE</span>}
              </div>
              <div className="text-white/60 text-xs font-bold flex items-center gap-3">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{live.isLive ? `${live.viewers} مشاهد` : `${studentsCount} طالب مسجل`}</span>
                <span className="hidden sm:inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{live.isLive ? 'مباشر الآن' : 'في انتظار المالك'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ${isOwner ? 'bg-[#C5A253] text-white' : 'bg-white text-[#0B2447]'}`}>
              {isOwner ? <><Crown className="w-3.5 h-3.5" /> المالك</> : <><GraduationCap className="w-3.5 h-3.5" /> طالب</>}
            </span>
            <Link to={isOwner ? "/owner" : "/student"} className="hidden sm:inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 text-white px-4 py-2 rounded-full text-xs font-black hover:bg-white/15 transition">
              <Eye className="w-3.5 h-3.5" />
              لوحتي
            </Link>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('تم نسخ رابط البث ✅') }} className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0B2447] hover:bg-[#FFFBEB] transition">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-3 sm:p-4 lg:p-6 grid lg:grid-cols-[1fr_380px] gap-4 sm:gap-6">
        {/* Video */}
        <div className="space-y-4">
          <div className="relative rounded-[24px] overflow-hidden bg-black aspect-[16/9] shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-white/10">
            {live.isLive ? (
              <>
                {/* Video stream */}
                <video ref={videoRef} autoPlay muted={isOwner} playsInline className="w-full h-full object-cover" />

                {/* Fallback pattern when no stream */}
                {!stream && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0B2447] via-[#19376D] to-[#0B2447] flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
                    <div className="relative text-center">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <div className="font-black text-white text-lg mt-4">{live.title}</div>
                      <div className="text-white/70 text-sm font-bold">د. أحمد المنى • بث تجريبي</div>
                      {!isOwner && <div className="mt-3 inline-flex items-center gap-2 bg-white text-[#0B2447] px-4 py-2 rounded-full text-xs font-black">الصوت والصورة تعمل بشكل طبيعي</div>}
                    </div>
                  </div>
                )}

                {/* Overlays */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                  <span className="bg-black/50 backdrop-blur border border-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {live.viewers}
                  </span>
                </div>

                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 hidden sm:flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  جودة عالية • HD
                </div>

                {/* Bottom bar */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setMicOn(!micOn)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${micOn ? 'bg-white/15 backdrop-blur border-white/20 text-white' : 'bg-red-600 border-red-600 text-white'}`}>
                        {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setCamOn(!camOn)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${camOn ? 'bg-white/15 backdrop-blur border-white/20 text-white' : 'bg-red-600 border-red-600 text-white'}`}>
                        {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setLiked(!liked)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${liked ? 'bg-red-600 border-red-600 text-white' : 'bg-white/15 backdrop-blur border-white/20 text-white'}`}>
                        <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex bg-white text-[#0B2447] text-xs font-black px-3 py-1.5 rounded-full">01:24:18</span>
                      <button className="w-10 h-10 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      {isOwner && (
                        <button onClick={() => { if (stream) stream.getTracks().forEach(t => t.stop()); saveLive({ ...live, isLive: false, viewers: 0 }); setLive({ ...live, isLive: false, viewers: 0 }) }} className="hidden sm:inline-flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-black hover:bg-red-700 transition">
                          <PhoneOff className="w-4 h-4" />
                          إنهاء
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full w-[64%] bg-[#C5A253] rounded-full" />
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B2447] via-[#0B2447] to-[#19376D] flex flex-col items-center justify-center p-8 text-center">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
                <div className="relative">
                  <div className="w-20 h-20 mx-auto rounded-[20px] bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center">
                    <Video className="w-10 h-10 text-white/80" />
                  </div>
                  <h3 className="font-black text-white text-xl sm:text-2xl mt-6">البث غير نشط حالياً</h3>
                  <p className="text-white/60 text-sm font-bold mt-2 max-w-[420px] leading-relaxed">
                    {isOwner ? 'ابدأ البث من لوحة تحكم المالك وسيظهر فوراً لكل الطلاب مع إشعار مباشر.' : 'سيبدأ البث فور قيام الإدارة بالبث المباشر. ستصلك إشعارات وتظهر لك زر الانضمام تلقائياً.'}
                  </p>

                  {isOwner ? (
                    <Link to="/owner" className="mt-6 inline-flex items-center gap-2 bg-[#C5A253] text-white px-6 py-3 rounded-full font-black hover:bg-[#D4AF37] transition">
                      <Radio className="w-4 h-4" />
                      الذهاب لغرفة التحكم
                    </Link>
                  ) : (
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 text-white px-5 py-3 rounded-full font-bold text-sm">
                      <AlertCircle className="w-4 h-4 text-[#FDE68A]" />
                      انتظر إشعار البدء • سيتم التحديث تلقائياً
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-3 gap-3 max-w-[420px] mx-auto">
                    {[
                      { k: 'HD', l: 'جودة عالية' },
                      { k: 'Live Chat', l: 'شات مباشر' },
                      { k: '0 تأخير', l: 'بدون تقطيع' },
                    ].map(s => (
                      <div key={s.l} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-3 text-center">
                        <div className="font-black text-white text-sm">{s.k}</div>
                        <div className="text-[11px] font-bold text-white/60">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=11" alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E2E8F0]" />
              <div className="text-right">
                <div className="font-black text-[#0B2447] flex items-center gap-2">
                  د. أحمد المنى
                  <span className="bg-[#0B2447] text-white text-[11px] font-black px-2 py-0.5 rounded-full">خبير فيزياء</span>
                </div>
                <div className="text-xs font-bold text-[#64748B]">20 سنة خبرة • 4.9 ⭐ • 1,342 طالب حالياً</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#0B2447] text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-[#19376D] transition">
                <Users className="w-4 h-4" />
                متابعة
              </button>
              <button className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center hover:bg-white transition">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-[20px] p-5 border border-[#E2E8F0]">
            <h3 className="font-black text-[#0B2447] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A253]" />
              عن هذه الحصة
            </h3>
            <p className="mt-2 text-sm font-bold text-[#475569] leading-7">
              مراجعة شاملة للفصل الثاني (التيار الكهربي) مع حل أهم أفكار كتاب الامتحان والكتاب المدرسي. مذكرة PDF + واجب مصحح + اختبار إلكتروني بعد الحصة.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['#فيزياء_3ث', '#مراجعة_نهائية', '#البث_المباشر', '#المنى_أكاديمي'].map(tag => (
                <span key={tag} className="bg-[#F1F5F9] text-[#475569] text-xs font-black px-3 py-1.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-[640px] lg:h-[760px]">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <h3 className="font-black text-[#0B2447] flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#0B2447] text-white flex items-center justify-center"><MessageCircle className="w-4 h-4" /></span>
              الشات المباشر
              {live.isLive && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </h3>
            <span className="bg-white border border-[#E2E8F0] text-xs font-black px-3 py-1.5 rounded-full text-[#475569]">
              {(live.chat || []).length} رسالة
            </span>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {!live.isLive && (
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#FDE68A] flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-[#D97706]" />
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-[#92400E]">الشات متاح عند بدء البث فقط</div>
                  <div className="text-xs font-bold text-[#B45309] leading-relaxed">عندما يبدأ المالك البث ستتمكن من إرسال الأسئلة والتفاعل مباشرة.</div>
                </div>
              </div>
            )}

            {(live.chat || []).length === 0 && live.isLive && (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6 text-[#94A3B8]" />
                </div>
                <div className="font-black text-sm text-[#0B2447] mt-3">ابدأ المحادثة</div>
                <div className="text-xs font-bold text-[#64748B] mt-1">كن أول من يرحب بالحضور</div>
              </div>
            )}

            {(live.chat || []).map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-3 border ${m.role === 'المالك' ? 'bg-[#0B2447] text-white border-[#0B2447] shadow-md' : 'bg-white border-[#E2E8F0]'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${m.role === 'المالك' ? 'bg-[#C5A253] text-white' : 'bg-[#F1F5F9] text-[#475569]'}`}>{m.role || 'طالب'}</span>
                  <span className={`text-xs font-black ${m.role === 'المالك' ? 'text-white' : 'text-[#0B2447]'}`}>{m.from}</span>
                  <span className={`text-[11px] mr-auto ${m.role === 'المالك' ? 'text-white/60' : 'text-[#94A3B8]'}`}>{m.time}</span>
                </div>
                <div className={`text-sm font-bold leading-relaxed mt-1 ${m.role === 'المالك' ? 'text-white' : 'text-[#334155]'}`}>{m.text}</div>
              </motion.div>
            ))}
          </div>

          <form onSubmit={send} className="p-3 border-t border-[#E2E8F0] bg-white flex gap-2">
            <input
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder={live.isLive ? "اكتب سؤالك أو تعليقك..." : "الشات مغلق حتى بدء البث"}
              disabled={!live.isLive}
              className="flex-1 px-4 py-3 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-[#0B2447] focus:ring-4 focus:ring-[#0B2447]/10 outline-none text-sm font-bold placeholder:text-[#94A3B8] disabled:opacity-60"
            />
            <button type="submit" disabled={!live.isLive || !msg.trim()} className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0B2447] to-[#19376D] text-white flex items-center justify-center hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition">
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="px-4 pb-3 bg-white">
            <div className="bg-[#F8FAFC] rounded-xl px-3 py-2.5 flex items-center gap-2 text-[11px] font-bold text-[#64748B] border border-[#F1F5F9]">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {isOwner ? 'أنت تتحدث بصفتك المالك — رسائلك مميزة' : 'التزم بآداب الحوار • سيتم حذف الرسائل المسيئة'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
