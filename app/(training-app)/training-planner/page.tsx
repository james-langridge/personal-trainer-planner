'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {fetchSessions} from '@/lib/api'
import {Session} from '@prisma/client'
import {useCalendarData, useMediaQuery} from '@/hooks'
import {CalendarMobile} from '@/components/calendar/CalendarMobile'
import {CalendarDropdown, User} from '@/components/calendar/CalendarDropdown'
import {CalendarForm} from '@/components/calendar/CalendarForm'
import {Calendar} from '@/components/calendar/Calendar'
import {CalendarDays} from '@/components/calendar/CalendarDays'
import {CalendarEmptyDays} from '@/components/calendar/CalendarEmptyDays'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {Sidebar} from '@/components/calendar/Sidebar'
import {UserName} from '@/components/calendar/UserName'

export default function TrainingPlanner() {
  const [user, setUser] = useState<User>()
  const [sessions, setSessions] = useState<Session[]>()
  const [sessionId, setSessionId] = useState('')
  const {
    calendarSquares,
    emptyDays,
    monthData,
    year,
    month,
    setYear,
    setMonth,
  } = useCalendarData()
  const isMobile = useMediaQuery('(max-width: 639px)')

  const getUserSessions = useCallback(async () => {
    if (user) {
      const sessions = await fetchSessions(user.id)

      setSessions(sessions)
    }
  }, [user])

  useEffect(() => {
    void getUserSessions()
  }, [getUserSessions, user])

  useEffect(() => {
    // Lock scroll for large screens
    if (!isMobile) document.body.style.overflow = 'hidden'
    if (isMobile) document.body.style.overflow = 'visible'
  }, [isMobile])

  return (
    <div className="flex h-[90vh]">
      <Sidebar>
        <UserName user={user} />
        <CalendarDropdown setUser={setUser} />
        <CalendarForm
          userId={user?.id}
          sessionId={sessionId}
          getUserSessions={getUserSessions}
        />
      </Sidebar>
      <Calendar>
        {isMobile && <CalendarMobile sessions={sessions} />}

        {!isMobile && (
          <>
            <CalendarHeading
              year={year}
              setYear={setYear}
              month={month}
              setMonth={setMonth}
            />
            <CalendarGrid calendarSquares={calendarSquares}>
              <CalendarEmptyDays emptyDays={emptyDays} />
              <CalendarDays
                monthData={monthData}
                sessions={sessions}
                isAdmin
                setSessionId={setSessionId}
              />
            </CalendarGrid>
          </>
        )}
      </Calendar>
    </div>
  )
}
