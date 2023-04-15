'use client'

import React, {useEffect, useRef, useState} from 'react'
import {Session} from '@prisma/client'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {getSessionsToday, shouldScrollToThisDay} from '@/lib/calendar'
import {DayMobile} from '@/components/calendar/DayMobile'
import {useMobileCalendarData, useCalendarIntersectionObserver} from '@/hooks'

export function CalendarMobile({
  sessions,
}: {
  sessions?: Session[] | SerialisedSession[]
}) {
  const [isFrozen, setIsFrozen] = useState(false)
  const {data, scrollToThisDay, loadNextMonth, loadPreviousMonth} =
    useMobileCalendarData()
  const startElementRef = useRef<HTMLDivElement>(null)
  const endElementRef = useRef(null)
  const scrollToRef = useRef<HTMLDivElement>(null)
  const {isStartVisible, isEndVisible} = useCalendarIntersectionObserver(
    startElementRef,
    endElementRef,
  )

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

  useEffect(() => {
    scrollToRef.current?.scrollIntoView()
  }, [scrollToThisDay])

  return (
    <div className="py-5">
      <div ref={startElementRef}></div>
      {data.map(day => {
        const sessionsToday = sessions ? getSessionsToday(sessions, day) : null

        return (
          <div
            ref={
              shouldScrollToThisDay(day, scrollToThisDay) ? scrollToRef : null
            }
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
