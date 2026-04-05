import { useState, useEffect } from 'react'

const useTabDetection = (enabled, onAlert) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1)
        if (onAlert) {
          onAlert({
            type: 'tab_switch',
            severity: 'high',
            metadata: { timestamp: new Date().toISOString() }
          })
        }
      }
    }

    const handleBlur = () => {
      setTabSwitchCount(prev => prev + 1)
      if (onAlert) {
        onAlert({
          type: 'tab_switch',
          severity: 'high',
          metadata: { timestamp: new Date().toISOString(), event: 'blur' }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [enabled, onAlert])

  return { tabSwitchCount }
}

export default useTabDetection
