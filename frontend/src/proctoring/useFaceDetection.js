import { useState, useEffect, useRef } from 'react'
import * as faceapi from 'face-api.js'

const useFaceDetection = (videoRef, enabled, onAlert) => {
  const [faceCount, setFaceCount] = useState(0)
  const [isLookingAway, setIsLookingAway] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!enabled || !videoRef.current) return

    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
    }

    loadModels()

    intervalRef.current = setInterval(async () => {
      if (!videoRef.current) return

      try {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
        const count = detections.length

        setFaceCount(count)

        if (count === 0) {
          setIsLookingAway(true)
          if (onAlert) {
            onAlert({
              type: 'face_missing',
              severity: 'high',
              metadata: { faceCount: count }
            })
          }
        } else if (count > 1) {
          setIsLookingAway(false)
          if (onAlert) {
            onAlert({
              type: 'multiple_faces',
              severity: 'high',
              metadata: { faceCount: count }
            })
          }
        } else {
          setIsLookingAway(false)
        }
      } catch (error) {
        console.error('Face detection error:', error)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, videoRef, onAlert])

  return { faceCount, isLookingAway }
}

export default useFaceDetection
