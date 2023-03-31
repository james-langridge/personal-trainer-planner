import React from 'react'
import {generateCalendarMonth, getSessionsToday} from '@/lib/calendar'
import SessionItem from '@/components/calendar/SessionItem'
import {Session} from '@prisma/client'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarGrid({
  year,
  month,
  sessions,
  isAdmin,
  setSessionId,
}: {
  year: number
  month: number
  sessions?: Session[]
  isAdmin: boolean
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
}) {
  const now = new Date()
  const monthData = generateCalendarMonth(month, year)
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDays = Array(firstDayOfMonth).fill(null)

  return (
    <div className="grid h-full w-full grid-cols-calendar grid-rows-calendar divide-x divide-y">
      {emptyDays &&
        emptyDays.map((day, i) => {
          return (
            <div className="text-center" key={i}>
              <div>{dayNames[i]}</div>
            </div>
          )
        })}

      {monthData.map((day, index) => {
        const weekday = new Date(year, month, day.day).toLocaleString(
          'default',
          {
            weekday: 'short',
          },
        )

        const sessionsToday = sessions ? getSessionsToday(sessions, day) : null

        const isToday =
          day.day === now.getDate() &&
          day.month === now.getMonth() &&
          day.year === now.getFullYear()

        return (
          <div className="text-center" key={day.day}>
            {index + firstDayOfMonth < 7 && <div>{weekday}</div>}
            <div
              className={
                'mx-auto w-8 rounded-full p-1' +
                (isToday ? ` bg-blue-900 text-white` : '')
              }
            >
              {day.day}
            </div>
            {sessionsToday &&
              sessionsToday.map((session, i) => {
                return (
                  <SessionItem
                    key={i}
                    session={session}
                    isAdmin={isAdmin}
                    setSessionId={setSessionId}
                  />
                )
              })}
          </div>
        )
      })}
    </div>
  )
}
