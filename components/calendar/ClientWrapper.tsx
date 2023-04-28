import React, {useEffect} from 'react'
import {SerialisedUser} from '@/lib/users'
import {useUserDispatch} from '@/app/(training-app)/Providers'
import {useUserSessions} from '@/hooks'

export default function ClientWrapper({
  children,
  user,
}: {
  children: React.ReactNode
  user?: SerialisedUser
}) {
  const isAdmin = user?.admin
  const dispatchUser = useUserDispatch()
  useUserSessions(isAdmin)

  // Admin starts with blank calendar, and manually selects user
  useEffect(() => {
    if (user && !isAdmin) {
      dispatchUser({type: 'setUser', user: user})
    }
  }, [dispatchUser, isAdmin, user])

  return <div className="flex h-[90vh]">{children}</div>
}
