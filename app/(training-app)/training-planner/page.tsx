'use client'

import {User} from '@/components/calendar/CalendarDropdown'
import {useEffect, useState} from 'react'
import {fetchSessions} from '@/lib/api'
import Calendar from '@/components/calendar/Calendar'
import Sidebar from '@/components/calendar/Sidebar'
import {Session} from '@prisma/client'

export default function TrainingPlanner() {
  const [user, setUser] = useState<User>()
  const [sessions, setSessions] = useState<Session[]>()
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    const getUserSessions = async () => {
      if (user) {
        const sessions = await fetchSessions(user.id)

        setSessions(sessions)
      }
    }

    void getUserSessions()
  }, [user])

  return (
    <div className="flex h-[90vh]">
      <Sidebar setUser={setUser} user={user} sessionId={sessionId} />
      <Calendar sessions={sessions} isAdmin setSessionId={setSessionId} />
    </div>
  )
}
