import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import LiveRoom from './pages/LiveRoom'
import { CONTACT_NUMBERS } from './data/store'
import { MessageCircle, Phone } from 'lucide-react'

function Protected({ children, allow }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    // للمالك نحتاج مفتاح سري
    if (allow === 'owner') return <Navigate to={`/login?role=owner&key=elmona2026`} state={{ from: location }} replace />
    return <Navigate to={`/login`} state={{ from: location }} replace />
  }
  if (allow === 'owner' && user.role !== 'owner') return <Navigate to="/student" replace />
  if (allow === 'student' && user.role !== 'student') return <Navigate to="/owner" replace />
  return children
}

function FloatingContact() {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
      <a
        href={`https://wa.me/${CONTACT_NUMBERS.etisalat.raw}?text=${encodeURIComponent('السلام عليكم، أريد الاستفسار عن أكاديمية المنى')}`}
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition"
        title="واتساب اتصالات - للشكاوى والاستفسارات"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
      <a
        href={`tel:+${CONTACT_NUMBERS.etisalat.raw}`}
        className="w-12 h-12 rounded-full bg-[#0B2447] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(11,36,71,0.3)] hover:scale-110 transition sm:hidden"
        title="اتصال"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={
          user ? (user.role === 'owner' ? <Navigate to="/owner" replace /> : <Navigate to="/student" replace />) : <Login />
        } />
        <Route path="/student" element={<Protected allow="student"><StudentDashboard /></Protected>} />
        <Route path="/owner" element={<Protected allow="owner"><OwnerDashboard /></Protected>} />
        <Route path="/live" element={<LiveRoom />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingContact />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
