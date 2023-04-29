import {getUserWithWorkouts} from '@/lib/api'
import {useCallback, useEffect} from 'react'
import {useUser, useUserDispatch} from '@/app/Providers'

type UseUserWorkoutsReturnType = [() => Promise<void>]

export function useUserWorkouts(): UseUserWorkoutsReturnType {
  const dispatchUser = useUserDispatch()
  const userState = useUser()
  const userId = userState?.user?.id ?? ''

  const refreshUserWithWorkouts = useCallback(async () => {
    const user = await getUserWithWorkouts(userId)

    dispatchUser({type: 'setUser', user: user})
  }, [dispatchUser, userId])

  useEffect(() => {
    if (userId) {
      void refreshUserWithWorkouts()
    }
  }, [refreshUserWithWorkouts, userId])

  // This is to sync updates between users (personal trainer and their clients)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!userId) {
        return
      }

      void refreshUserWithWorkouts()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [refreshUserWithWorkouts, userId])

  return [refreshUserWithWorkouts]
}
