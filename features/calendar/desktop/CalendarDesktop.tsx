import React from 'react'

import {Grid, Heading, useCalendarData} from '@/features/calendar/desktop'

export function CalendarDesktop() {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  return (
    <>
      <Heading
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
      />
      <Grid monthData={monthData} />
    </>
  )
}
