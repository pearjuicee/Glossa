import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./components/Login";
import AuthCallback from "./pages/AuthCallback";
import "./App.css";
import MiningPage from "./pages/MiningPage";
import Flashcards from "./pages/Flashcards";
import Navbar from "./components/Navbar"; // Import the Navbar

// Create a protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname == "/auth/callback";

  return (
    <div className="min-h-screen bg-[#F7F5F3] flex flex-col">
      {/* Conditionally render Navbar - don't show on login page */}
      {!hideNavbar && <Navbar />}

      {/* Main content area */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route
          path="/mining"
          element={
            <ProtectedRoute>
              <MiningPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
