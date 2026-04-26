import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { StudentProgressProvider } from './contexts/StudentProgressContext.jsx'
import HomePage from './pages/HomePage.jsx'
import BookViewer from './pages/BookViewer.jsx'
import BookList from './pages/BookList.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import CheckoutSuccess from './pages/CheckoutSuccess.jsx'
import CheckoutCancel from './pages/CheckoutCancel.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import FreeAssessmentPage from './pages/FreeAssessmentPage.jsx'
import FreeAssessmentViewer from './pages/FreeAssessmentViewer.jsx'
import CertificatePage from './pages/CertificatePage.jsx'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function TeacherRoute({ children }) {
  const { user, isTeacher } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isTeacher) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <StudentProgressProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
          <Route path="/books/:bookId" element={<ProtectedRoute><BookViewer /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/teacher" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
          <Route path="/assess" element={<FreeAssessmentPage />} />
          <Route path="/assess/:level" element={<FreeAssessmentViewer />} />
          <Route path="/certificate/:bookId" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
          <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </StudentProgressProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
