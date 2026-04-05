import { useState, useEffect } from 'react'

const WEIGHTS = {
  face_missing: 10,
  multiple_faces: 15,
  gaze_deviation: 5,
  tab_switch: 8,
  copy_paste: 12,
  multiple_voices: 7
}

const useRiskScore = (alerts) => {
  const [score, setScore] = useState(0)
  const [riskLevel, setRiskLevel] = useState('low')

  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      setScore(0)
      setRiskLevel('low')
      return
    }

    const totalScore = alerts.reduce((acc, alert) => {
      const weight = WEIGHTS[alert.type] || 5
      return acc + weight
    }, 0)

    const normalizedScore = Math.min(totalScore, 100)
    setScore(normalizedScore)

    if (normalizedScore < 30) {
      setRiskLevel('low')
    } else if (normalizedScore < 60) {
      setRiskLevel('medium')
    } else {
      setRiskLevel('high')
    }
  }, [alerts])

  return { score, riskLevel }
}

export default useRiskScore
