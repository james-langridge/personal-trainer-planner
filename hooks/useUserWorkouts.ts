import {useCallback, useEffect} from 'react'

import {useUser, useUserDispatch} from '@/app/Providers'
import {getUserWithWorkouts} from '@/lib/api'
import {SerialisedUser} from '@/lib/users'

type UseUserWorkoutsReturnType = [() => Promise<void>]

export function useUserWorkouts({
  initialUser,
}: {
  initialUser?: SerialisedUser
} = {}): UseUserWorkoutsReturnType {
  const dispatchUser = useUserDispatch()
  const {user} = useUser()
  const userId = user?.id
  const isAdmin = user?.role === 'admin'

  const refreshUserWithWorkouts = useCallback(async () => {
    const user = await getUserWithWorkouts(userId)

    dispatchUser({type: 'setUser', user: user})
  }, [dispatchUser, userId])

  // Admin starts with blank calendar, and manually selects user
  useEffect(() => {
    if (initialUser && initialUser.role !== 'admin') {
      dispatchUser({type: 'setUser', user: initialUser})
    }
  }, [dispatchUser, initialUser])

  // Only relevant to admin when changing user
  useEffect(() => {
    if (!isAdmin) {
      return
    }

    if (userId) {
      void refreshUserWithWorkouts()
    }
  }, [isAdmin, refreshUserWithWorkouts, userId])

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
