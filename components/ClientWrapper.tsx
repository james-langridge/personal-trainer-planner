'use client'

import {useSession} from 'next-auth/react'
import React, {useEffect} from 'react'

import {useUserDispatch} from '@/app/Providers'
import {useUserWorkouts} from '@/hooks'
import {SerialisedUser} from '@/lib/users'

// TODO: get rid of this component?
//  it just sets the user in client side state, but this can be server side
export default function ClientWrapper({
  children,
  user,
}: {
  children: React.ReactNode
  user: SerialisedUser
}) {
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const dispatchUser = useUserDispatch()
  useUserWorkouts()

  // Admin starts with blank calendar, and manually selects user
  useEffect(() => {
    if (user && !isAdmin) {
      dispatchUser({type: 'setUser', user: user})
    }
  }, [dispatchUser, isAdmin, user])

  return <div className="flex h-[90vh]">{children}</div>
}
