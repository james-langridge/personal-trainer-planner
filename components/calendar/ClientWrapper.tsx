import React, {useEffect} from 'react'
import {SerialisedUser} from '@/lib/users'
import {useUserDispatch} from '@/app/(training-app)/Providers'
import {useUserSessions} from '@/hooks'

export default function ClientWrapper({
  children,
  user,
  isAdmin = false,
}: {
  children: React.ReactNode
  user?: SerialisedUser
  isAdmin?: boolean
}) {
  useUserSessions(isAdmin)
  const dispatchUser = useUserDispatch()

  useEffect(() => {
    if (user) {
      dispatchUser({type: 'setUser', user: user})
    }
  }, [dispatchUser, user])

  return <div className="flex h-[90vh]">{children}</div>
}
