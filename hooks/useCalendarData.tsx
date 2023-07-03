import {useMemo, useState} from 'react'

import {Day} from '@/@types/types'
import {generateCalendarMonth} from '@/lib/calendar'

const now = new Date()

export function useCalendarData() {
  const [year, setYear] = useState(() => now.getFullYear())
  const [month, setMonth] = useState(() => now.getMonth())
  const monthData: Day[] = useMemo(
    () => generateCalendarMonth(month, year),
    [month, year],
  )

  return {
    monthData,
    year,
    setYear,
    month,
    setMonth,
  }
}
