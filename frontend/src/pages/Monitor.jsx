import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useSignaling from '../webrtc/useSignaling'
import useRiskScore from '../proctoring/useRiskScore'
import api from '../api/axios'

const Monitor = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [session, setSession] = useState(null)
  const localVideoRef = useRef(null)

  const { score, riskLevel } = useRiskScore(alerts)

  const signalingHandlers = {
    onAlertUpdate: (alert) => {
      setAlerts(prev => [alert, ...prev])
    }
  }

  useSignaling(code, 'host', signalingHandlers)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, alertsRes] = await Promise.all([
          api.get(`/sessions/${code}/`),
          api.get(`/alerts/${code}/`)
        ])
        setSession(sessionRes.data)
        setAlerts(alertsRes.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        navigate('/dashboard')
      }
    }

    fetchData()
  }, [code, navigate])

  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Failed to get media:', error)
      }
    }

    setupMedia()
  }, [])

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return '#48bb78'
      case 'medium': return '#ed8936'
      case 'high': return '#e53e3e'
      default: return '#718096'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a202c' }}>
      <div style={{ padding: '20px', background: '#2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '24px' }}>Monitor Dashboard - {code}</div>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#4a5568', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{ background: '#2d3748', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Host Video</h3>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', maxWidth: '600px', borderRadius: '8px', transform: 'scaleX(-1)' }} />
          </div>
          <div style={{ background: '#2d3748', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Risk Score</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: getRiskColor(riskLevel) }}>{score}</div>
              <div>
                <div style={{ fontSize: '24px', color: getRiskColor(riskLevel), textTransform: 'uppercase', fontWeight: 'bold' }}>{riskLevel}</div>
                <div style={{ color: '#a0aec0', fontSize: '14px' }}>Risk Level</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '400px', background: '#2d3748', padding: '20px', overflowY: 'auto' }}>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '20px' }}>Live Alerts ({alerts.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((alert, index) => (
              <div key={index} style={{ background: '#1a202c', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${alert.severity === 'high' ? '#e53e3e' : alert.severity === 'medium' ? '#ed8936' : '#48bb78'}` }}>
                <div style={{ color: 'white', fontWeight: '600', marginBottom: '5px' }}>
                  {alert.type.replace(/_/g, ' ').toUpperCase()}
                </div>
                <div style={{ color: '#a0aec0', fontSize: '12px', marginBottom: '5px' }}>
                  Severity: {alert.severity}
                </div>
                <div style={{ color: '#718096', fontSize: '12px' }}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
                {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                  <div style={{ color: '#a0aec0', fontSize: '11px', marginTop: '8px', background: '#2d3748', padding: '8px', borderRadius: '4px' }}>
                    {JSON.stringify(alert.metadata, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Monitor
