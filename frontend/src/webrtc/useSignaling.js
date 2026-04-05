import { useEffect, useRef, useCallback } from 'react'

const useSignaling = (sessionCode, role, handlers) => {
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const connect = useCallback(() => {
    const token = localStorage.getItem('access_token')
    const ws = new WebSocket(`ws://localhost:8000/ws/session/${sessionCode}/?token=${token}`)

    ws.onopen = () => {
      console.log('WebSocket connected')
      if (handlers.onOpen) handlers.onOpen()
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const { type } = data

      switch (type) {
        case 'peer_joined':
          if (handlers.onPeerJoined) handlers.onPeerJoined(data)
          break
        case 'peer_left':
          if (handlers.onPeerLeft) handlers.onPeerLeft(data)
          break
        case 'offer':
          if (handlers.onOffer) handlers.onOffer(data.offer)
          break
        case 'answer':
          if (handlers.onAnswer) handlers.onAnswer(data.answer)
          break
        case 'ice':
          if (handlers.onIce) handlers.onIce(data.candidate)
          break
        case 'alert_update':
          if (handlers.onAlertUpdate) handlers.onAlertUpdate(data.alert)
          break
        default:
          console.log('Unknown message type:', type)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Reconnecting...')
        connect()
      }, 3000)
    }

    wsRef.current = ws
  }, [sessionCode, handlers])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  const sendOffer = useCallback((offer) => {
    sendMessage({ type: 'offer', offer })
  }, [sendMessage])

  const sendAnswer = useCallback((answer) => {
    sendMessage({ type: 'answer', answer })
  }, [sendMessage])

  const sendIce = useCallback((candidate) => {
    sendMessage({ type: 'ice', candidate })
  }, [sendMessage])

  return {
    sendOffer,
    sendAnswer,
    sendIce,
    sendMessage
  }
}

export default useSignaling
