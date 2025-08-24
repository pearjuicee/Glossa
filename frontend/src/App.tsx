import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './components/Login'
import AuthCallback from './pages/AuthCallback'
import './App.css'
import MiningPage from './pages/MiningPage'
import Flashcards from './pages/Flashcards'
import Navbar from './components/Navbar' // Import the Navbar

// Create a protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AppContent() {
  const { user } = useAuth() // Get auth state to conditionally show Navbar

  return (
    <BrowserRouter>
      {/* Conditionally render Navbar - don't show on login page */}
      <Navbar />
      
      {/* Main content area */}
      <div style={{ minHeight: 'calc(100vh - 80px)', paddingTop: user ? '0' : '0' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/mining" element={
            <ProtectedRoute>
              <MiningPage />
            </ProtectedRoute>
          } />

          <Route path="/flashcards" element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App