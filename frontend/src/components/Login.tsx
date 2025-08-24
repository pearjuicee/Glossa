import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { createUserProfile } from '../hooks/authHooks'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false) // Toggle between login/signup
  const { signIn, signUp, signInWithGithub } = useAuth()
  const navigate = useNavigate()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      let result
      if (isSignUp) {
        // Handle signup
        result = await signUp(email, password)
      } else {
        // Handle login
        result = await signIn(email, password)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        // For signup, Supabase may require email confirmation
        if (isSignUp && result.data?.user && !result.data.session) {
          setError('Please check your email for confirmation instructions.')
        } else {
          await createUserProfile()
          navigate('/') // Redirect on success
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubAuth = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await signInWithGithub()
      if (error) {
        setError(error.message)
      }
      // GitHub OAuth will redirect automatically
    } catch (err) {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setError(null) // Clear errors when switching modes
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <Link 
        to="/"
        style={{
          top: '-2rem',
          left: '0',
          textDecoration: 'none',
          color: '#007bff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          marginBottom: '1rem' // Add some space below
        }}
      >
        ← Back to Home
      </Link>
      <h2>{isSignUp ? 'Create Account' : 'Login'}</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem', 
          padding: '0.5rem',
          backgroundColor: '#ffe6e6',
          borderRadius: '4px',
          border: '1px solid #ffcccc'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleEmailAuth}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={isLoading}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isLoading}
            minLength={6}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          />
          {isSignUp && (
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              Password must be at least 6 characters
            </small>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            marginBottom: '1rem',
            backgroundColor: isSignUp ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: 0, 
          right: 0, 
          height: '1px', 
          backgroundColor: '#ddd' 
        }}></div>
        <span style={{ 
          backgroundColor: 'white', 
          padding: '0 1rem', 
          color: '#666',
          position: 'relative'
        }}>
          Or
        </span>
      </div>

      <button 
        onClick={handleGithubAuth} 
        disabled={isLoading}
        style={{ 
          width: '100%', 
          padding: '0.75rem', 
          backgroundColor: '#24292e',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '1.5rem'
        }}
      >
        Sign in with GitHub
      </button>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#666', margin: 0 }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <button
            type="button"
            onClick={toggleAuthMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      {isSignUp && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#0066cc'
        }}>
          <strong>Note:</strong> After signing up, you may need to check your email to confirm your account before logging in.
        </div>
      )}
    </div>
  )
}

export default Login