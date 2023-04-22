import React, {useEffect} from 'react'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {SerialisedUser} from '@/lib/users'
import {
  useSessionsDispatch,
  useUserDispatch,
} from '@/app/(training-app)/training-planner/Providers'

export default function ClientWrapper({
  children,
  sessions,
  user,
}: {
  children: React.ReactNode
  sessions?: SerialisedSession[]
  user?: SerialisedUser
}) {
  const dispatchUser = useUserDispatch()
  const dispatchSessions = useSessionsDispatch()

  useEffect(() => {
    if (sessions) {
      dispatchSessions({type: 'setSessions', sessions: sessions})
    }

    if (user) {
      dispatchUser({type: 'setUser', user: user})
    }
  }, [dispatchSessions, dispatchUser, sessions, user])

  return <>{children}</>
}
