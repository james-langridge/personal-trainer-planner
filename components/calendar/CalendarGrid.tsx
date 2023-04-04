import React, {useMemo} from 'react'
import {
  generateCalendarMonth,
  getSessionsToday,
  getShortWeekday,
  isDayToday,
} from '@/lib/calendar'
import SessionItem from '@/components/calendar/SessionItem'
import {Session} from '@prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

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
  sessions?: Session[] | SessionSerialisedDate[]
  isAdmin: boolean
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
}) {
  const monthData = useMemo(
    () => generateCalendarMonth(month, year),
    [month, year],
  )
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDays = Array(firstDayOfMonth).fill(null)
  const calendarSquares = firstDayOfMonth + monthData.length

  return (
    <div
      className={classNames(
        calendarSquares > 35 ? 'grid-rows-calendar-6' : 'grid-rows-calendar-5',
        'grid h-full w-full grid-cols-calendar ring-offset-1',
      )}
    >
      {emptyDays &&
        emptyDays.map((day, i) => {
          return (
            <div className="border text-center ring-1 ring-gray-400/25" key={i}>
              {/*TODO: localise empty day  names?*/}
              <div className="text-xs lg:text-base">{dayNames[i]}</div>
            </div>
          )
        })}

      {monthData.map((day, index) => {
        const weekday = getShortWeekday(day)
        const sessionsToday = sessions ? getSessionsToday(sessions, day) : null
        const isToday = isDayToday(day)

        return (
          <div
            className="border text-center ring-1 ring-gray-400/25"
            key={day.day}
          >
            {index + firstDayOfMonth < 7 && (
              <div className="text-xs lg:text-base">{weekday}</div>
            )}
            <div
              className={
                'mx-auto w-6 rounded-full p-1 text-xs lg:w-8 lg:text-base' +
                (isToday ? ` bg-blue-900 text-white` : '')
              }
            >
              {day.day}
            </div>
            {sessionsToday &&
              sessionsToday.map(session => {
                return (
                  <SessionItem
                    key={session?.id}
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
