'use client'

import CalendarDropdown, {User} from '@/components/CalendarDropdown'
import {useEffect, useState} from 'react'
import {fetchUser} from '@/lib/api'
import Calendar from '@/components/Calendar'

export default function TrainingPlanner() {
  const [user, setUser] = useState<User>()
  const [sessions, setSessions] = useState()

  useEffect(() => {
    const getUserSessions = async () => {
      if (user) {
        const userSessions = await fetchUser(user.id)

        setSessions(userSessions)
      }
    }

    void getUserSessions()
  }, [user])

  return (
    <>
      <div className="flex justify-end gap-x-2 p-5">
        <div className="self-center">
          {user?.firstName} {user?.lastName}
        </div>
        <CalendarDropdown setUser={setUser} />
      </div>
      <Calendar sessions={sessions} isAdmin user={user?.firstName} />
    </>
  )
}
