import React from 'react'

import {Grid, Header, useCalendarData} from '@/features/calendar/desktop'

export function CalendarDesktop() {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  return (
    <>
      <Header year={year} setYear={setYear} month={month} setMonth={setMonth} />
      <Grid monthData={monthData} />
    </>
  )
}
