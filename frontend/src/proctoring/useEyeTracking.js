import { useState, useEffect, useRef } from 'react'
import * as faceapi from 'face-api.js'

const useEyeTracking = (videoRef, enabled, onAlert) => {
  const [gazeDirection, setGazeDirection] = useState('center')
  const [alertCount, setAlertCount] = useState(0)
  const consecutiveOffScreenRef = useRef(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!enabled || !videoRef.current) return

    const loadModels = async () => {
      await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
      await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
    }

    loadModels()

    intervalRef.current = setInterval(async () => {
      if (!videoRef.current) return

      try {
        const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()

        if (detections) {
          const landmarks = detections.landmarks
          const leftEye = landmarks.getLeftEye()
          const rightEye = landmarks.getRightEye()
          const nose = landmarks.getNose()

          const leftEyeCenter = leftEye.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 })
          leftEyeCenter.x /= leftEye.length
          leftEyeCenter.y /= leftEye.length

          const rightEyeCenter = rightEye.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 })
          rightEyeCenter.x /= rightEye.length
          rightEyeCenter.y /= rightEye.length

          const noseCenter = nose[3]

          const eyeCenterX = (leftEyeCenter.x + rightEyeCenter.x) / 2
          const eyeCenterY = (leftEyeCenter.y + rightEyeCenter.y) / 2

          const deltaX = noseCenter.x - eyeCenterX
          const deltaY = noseCenter.y - eyeCenterY

          let direction = 'center'
          if (Math.abs(deltaX) > 15) {
            direction = deltaX > 0 ? 'right' : 'left'
          } else if (deltaY > 10) {
            direction = 'down'
          } else if (deltaY < -10) {
            direction = 'up'
          }

          setGazeDirection(direction)

          if (direction !== 'center') {
            consecutiveOffScreenRef.current++
            if (consecutiveOffScreenRef.current >= 4) {
              setAlertCount(prev => prev + 1)
              if (onAlert) {
                onAlert({
                  type: 'gaze_deviation',
                  severity: 'medium',
                  metadata: { direction, duration: consecutiveOffScreenRef.current * 0.5 }
                })
              }
              consecutiveOffScreenRef.current = 0
            }
          } else {
            consecutiveOffScreenRef.current = 0
          }
        }
      } catch (error) {
        console.error('Eye tracking error:', error)
      }
    }, 500)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, videoRef, onAlert])

  return { gazeDirection, alertCount }
}

export default useEyeTracking
