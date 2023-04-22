import {getSessionsByUserId} from '@/lib/api'
import {useCallback, useEffect} from 'react'
import {
  useAuthDispatch,
  useSessionsDispatch,
  useUser,
} from '@/app/(training-app)/training-planner/Providers'

type UseUserSessionsReturnType = [() => Promise<void>]

export function useUserSessions(isAdmin: boolean): UseUserSessionsReturnType {
  const dispatchSessions = useSessionsDispatch()
  const dispatchAuth = useAuthDispatch()
  const userState = useUser()
  const userId = userState?.user?.id ?? ''

  useEffect(() => {
    if (isAdmin) {
      dispatchAuth({type: 'setAuth', isAdmin: isAdmin})
    }
  }, [dispatchAuth, isAdmin])

  const refreshSessions = useCallback(async () => {
    const sessions = await getSessionsByUserId(userId)

    dispatchSessions({type: 'setSessions', sessions: sessions})
  }, [dispatchSessions, userId])

  useEffect(() => {
    if (userId) {
      void refreshSessions()
    }
  }, [refreshSessions, userId])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!userId) {
        return
      }

      void refreshSessions()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [dispatchSessions, refreshSessions, userId])

  return [refreshSessions]
}
