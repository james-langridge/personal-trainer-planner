import {useState} from 'react'
import {Mode, Status} from '@/components/Info'

export type StatusHook = {
  status: Status
  error?: Error
  setStatus: (status: Status) => void
  setError: (error?: Error) => void
  mode: Mode | undefined
  setMode: (mode: Mode) => void
  resetStatus: () => void
}

export function useStatus(initialStatus: Status = 'idle'): StatusHook {
  const [status, setStatus] = useState(initialStatus)
  const [error, setError] = useState<Error>()
  const [mode, setMode] = useState<Mode>()

  const resetStatus = () => {
    setStatus('idle')
    setError(undefined)
  }

  return {status, error, setStatus, setError, mode, setMode, resetStatus}
}
