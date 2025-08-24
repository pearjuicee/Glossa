import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { createUserProfile } from '../hooks/authHooks'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Complete the OAuth flow
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          navigate('/login?error=' + encodeURIComponent(error.message))
        } else {
          await createUserProfile()
          navigate('/') // Redirect to home on success
        }
      } catch (error) {
        navigate('/login?error=Unexpected error occurred')
      }
    }

    handleOAuthCallback()
  }, [navigate])

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Completing authentication...</div>
}

export default AuthCallback