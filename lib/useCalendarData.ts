import {useCallback, useState} from 'react'
import {Day, generateCalendarMonth} from '@/lib/calendar'

const now = new Date()
const today = now.getDate()
const thisMonth = now.getMonth()
const thisYear = now.getFullYear()

export default function useCalendarData() {
  const startDay = {
    day: today,
    weekDay: 0,
    month: thisMonth,
    year: thisYear,
  }
  const [startYear, setStartYear] = useState(() => thisYear)
  const [endYear, setEndYear] = useState(() => thisYear)
  const [startMonth, setStartMonth] = useState(() => thisMonth)
  const [endMonth, setEndMonth] = useState(() => thisMonth)
  const [data, setData] = useState<Day[]>(() =>
    generateCalendarMonth(startMonth, startYear),
  )
  const [scrollToThisDay, setScrollThisDay] = useState<Day>(startDay)

  const loadNextMonth = useCallback(() => {
    if (endMonth === 11) {
      const newMonth = 0
      const newYear = endYear + 1

      setData(prevData => [
        ...prevData,
        ...generateCalendarMonth(newMonth, newYear),
      ])
      setEndMonth(newMonth)
      setEndYear(newYear)
    } else {
      const newMonth = endMonth + 1

      setData(prevData => [
        ...prevData,
        ...generateCalendarMonth(newMonth, endYear),
      ])
      setEndMonth(newMonth)
    }
  }, [endMonth, endYear])

  // FIXME: adding a delay to loadPreviousMonth and blocking it is a hacky way to prevent iOS mobile
  //  from scrolling up continuously very fast and loading infinite data when scroll to top of screen.
  //  Seems related: https://github.com/vercel/next.js/issues/28778
  const delay = (time: number) =>
    new Promise(resolve => {
      setTimeout(() => resolve(1), time)
    })

  const loadPreviousMonth = useCallback(async () => {
    if (startMonth === 0) {
      const newMonth = 11
      const newYear = startYear - 1
      const prevMonth = generateCalendarMonth(newMonth, newYear)

      setScrollThisDay(prevMonth[prevMonth.length - 1])
      setData(prevData => [...prevMonth, ...prevData])
      setStartMonth(newMonth)
      setStartYear(newYear)
    } else {
      const newMonth = startMonth - 1
      const prevMonth = generateCalendarMonth(newMonth, startYear)

      setScrollThisDay(prevMonth[prevMonth.length - 1])
      setData(prevData => [...prevMonth, ...prevData])
      setStartMonth(newMonth)
    }

    await delay(500)
  }, [startMonth, startYear])

  return {
    data,
    scrollToThisDay,
    loadNextMonth,
    loadPreviousMonth,
  }
}
