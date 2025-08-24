import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Glossa! 🎉</h1>
      
      {user ? (
        <div>
          <p>Hello, {user.email}!</p>
          <p>You are successfully logged in.</p>

        </div>
      ) : (
        <p>Please log in to continue.</p>
      )}
    </div>
  )
}

export default Home