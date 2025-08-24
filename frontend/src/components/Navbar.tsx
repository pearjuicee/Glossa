import { useAuth } from '../context/AuthContext'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Don't show navbar on login page
  if (location.pathname === '/login') {
    return null
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Logo/Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link 
          to="/" 
          style={{
            textDecoration: 'none',
            color: '#007bff',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}
        >
          Glossa
        </Link>

        {/* Navigation Links - only show when user is logged in */}
        {user && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              to="/mining" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/mining' ? '#007bff' : '#495057',
                fontWeight: location.pathname === '/mining' ? 'bold' : 'normal',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
            >
              Sentence Mining
            </Link>
            
            <Link 
              to="/flashcards" 
              style={{
                textDecoration: 'none',
                color: location.pathname === '/flashcards' ? '#007bff' : '#495057',
                fontWeight: location.pathname === '/flashcards' ? 'bold' : 'normal',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
            >
              Flashcards
            </Link>
          </div>
        )}
      </div>

      {/* User section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span style={{ color: '#495057' }}>
              Hello, {user.email}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar