import {Session} from '@prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import React, {useEffect, useRef} from 'react'
import {generateCalendarMonth, getSessionsToday} from '@/lib/calendar'
import Link from 'next/link'

export default function CalendarMobile({
  sessions,
}: {
  sessions?: Session[] | SessionSerialisedDate[]
}) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthData = generateCalendarMonth(month, year)
  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    myRef.current?.scrollIntoView()
  }, [])

  return (
    <div className="p-5">
      {monthData.map(day => {
        const weekday = new Date(year, month, day.day).toLocaleString(
          'default',
          {
            weekday: 'long',
          },
        )

        const monthname = new Date(year, month, day.day).toLocaleString(
          'default',
          {
            month: 'short',
          },
        )

        const sessionsToday = sessions ? getSessionsToday(sessions, day) : null

        const isToday =
          day.day === now.getDate() &&
          day.month === now.getMonth() &&
          day.year === now.getFullYear()

        const isTomorrow =
          day.day === now.getDate() + 1 &&
          day.month === now.getMonth() &&
          day.year === now.getFullYear()

        return (
          <div
            key={day.day}
            ref={isToday ? myRef : null}
            className={isToday ? 'scroll-mt-16' : ''}
          >
            <hr className="my-6 h-px border-none bg-gray-900 dark:bg-gray-700" />
            <div className="mb-2 flex justify-between text-sm text-gray-500">
              <div className="font-bold">{weekday}</div>
              <div>
                {isToday
                  ? 'Today'
                  : isTomorrow
                  ? 'Tomorrow'
                  : day.day + ' ' + monthname}
              </div>
            </div>
            {sessionsToday &&
              sessionsToday.map((session, i) => {
                return (
                  <div key={session?.id}>
                    <Link
                      href={`/session/${session?.id}`}
                      className="my-1 block"
                    >
                      {session?.name}
                    </Link>
                    {i < sessionsToday.length - 1 && (
                      <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}
