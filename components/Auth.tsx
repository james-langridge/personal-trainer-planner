'use client'

import {redirect} from 'next/navigation'
import {useEffect} from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import Loader from '@/components/Loader'
import {loginSuccess} from '@/redux/authSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {setUser} from '@/redux/usersSlice'

export function Auth({initialUser}: {initialUser: string}) {
  const dispatch = useAppDispatch()
  const user: UserWithWorkouts = JSON.parse(initialUser)
  const {isLoggedIn} = useAppSelector(state => state.auth)

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(loginSuccess(user.role))
      dispatch(setUser(user))
      redirect('/calendar')
    }

    if (isLoggedIn) {
      redirect('/calendar')
    }
  }, [dispatch, isLoggedIn, user])

  return <Loader />
}
