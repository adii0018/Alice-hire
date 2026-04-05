import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Landing = () => {
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>AliceHire</h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>AI-Powered Interview Security Platform</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {user ? (
            <Link to="/dashboard" style={{ padding: '15px 40px', background: 'white', color: '#667eea', borderRadius: '8px', textDecoration: 'none', fontSize: '18px', fontWeight: '600' }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ padding: '15px 40px', background: 'white', color: '#667eea', borderRadius: '8px', textDecoration: 'none', fontSize: '18px', fontWeight: '600' }}>
                Login
              </Link>
              <Link to="/register" style={{ padding: '15px 40px', background: 'transparent', color: 'white', border: '2px solid white', borderRadius: '8px', textDecoration: 'none', fontSize: '18px', fontWeight: '600' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Landing
