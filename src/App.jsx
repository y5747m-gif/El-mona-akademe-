import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import LiveRoom from './pages/LiveRoom'

function Protected({ children, allow }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to={`/login?role=${allow === 'owner' ? 'owner' : 'student'}`} state={{ from: location }} replace />
  if (allow === 'owner' && user.role !== 'owner') return <Navigate to="/student" replace />
  if (allow === 'student' && user.role !== 'student') return <Navigate to="/owner" replace />
  return children
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
