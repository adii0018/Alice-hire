import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const JoinSession = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.get(`/sessions/${code}/`)
      navigate(`/room/${code}`)
    } catch (err) {
      setError('Session not found')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center', color: '#2d3748' }}>Join Session</h2>
        {error && <div style={{ background: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '500' }}>Session Code</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required maxLength={6} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '16px', textTransform: 'uppercase' }} placeholder="Enter 6-character code" />
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Join Session
          </button>
        </form>
        <button onClick={() => navigate('/dashboard')} style={{ width: '100%', marginTop: '15px', padding: '14px', background: '#e2e8f0', color: '#2d3748', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default JoinSession
