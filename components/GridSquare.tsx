'use client'

import React from 'react'

// TODO: Admin can add training sessions to the day by clicking the day
export default function GridSquare({
  children,
  day,
  isAdmin = false,
}: {
  children?: React.ReactNode
  day?: {day: number; weekDay: number; month: number; year: number}
  isAdmin?: boolean
}) {
  const squareDay = day ? new Date(day.year, day.month, day.day) : null

  function clickHandler() {
    if (!isAdmin) {
      return
    }

    alert(`Clicked: ${squareDay}`)
  }

  return (
    <div
      className="h-40 text-center"
      onClick={clickHandler}
      onKeyDown={clickHandler}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  )
}
