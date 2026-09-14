import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, LayoutDashboard, Radio, Menu, X, GraduationCap, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getLive } from '../data/store'

export default function Navbar() {
  const { user, logout, isOwner } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [live, setLive] = useState(getLive())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    const onLive = () => setLive(getLive())
    window.addEventListener('live-updated', onLive)
    window.addEventListener('storage', onLive)
    const interval = setInterval(() => setLive(getLive()), 2000)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('live-updated', onLive); clearInterval(interval) }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/register', label: 'تسجيل الطالب' },
    { to: '/#courses', label: 'الكورسات' },
    { to: '/#about', label: 'عن الأكاديمية' },
    { to: '/#contact', label: 'تواصل معنا' },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between rounded-[20px] px-4 sm:px-6 py-3 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(11,36,71,0.12)] border border-white/20' : 'bg-white/70 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)]'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C5A253] to-[#D4AF37] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B2447] to-[#19376D] flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C5A253] rounded-full animate-pulse border-2 border-white" />
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-[17px] leading-none text-[#0B2447] flex items-center gap-1.5">
                أكاديمية المنى
                <Sparkles className="w-3.5 h-3.5 text-[#C5A253]" />
              </div>
              <div className="text-[11px] tracking-[0.2em] text-[#64748B] font-bold">EL-MONA AKADEME</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F1F5F9] rounded-full p-1">
            {navLinks.map(l => (
              <a
                key={l.label}
                href={l.to}
                onClick={e => { if(l.to.startsWith('/#')){ e.preventDefault(); document.querySelector(l.to.slice(1))?.scrollIntoView({behavior:'smooth'}) } }}
                className="px-4 py-2 rounded-full text-sm font-bold text-[#475569] hover:text-[#0B2447] hover:bg-white transition-all"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {live.isLive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 rounded-full pl-2 pr-3 py-1.5"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="text-xs font-black text-red-700">مباشر الآن</span>
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">{live.viewers} مشاهد</span>
              </motion.div>
            )}

            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/register" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E2E8F0] text-sm font-bold text-[#14332B] hover:bg-[#F8FAFC] transition">
                  تسجيل الطالب
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 rounded-full bg-gradient-to-br from-[#0B2447] to-[#19376D] text-white text-sm font-black shadow-[0_8px_20px_rgba(11,36,71,0.3)] hover:shadow-[0_12px_28px_rgba(11,36,71,0.4)] hover:scale-[1.02] transition-all btn-shimmer">
                  دخول الطلاب
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to={isOwner ? "/owner" : "/student"}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B2447] text-white text-sm font-bold hover:bg-[#19376D] transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  لوحتي
                </Link>
                <Link
                  to="/live"
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-black transition ${live.isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-[#FFF7ED] text-[#C2410C] border border-orange-200'}`}
                >
                  <Radio className="w-4 h-4" />
                  البث
                </Link>
                <div className="hidden sm:flex items-center gap-2 bg-[#F1F5F9] rounded-full pl-2 pr-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A253] to-[#D4AF37] flex items-center justify-center text-white font-black text-xs">
                    {user.name?.slice(0,2)}
                  </div>
                  <span className="text-xs font-bold text-[#0B2447] max-w-[100px] truncate">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-red-600 hover:border-red-200 transition">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="lg:hidden mt-3 bg-white rounded-[20px] p-4 shadow-xl border border-[#E2E8F0]">
            <nav className="flex flex-col gap-1">
              {navLinks.map(l => (
                <a key={l.label} href={l.to} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#F8FAFC] text-[#0B2447]">{l.label}</a>
              ))}
              {!user && (
                <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#14332B] text-center font-bold text-sm">تسجيل الطالب</Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-3 rounded-xl bg-[#0B2447] text-white text-center font-bold text-sm">دخول الطلاب</Link>
                  <div className="col-span-2 text-[11px] font-bold text-[#94A3B8] text-center mt-1">للطالب فقط — واجهة المالك محمية</div>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
