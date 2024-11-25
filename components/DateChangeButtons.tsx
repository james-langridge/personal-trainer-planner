import Link from 'next/link'
import React from 'react'

import {NextMonthBtn} from '@/components/NextMonthBtn'
import {PrevMonthBtn} from '@/components/PrevMonthBtn'
import {monthNames} from '@/lib/constants'

export function DateChangeButtons({
  month,
  year,
  route,
  userId,
}: {
  year: string
  month: string
  route: string
  userId?: string
}) {
  const monthNumber = Number(month)
  const yearNumber = Number(year)
  const monthName = monthNames[Number(month) - 1]

  function next() {
    let nextMonth = monthNumber
    let nextYear = yearNumber

    if (monthNumber === 12) {
      nextMonth = 1
      nextYear = yearNumber + 1
    } else {
      nextMonth = nextMonth + 1
    }

    return `${nextYear}/${nextMonth}/${userId ?? ''}`
  }

  function prev() {
    let prevMonth = monthNumber
    let prevYear = yearNumber

    if (monthNumber === 1) {
      prevMonth = 12
      prevYear = yearNumber - 1
    } else {
      prevMonth = prevMonth - 1
    }

    return `${prevYear}/${prevMonth}/${userId ?? ''}`
  }

  return (
    <div className="flex flex-row items-center py-5 text-2xl">
      <Link href={`/${route}/${prev()}`}>
        <PrevMonthBtn />
      </Link>
      <Link href={`/${route}/${next()}`}>
        <NextMonthBtn />
      </Link>
      <p data-testid={'heading'}>
        {monthName} {year}
      </p>
    </div>
  )
}
