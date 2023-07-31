import {useEffect} from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {loginSuccess, selectIsLoggedIn} from '@/redux/authSlice'
import {useGetUserQuery} from '@/redux/services/users'
import {useAppDispatch, useAppSelector} from '@/redux/store'
import {setUser} from '@/redux/usersSlice'

export function useUser(initialUser: UserWithWorkouts) {
  // TODO: why fetch and cache user here?
  // useGetUserQuery(initialUser.id)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(loginSuccess(initialUser.role))
      dispatch(setUser(initialUser))
    }
  }, [dispatch, isLoggedIn, initialUser])
}
