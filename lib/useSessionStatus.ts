import {useState, useCallback, useEffect} from 'react'
import {SESSION_STATUS} from '.prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {Session} from '@prisma/client'

export function useSessionStatus(
  session: Session | SessionSerialisedDate,
  updateSession: any,
) {
  const [status, setStatus] = useState(session.status)

  const updateStatus = useCallback(async () => {
    await updateSession({
      sessionId: session.id,
      status: status,
    })
  }, [session.id, status, updateSession])

  useEffect(() => {
    void updateStatus()
  }, [status, updateStatus])

  function toggleStatus() {
    if (status === SESSION_STATUS.NOT_STARTED) {
      setStatus(SESSION_STATUS.COMPLETED)
    } else {
      setStatus(SESSION_STATUS.NOT_STARTED)
    }
  }

  return {status, toggleStatus}
}
