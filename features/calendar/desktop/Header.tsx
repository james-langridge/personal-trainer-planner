import React from 'react'

import {DateChangeButtons} from '@/components/DateChangeButtons'
import {selectIsAdmin} from '@/redux/authSlice'
import {useAppSelector} from '@/redux/store'

import {ClientSelect} from '.'

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

  return (
    <div className="flex w-full flex-col">
      {isAdmin && <ClientSelect />}
      <DateChangeButtons
        year={year}
        month={month}
        setYear={setYear}
        setMonth={setMonth}
      />
    </div>
  )
}
