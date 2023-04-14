import {useState, useCallback, useEffect} from 'react'
import {SESSION_STATUS} from '.prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {Session} from '@prisma/client'
import {updateSession} from '@/lib/api'

export function useSessionStatus(session: Session | SessionSerialisedDate) {
  const [status, setStatus] = useState(session.status)
  const [isFirstRender, setIsFirstRender] = useState(true)

  const updateStatus = useCallback(async () => {
    await updateSession({
      sessionId: session.id,
      status: status,
    })
  }, [session.id, status])

  useEffect(() => {
    // Added this check to avoid making PUT reqs when the checkbox is checked on the first render
    if (isFirstRender) {
      setIsFirstRender(false)

      return
    }

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
