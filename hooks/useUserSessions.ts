import {getUserWithSessions} from '@/lib/api'
import {useCallback, useEffect} from 'react'
import {
  useAuthDispatch,
  useUser,
  useUserDispatch,
} from '@/app/(training-app)/Providers'

type UseUserSessionsReturnType = [() => Promise<void>]

export function useUserSessions(isAdmin: boolean): UseUserSessionsReturnType {
  const dispatchUser = useUserDispatch()
  const dispatchAuth = useAuthDispatch()
  const userState = useUser()
  const userId = userState?.user?.id ?? ''

  useEffect(() => {
    if (isAdmin) {
      dispatchAuth({type: 'setAuth', isAdmin: isAdmin})
    }
  }, [dispatchAuth, isAdmin])

  const refreshUserWithSessions = useCallback(async () => {
    const user = await getUserWithSessions(userId)

    dispatchUser({type: 'setUser', user: user})
  }, [dispatchUser, userId])

  useEffect(() => {
    if (userId) {
      void refreshUserWithSessions()
    }
  }, [refreshUserWithSessions, userId])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!userId) {
        return
      }

      void refreshUserWithSessions()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [refreshUserWithSessions, userId])

  return [refreshUserWithSessions]
}
