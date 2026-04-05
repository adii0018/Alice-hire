import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [sessions, setSessions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await api.get('/sessions/')
      setSessions(response.data)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
      <nav style={{ background: 'white', padding: '20px 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', color: '#667eea', fontWeight: 'bold' }}>AliceHire</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ color: '#4a5568' }}>Welcome, {user?.username}</span>
          <button onClick={handleLogout} style={{ padding: '8px 20px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>
      <div style={{ padding: '40px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <Link to="/create-session" style={{ padding: '15px 30px', background: '#667eea', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
            Create Session
          </Link>
          <Link to="/join-session" style={{ padding: '15px 30px', background: '#48bb78', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
            Join Session
          </Link>
        </div>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#2d3748' }}>Your Sessions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {sessions.map((session) => (
            <div key={session.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: '#2d3748' }}>Code: {session.code}</div>
              <div style={{ color: '#718096', marginBottom: '5px' }}>Mode: {session.mode}</div>
              <div style={{ color: '#718096', marginBottom: '15px' }}>Status: {session.status}</div>
              <Link to={`/monitor/${session.code}`} style={{ padding: '10px 20px', background: '#667eea', color: 'white', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                Monitor
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
