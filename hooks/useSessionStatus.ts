import {useState, useEffect, useCallback} from 'react'
import {SESSION_STATUS} from '.prisma/client'
import {updateSession} from '@/lib/api'
import {SerialisedSession} from '@/lib/sessions'

export function useSessionStatus(session: SerialisedSession) {
  const [status, setStatus] = useState(session.status)

  const updateStatus = useCallback(
    async (status: SESSION_STATUS) => {
      await updateSession({
        sessionId: session.id,
        status: status,
      })
    },
    [session.id],
  )

  useEffect(() => {
    setStatus(session.status)
  }, [session.status])

  function toggleStatus() {
    if (status === SESSION_STATUS.NOT_STARTED) {
      void updateStatus(SESSION_STATUS.COMPLETED)
      setStatus(SESSION_STATUS.COMPLETED)
    } else {
      void updateStatus(SESSION_STATUS.NOT_STARTED)
      setStatus(SESSION_STATUS.NOT_STARTED)
    }
  }

  return {status, toggleStatus}
}
