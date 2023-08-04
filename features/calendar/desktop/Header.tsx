import React from 'react'

import {monthNames} from '@/lib/constants'
import {selectIsAdmin} from '@/redux/authSlice'
import {useAppSelector} from '@/redux/store'

import {ClientSelect, NextMonthBtn, PrevMonthBtn} from '.'

export function Header({
  year,
  month,
  setYear,
  setMonth,
}: {
  year: number
  month: number
  setYear: React.Dispatch<React.SetStateAction<number>>
  setMonth: React.Dispatch<React.SetStateAction<number>>
}) {
  const isAdmin = useAppSelector(selectIsAdmin)
  const monthName = monthNames[month]

  function decrementMonth() {
    if (month === 0) {
      setMonth(() => 11)
      setYear(year => year - 1)
    } else {
      setMonth(month => month - 1)
    }
  }

  function incrementMonth() {
    if (month === 11) {
      setMonth(() => 0)
      setYear(year => year + 1)
    } else {
      setMonth(month => month + 1)
    }
  }

  return (
    <div className="flex w-full flex-col">
      {isAdmin && <ClientSelect />}
      <div className="flex flex-row items-center py-5 text-2xl">
        <PrevMonthBtn onClick={decrementMonth} />
        <NextMonthBtn onClick={incrementMonth} />
        <p data-testid={'heading'}>
          {monthName} {year}
        </p>
      </div>
    </div>
  )
}
