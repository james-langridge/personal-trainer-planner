import React, {useState, useEffect, useCallback, useRef} from 'react'
import {Session} from '@prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {generateCalendarMonth, getSessionsToday} from '@/lib/calendar'
import DayMobile from '@/components/calendar/DayMobile'
import useIntersectionObserver from '@/lib/useIntersectionObserver'

const InfiniteScrollCalendar = ({
  sessions,
}: {
  sessions?: Session[] | SessionSerialisedDate[]
}) => {
  const now = new Date()
  const [startYear, setStartYear] = useState(() => now.getFullYear())
  const [endYear, setEndYear] = useState(startYear)
  const [startMonth, setStartMonth] = useState(() => now.getMonth())
  const [endMonth, setEndMonth] = useState(startMonth)
  const [data, setData] = useState(() =>
    generateCalendarMonth(startMonth, startYear),
  )
  const startElementRef = useRef(null)
  const endElementRef = useRef(null)
  const startEntry = useIntersectionObserver(startElementRef, {})
  const endEntry = useIntersectionObserver(endElementRef, {})
  const isStartVisible = !!startEntry?.isIntersecting
  const isEndVisible = !!endEntry?.isIntersecting

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

  const loadPreviousMonth = useCallback(() => {
    if (startMonth === 0) {
      const newMonth = 11
      const newYear = startYear - 1

      setData(prevData => [
        ...generateCalendarMonth(newMonth, newYear),
        ...prevData,
      ])
      setStartMonth(newMonth)
      setStartYear(newYear)
    } else {
      const newMonth = startMonth - 1

      setData(prevData => [
        ...generateCalendarMonth(newMonth, startYear),
        ...prevData,
      ])
      setStartMonth(newMonth)
    }
  }, [startMonth, startYear])

  useEffect(() => {
    if (isEndVisible) loadNextMonth()
    if (isStartVisible) loadPreviousMonth()
  }, [isStartVisible, isEndVisible, loadNextMonth, loadPreviousMonth])

  return (
    <div className="p-5">
      <div ref={startElementRef}></div>
      {data.map(day => {
        const sessionsToday = sessions ? getSessionsToday(sessions, day) : null

        return (
          <DayMobile
            key={`${day.day}-${day.month}-${day.year}`}
            dayData={day}
            sessionsToday={sessionsToday}
          />
        )
      })}
      <div ref={endElementRef}></div>
    </div>
  )
}

export default InfiniteScrollCalendar
