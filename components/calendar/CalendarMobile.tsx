import React, {useState, useEffect, useCallback, useRef} from 'react'
import {Session} from '@prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {generateCalendarMonth, getSessionsToday} from '@/lib/calendar'
import DayMobile from '@/components/calendar/DayMobile'
import useIntersectionObserver from '@/lib/useIntersectionObserver'

export type Day = {
  day: number
  weekDay: number
  month: number
  year: number
}

const now = new Date()
const today = now.getDate()
const thisMonth = now.getMonth()
const thisYear = now.getFullYear()
const startDay = {day: today, weekDay: 0, month: thisMonth, year: thisYear}

export default function CalendarMobile({
  sessions,
}: {
  sessions?: Session[] | SessionSerialisedDate[]
}) {
  const [startYear, setStartYear] = useState(() => thisYear)
  const [isFrozen, setIsFrozen] = useState(false)
  const [endYear, setEndYear] = useState(startYear)
  const [startMonth, setStartMonth] = useState(() => thisMonth)
  const [endMonth, setEndMonth] = useState(startMonth)
  const [data, setData] = useState<Day[]>(() =>
    generateCalendarMonth(startMonth, startYear),
  )
  const startElementRef = useRef<HTMLDivElement>(null)
  const endElementRef = useRef(null)
  const scrollToRef = useRef<HTMLDivElement>(null)
  const startEntry = useIntersectionObserver(startElementRef, {})
  const endEntry = useIntersectionObserver(endElementRef, {})
  const isStartVisible = !!startEntry?.isIntersecting
  const isEndVisible = !!endEntry?.isIntersecting
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

  useEffect(() => {
    async function loadPrev() {
      setIsFrozen(true)
      await loadPreviousMonth()
      setIsFrozen(false)
    }

    if (isStartVisible && !isFrozen) {
      void loadPrev()
    }
  }, [isFrozen, isStartVisible, loadPreviousMonth])

  useEffect(() => {
    if (isEndVisible) loadNextMonth()
  }, [isEndVisible, loadNextMonth])

  function shouldScrollToThisDay(dayFoo: {
    day: number
    weekDay: number
    month: number
    year: number
  }) {
    const {day, month, year} = dayFoo

    return (
      scrollToThisDay?.month === month &&
      scrollToThisDay.year === year &&
      scrollToThisDay.day === day
    )
  }

  useEffect(() => {
    scrollToRef.current?.scrollIntoView()
  }, [scrollToThisDay])

  return (
    <div className="p-5">
      <div ref={startElementRef}></div>
      {data.map(day => {
        const sessionsToday = sessions ? getSessionsToday(sessions, day) : null

        return (
          <div
            ref={shouldScrollToThisDay(day) ? scrollToRef : null}
            key={`${day.day}-${day.month}-${day.year}`}
          >
            <DayMobile dayData={day} sessionsToday={sessionsToday} />
          </div>
        )
      })}
      <div ref={endElementRef}></div>
    </div>
  )
}
