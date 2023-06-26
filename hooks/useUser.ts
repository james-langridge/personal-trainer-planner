import {useEffect} from 'react'

import {SerialisedUser} from '@/lib/users'
import {useGetUserQuery} from '@/redux/apiSlice'
import {loginSuccess} from '@/redux/authSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {setUser} from '@/redux/usersSlice'

export function useUser(initialUser: SerialisedUser) {
  useGetUserQuery(initialUser.id)
  const {isLoggedIn} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(loginSuccess(initialUser))
      dispatch(setUser(initialUser))
    }
  }, [dispatch, isLoggedIn, initialUser])
}
