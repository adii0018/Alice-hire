import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const CreateSession = () => {
  const [mode, setMode] = useState('interview')
  const [config, setConfig] = useState({
    eyeTracking: true,
    faceDetection: true,
    voiceAnalysis: true,
    tabDetection: true,
    copyPaste: true
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await api.post('/sessions/create/', { mode, config })
      navigate(`/monitor/${response.data.code}`)
    } catch (err) {
      setError('Failed to create session')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '30px', color: '#2d3748' }}>Create New Session</h2>
        {error && <div style={{ background: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '500' }}>Session Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '16px' }}>
              <option value="interview">Interview (1:1)</option>
              <option value="meeting">Meeting (1:many)</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#4a5568', fontWeight: '500' }}>Proctoring Features</label>
            {Object.keys(config).map((key) => (
              <div key={key} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={config[key]} onChange={(e) => setConfig({ ...config, [key]: e.target.checked })} style={{ marginRight: '10px', width: '18px', height: '18px' }} />
                <span style={{ color: '#2d3748' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Create Session
          </button>
        </form>
        <button onClick={() => navigate('/dashboard')} style={{ width: '100%', marginTop: '15px', padding: '14px', background: '#e2e8f0', color: '#2d3748', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default CreateSession
