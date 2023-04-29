import React from 'react'
import {dayNames} from '@/lib/calendar'

export function CalendarEmptyDays({emptyDays}: {emptyDays: null[]}) {
  if (!emptyDays.length) {
    return null
  }

  return (
    <>
      {emptyDays.map((_day, i) => {
        return (
          <div className="border text-center ring-1 ring-gray-400/25" key={i}>
            {/*TODO: localise empty day names?*/}
            <div className="text-xs lg:text-base">{dayNames[i]}</div>
          </div>
        )
      })}
    </>
  )
}
