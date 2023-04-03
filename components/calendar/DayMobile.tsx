import Link from 'next/link'
import React, {useEffect, useRef} from 'react'
import {Session} from '@prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'

const now = new Date()

export default function DayMobile({
  dayData,
  sessionsToday,
}: {
  dayData: {day: number; weekDay: number; month: number; year: number}
  sessionsToday:
    | (Session | SessionSerialisedDate | undefined)[]
    | null
    | undefined
}) {
  const dayRef = useRef<HTMLDivElement>(null)
  const {day, month, year} = dayData

  useEffect(() => {
    dayRef.current?.scrollIntoView()
  }, [])

  const weekday = new Date(year, month, day).toLocaleString('default', {
    weekday: 'long',
  })

  const monthName = new Date(year, month, day).toLocaleString('default', {
    month: 'short',
  })

  const isToday =
    day === now.getDate() &&
    month === now.getMonth() &&
    year === now.getFullYear()

  const isTomorrow =
    day === now.getDate() + 1 &&
    month === now.getMonth() &&
    year === now.getFullYear()

  return (
    <div
      ref={isToday ? dayRef : null}
      className={isToday ? 'scroll-mt-16' : ''}
    >
      <hr className="my-6 h-px border-none bg-gray-900 dark:bg-gray-700" />
      <div className="mb-2 flex justify-between text-sm text-gray-500">
        <div className="font-bold">{weekday}</div>
        <div>
          {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : day + ' ' + monthName}
        </div>
      </div>
      {sessionsToday &&
        sessionsToday.map((session, i) => {
          return (
            <div key={session?.id}>
              <Link href={`/session/${session?.id}`} className="my-1 block">
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
}
