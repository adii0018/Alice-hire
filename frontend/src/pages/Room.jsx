import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import usePeerConnection from '../webrtc/usePeerConnection'
import useSignaling from '../webrtc/useSignaling'
import useEyeTracking from '../proctoring/useEyeTracking'
import useFaceDetection from '../proctoring/useFaceDetection'
import useVoiceAnalysis from '../proctoring/useVoiceAnalysis'
import useTabDetection from '../proctoring/useTabDetection'
import useCopyPaste from '../proctoring/useCopyPaste'
import api from '../api/axios'

const Room = () => {
  const { code } = useParams()
  const navigate = useNavigate()
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [config, setConfig] = useState({})
  const [isHost, setIsHost] = useState(false)

  const { initializePeer, createOffer, createAnswer, setRemoteDesc, addIceCandidate, addTrack, close } = usePeerConnection()

  const handleAlert = async (alert) => {
    try {
      await api.post('/alerts/', {
        session_code: code,
        ...alert
      })
    } catch (error) {
      console.error('Failed to send alert:', error)
    }
  }

  useEyeTracking(localVideoRef, config.eyeTracking, handleAlert)
  useFaceDetection(localVideoRef, config.faceDetection, handleAlert)
  useVoiceAnalysis(config.voiceAnalysis, handleAlert)
  useTabDetection(config.tabDetection, handleAlert)
  useCopyPaste(config.copyPaste, handleAlert)

  const signalingHandlers = {
    onPeerJoined: async () => {
      if (isHost) {
        const offer = await createOffer()
        sendOffer(offer)
      }
    },
    onOffer: async (offer) => {
      await setRemoteDesc(offer)
      const answer = await createAnswer()
      sendAnswer(answer)
    },
    onAnswer: async (answer) => {
      await setRemoteDesc(answer)
    },
    onIce: async (candidate) => {
      await addIceCandidate(candidate)
    }
  }

  const { sendOffer, sendAnswer, sendIce } = useSignaling(code, 'participant', signalingHandlers)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await api.get(`/sessions/${code}/`)
        setConfig(response.data.config)
        const user = JSON.parse(localStorage.getItem('user'))
        setIsHost(response.data.host === user?.id)
      } catch (error) {
        console.error('Failed to fetch session:', error)
        navigate('/dashboard')
      }
    }

    fetchSession()
  }, [code, navigate])

  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        initializePeer(
          (candidate) => sendIce(candidate),
          (stream) => {
            setRemoteStream(stream)
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = stream
            }
          }
        )

        stream.getTracks().forEach(track => addTrack(track, stream))
      } catch (error) {
        console.error('Failed to get media:', error)
      }
    }

    setupMedia()

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
      close()
    }
  }, [])

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    close()
    navigate('/dashboard')
  }

  const hasProctoring = Object.values(config).some(v => v === true)

  return (
    <div style={{ height: '100vh', background: '#1a202c', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', background: '#2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '20px' }}>Session: {code}</div>
        {hasProctoring && (
          <div style={{ color: '#fc8181', fontSize: '14px' }}>🔴 Proctoring Active</div>
        )}
      </div>
      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }} />
        <video ref={localVideoRef} autoPlay playsInline muted style={{ position: 'absolute', bottom: '20px', right: '20px', width: '240px', height: '180px', borderRadius: '8px', border: '2px solid white', objectFit: 'cover', transform: 'scaleX(-1)' }} />
      </div>
      <div style={{ padding: '20px', background: '#2d3748', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={toggleMute} style={{ padding: '12px 24px', background: isMuted ? '#e53e3e' : '#4a5568', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          {isMuted ? '🔇 Unmute' : '🎤 Mute'}
        </button>
        <button onClick={toggleVideo} style={{ padding: '12px 24px', background: isVideoOff ? '#e53e3e' : '#4a5568', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          {isVideoOff ? '📹 Show Video' : '📹 Hide Video'}
        </button>
        <button onClick={endCall} style={{ padding: '12px 24px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          ❌ End Call
        </button>
      </div>
    </div>
  )
}

export default Room
