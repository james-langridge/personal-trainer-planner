import {useEffect} from 'react'

import {SerialisedUser} from '@/@types/apiResponseTypes'
import {loginSuccess, selectIsLoggedIn} from '@/redux/authSlice'
import {useGetUserQuery} from '@/redux/services/users'
import {useAppDispatch, useAppSelector} from '@/redux/store'
import {setUser} from '@/redux/usersSlice'

export function useUser(initialUser: SerialisedUser) {
  // TODO: why fetch and cache user here?
  // So it's cached by RTK Query and updated when mutated
  // TODO: then why save user in redux below?
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
