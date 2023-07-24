import clsx from 'clsx'
import React from 'react'

import {Day} from '@/@types/types'
import {
  getMonthName,
  getLongWeekday,
  isDayToday,
  isDayTomorrow,
} from '@/lib/calendar'

export function DayMobile({
  children,
  dayData,
}: {
  children: React.ReactNode
  dayData: Day
}) {
  const isToday = isDayToday(dayData)
  const isTomorrow = isDayTomorrow(dayData)
  const weekday = getLongWeekday(dayData)
  const monthName = getMonthName(dayData)

  return (
    <div className={clsx({'scroll-mt-16': isToday})}>
      <hr className="my-6 h-px border-none bg-gray-900 dark:bg-gray-700" />
      <div className="mb-2 flex justify-between text-sm text-gray-500">
        <div className="font-bold">{weekday}</div>
        <div>
          {isToday
            ? 'Today'
            : isTomorrow
            ? 'Tomorrow'
            : dayData.day + ' ' + monthName}
        </div>
      </div>
      {children}
    </div>
  )
}
