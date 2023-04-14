import React from 'react'
import {classNames} from '@/lib/misc'

export function CalendarGrid({
  calendarSquares,
  children,
}: {
  calendarSquares: number
  children: React.ReactNode
}) {
  return (
    <div
      className={classNames(
        calendarSquares > 35 ? 'grid-rows-calendar-6' : 'grid-rows-calendar-5',
        'grid h-full w-full grid-cols-calendar ring-offset-1',
      )}
    >
      {children}
    </div>
  )
}
