'use client'

import {User} from '@/components/CalendarDropdown'
import {useEffect, useState} from 'react'
import {fetchUser} from '@/lib/api'
import Calendar from '@/components/Calendar'
import Sidebar from '@/components/Sidebar'
import {Session} from '@prisma/client'

export default function TrainingPlanner() {
  const [user, setUser] = useState<User>()
  const [sessions, setSessions] = useState<Session[]>()

  useEffect(() => {
    const getUserSessions = async () => {
      if (user) {
        const {sessions} = await fetchUser(user.id)

        setSessions(sessions)
      }
    }

    void getUserSessions()
  }, [user])

  return (
    <div className="flex">
      <Sidebar setUser={setUser} user={user} />
      <Calendar sessions={sessions} isAdmin />
    </div>
  )
}
