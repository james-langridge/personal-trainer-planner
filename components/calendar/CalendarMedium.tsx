import React from 'react'

import {CalendarGrid, CalendarHeading} from '@/components/calendar'
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
