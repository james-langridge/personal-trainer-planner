'use client'

import {User} from '@/components/calendar/CalendarDropdown'
import {useCallback, useEffect, useState} from 'react'
import {fetchSessions} from '@/lib/api'
import Calendar from '@/components/calendar/Calendar'
import Sidebar from '@/components/calendar/Sidebar'
import {Session} from '@prisma/client'

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
    <div className="flex h-[90vh]">
      <Sidebar
        setUser={setUser}
        user={user}
        sessionId={sessionId}
        getUserSessions={getUserSessions}
      />
      <Calendar sessions={sessions} isAdmin setSessionId={setSessionId} />
    </div>
  )
}
