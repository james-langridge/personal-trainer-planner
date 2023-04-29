import React from 'react'
import {Day, getShortWeekday, isDayToday} from '@/lib/calendar'

export function CalendarDay({
  day,
  isFirstWeek,
  children,
}: {
  day: Day
  isFirstWeek: boolean
  children: React.ReactNode
}) {
  const weekday = getShortWeekday(day)
  const isToday = isDayToday(day)

  return (
    <div
      className="border text-center ring-1 ring-gray-400/25"
      key={day.day + day.year + day.month}
    >
      {isFirstWeek && <div className="text-xs lg:text-base">{weekday}</div>}
      <div
        className={
          'mx-auto w-6 rounded-full p-1 text-xs lg:w-8 lg:text-base' +
          (isToday ? ` bg-blue-900 text-white` : '')
        }
      >
        {day.day}
      </div>
      {children}
    </div>
  )
}
