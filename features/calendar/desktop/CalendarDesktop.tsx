import React from 'react'

import {Grid, Header, useCalendarData} from '.'

export default function CalendarDesktop() {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  return (
    <>
      <Header year={year} setYear={setYear} month={month} setMonth={setMonth} />
      <Grid monthData={monthData} />
    </>
  )
}
