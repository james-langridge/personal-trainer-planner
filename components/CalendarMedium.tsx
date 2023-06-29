import React from 'react'

import {CalendarGrid} from '@/components/CalendarGrid'
import {CalendarHeading} from '@/components/CalendarHeading'
import {useCalendarData} from '@/hooks'

export function CalendarMedium() {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  return (
    <>
      <CalendarHeading
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
      />
      <CalendarGrid monthData={monthData} />
    </>
  )
}
