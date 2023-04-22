'use client'

import React, {useEffect, useRef, useState} from 'react'
import {getSessionsToday, shouldScrollToThisDay} from '@/lib/calendar'
import {DayMobile} from '@/components/calendar/DayMobile'
import {
  useMobileCalendarData,
  useCalendarIntersectionObserver,
  useLockBodyScroll,
  useIsMobile,
} from '@/hooks'
import {useSessions} from '@/app/(training-app)/training-planner/Providers'

export function CalendarMobile() {
  const sessionsState = useSessions()
  const sessions = sessionsState.sessions
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
  const isMobile = useIsMobile()
  useLockBodyScroll()

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

  if (!isMobile) {
    return null
  }

  return (
    <div className="py-5">
      <div ref={startElementRef}></div>
      {data.map(day => {
        const sessionsToday = sessions ? getSessionsToday(day, sessions) : null

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
