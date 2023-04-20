'use client'

import React, {useState} from 'react'
import {CalendarDropdown} from '@/components/calendar/CalendarDropdown'
import {CalendarForm} from '@/components/calendar/CalendarForm'
import {Sidebar} from '@/components/calendar/Sidebar'
import {UserName} from '@/components/calendar/UserName'
import {Container} from '@/components/calendar/Container'
import {useCalendarData, useLockBodyScroll, useUserSessions} from '@/hooks'
import {SerialisedUser} from '@/lib/users'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import {CalendarEmptyDays} from '@/components/calendar/CalendarEmptyDays'
import {getSessionsToday} from '@/lib/calendar'
import {CalendarDay} from '@/components/calendar/CalendarDay'
import {SessionItem} from '@/components/calendar/SessionItem'

export default function TrainingPlanner() {
  const [user, setUser] = useState<SerialisedUser>()
  const [sessionId, setSessionId] = useState('')
  const userId = user?.id
  const {sessions, fetchSessions} = useUserSessions(userId)
  const {
    calendarSquares,
    emptyDays,
    monthData,
    year,
    month,
    setYear,
    setMonth,
  } = useCalendarData()
  const firstDayOfMonth = monthData[0].weekDay
  useLockBodyScroll()

  return (
    <Container>
      <Sidebar>
        <UserName firstName={user?.firstName} lastName={user?.lastName} />
        <CalendarDropdown setUser={setUser} />
        <CalendarForm
          userId={userId}
          sessionId={sessionId}
          getUserSessions={fetchSessions}
        />
      </Sidebar>
      <div className="flex w-full flex-col px-5 sm:items-center ">
        <CalendarHeading
          year={year}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
        />
        <CalendarGrid calendarSquares={calendarSquares}>
          <CalendarEmptyDays emptyDays={emptyDays} />
          {monthData.map((day, index) => {
            const sessionsToday = sessions
              ? getSessionsToday(sessions, day)
              : null
            const isFirstWeek = index + firstDayOfMonth < 7

            return (
              <CalendarDay day={day} isFirstWeek={isFirstWeek} key={index}>
                {sessionsToday &&
                  sessionsToday.map((session, i) => {
                    return (
                      <div key={day.day * day.year * day.month * i}>
                        {session && (
                          <SessionItem
                            session={session}
                            isAdmin
                            setSessionId={setSessionId}
                          />
                        )}
                      </div>
                    )
                  })}
              </CalendarDay>
            )
          })}
        </CalendarGrid>
      </div>
    </Container>
  )
}
