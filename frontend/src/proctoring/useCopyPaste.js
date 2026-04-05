import { useState, useEffect } from 'react'

const useCopyPaste = (enabled, onAlert) => {
  const [eventLog, setEventLog] = useState([])

  useEffect(() => {
    if (!enabled) return

    const handleCopy = (e) => {
      const event = { type: 'copy', timestamp: new Date().toISOString() }
      setEventLog(prev => [...prev, event])
      if (onAlert) {
        onAlert({
          type: 'copy_paste',
          severity: 'high',
          metadata: event
        })
      }
    }

    const handlePaste = (e) => {
      const event = { type: 'paste', timestamp: new Date().toISOString() }
      setEventLog(prev => [...prev, event])
      if (onAlert) {
        onAlert({
          type: 'copy_paste',
          severity: 'high',
          metadata: event
        })
      }
    }

    const handleCut = (e) => {
      const event = { type: 'cut', timestamp: new Date().toISOString() }
      setEventLog(prev => [...prev, event])
      if (onAlert) {
        onAlert({
          type: 'copy_paste',
          severity: 'high',
          metadata: event
        })
      }
    }

    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('cut', handleCut)

    return () => {
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('cut', handleCut)
    }
  }, [enabled, onAlert])

  return { eventLog }
}

export default useCopyPaste
