import {useEffect} from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {useGetUserQuery} from '@/redux/apiSlice'
import {loginSuccess, selectIsLoggedIn} from '@/redux/authSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {setUser} from '@/redux/usersSlice'

export function useUser(initialUser: UserWithWorkouts) {
  // TODO: why fetch and cache user here?
  useGetUserQuery(initialUser.id)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(loginSuccess(initialUser.role))
      dispatch(setUser(initialUser))
    }
  }, [dispatch, isLoggedIn, initialUser])
}
