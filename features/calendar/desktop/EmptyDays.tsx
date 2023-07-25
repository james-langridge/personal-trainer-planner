import React from 'react'

import {dayNames} from '@/lib/constants'

export function EmptyDays({emptyDays}: {emptyDays: null[]}) {
  if (!emptyDays.length) {
    return null
  }

  return (
    <>
      {emptyDays.map((_day, i) => {
        return (
          <div className="border text-center ring-1 ring-gray-400/25" key={i}>
            <div className="text-xs lg:text-base">{dayNames[i]}</div>
          </div>
        )
      })}
    </>
  )
}
