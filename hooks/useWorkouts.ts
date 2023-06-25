import {useCallback, useEffect} from 'react'

import {getUserWithWorkouts} from '@/lib/api'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {setUser} from '@/redux/usersSlice'

type UseUserWorkoutsReturnType = [() => Promise<void>]

export function useWorkouts(): UseUserWorkoutsReturnType {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.users.user)
  const userId = user?.id
  const isAdmin = useAppSelector(state => state.auth.isAdmin)

  const refreshUserWithWorkouts = useCallback(async () => {
    if (!userId) {
      return
    }

    const user = await getUserWithWorkouts(userId)

    dispatch(setUser(user))
  }, [dispatch, userId])

  // Only relevant to admin when changing user
  useEffect(() => {
    if (!isAdmin) {
      return
    }

    void refreshUserWithWorkouts()
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
