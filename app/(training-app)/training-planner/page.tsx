'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {fetchSessions} from '@/lib/api'
import {Session} from '@prisma/client'
import {CalendarDropdown, User} from '@/components/calendar/CalendarDropdown'
import {CalendarForm} from '@/components/calendar/CalendarForm'
import {Calendar} from '@/components/calendar/Calendar'
import {Sidebar} from '@/components/calendar/Sidebar'
import {UserName} from '@/components/calendar/UserName'
import {Container} from '@/components/calendar/Container'

export default function TrainingPlanner() {
  const [user, setUser] = useState<User>()
  const [sessions, setSessions] = useState<Session[]>()
  const [sessionId, setSessionId] = useState('')

  const getUserSessions = useCallback(async () => {
    if (user) {
      const sessions = await fetchSessions(user.id)

      setSessions(sessions)
    }
  }, [user])

  useEffect(() => {
    void getUserSessions()
  }, [getUserSessions, user])

  return (
    <Container>
      <Sidebar>
        <UserName user={user} />
        <CalendarDropdown setUser={setUser} />
        <CalendarForm
          userId={user?.id}
          sessionId={sessionId}
          getUserSessions={getUserSessions}
        />
      </Sidebar>
      <Calendar sessions={sessions} setSessionId={setSessionId} isAdmin />
    </Container>
  )
}
