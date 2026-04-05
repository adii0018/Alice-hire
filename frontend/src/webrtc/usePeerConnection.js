import { useRef, useCallback } from 'react'

const usePeerConnection = (config = {}) => {
  const peerRef = useRef(null)

  const initializePeer = useCallback((onIceCandidate, onTrack) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ],
      iceCandidatePoolSize: 10,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
      ...config
    }

    peerRef.current = new RTCPeerConnection(configuration)

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate && onIceCandidate) {
        onIceCandidate(event.candidate)
      }
    }

    peerRef.current.ontrack = (event) => {
      if (onTrack) {
        onTrack(event.streams[0])
      }
    }

    peerRef.current.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerRef.current.iceConnectionState)
    }

    return peerRef.current
  }, [config])

  const createOffer = useCallback(async () => {
    if (!peerRef.current) return null
    const offer = await peerRef.current.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    await peerRef.current.setLocalDescription(offer)
    return offer
  }, [])

  const createAnswer = useCallback(async () => {
    if (!peerRef.current) return null
    const answer = await peerRef.current.createAnswer()
    await peerRef.current.setLocalDescription(answer)
    return answer
  }, [])

  const setRemoteDesc = useCallback(async (description) => {
    if (!peerRef.current) return
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(description))
  }, [])

  const addIceCandidate = useCallback(async (candidate) => {
    if (!peerRef.current) return
    await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate))
  }, [])

  const addTrack = useCallback((track, stream) => {
    if (!peerRef.current) return
    peerRef.current.addTrack(track, stream)
  }, [])

  const close = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.close()
      peerRef.current = null
    }
  }, [])

  return {
    peerRef,
    initializePeer,
    createOffer,
    createAnswer,
    setRemoteDesc,
    addIceCandidate,
    addTrack,
    close
  }
}

export default usePeerConnection
