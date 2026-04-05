import { useState, useEffect, useRef } from 'react'

const useVoiceAnalysis = (enabled, onAlert) => {
  const [noiseLevel, setNoiseLevel] = useState(0)
  const [multipleVoicesDetected, setMultipleVoicesDetected] = useState(false)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const suspiciousCountRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 2048
        source.connect(analyserRef.current)

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

        const checkAudio = () => {
          if (!analyserRef.current) return

          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setNoiseLevel(average)

          if (average > 80) {
            suspiciousCountRef.current++
            if (suspiciousCountRef.current >= 6) {
              setMultipleVoicesDetected(true)
              if (onAlert) {
                onAlert({
                  type: 'multiple_voices',
                  severity: 'medium',
                  metadata: { noiseLevel: average }
                })
              }
              suspiciousCountRef.current = 0
            }
          } else {
            suspiciousCountRef.current = 0
            setMultipleVoicesDetected(false)
          }

          requestAnimationFrame(checkAudio)
        }

        checkAudio()
      } catch (error) {
        console.error('Voice analysis error:', error)
      }
    }

    setupAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [enabled, onAlert])

  return { noiseLevel, multipleVoicesDetected }
}

export default useVoiceAnalysis
