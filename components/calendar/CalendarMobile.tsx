import React, {useEffect, useRef, useState} from 'react'

import {DayMobile} from '@/components/calendar'
import {
  useMobileCalendarData,
  useCalendarIntersectionObserver,
  usePollForUserUpdates,
} from '@/hooks'
import {getWorkoutsToday, shouldScrollToThisDay} from '@/lib/calendar'

export function CalendarMobile() {
  const workouts = usePollForUserUpdates()
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
        const workoutsToday = workouts ? getWorkoutsToday(day, workouts) : null

        return (
          <div
            ref={
              shouldScrollToThisDay(day, scrollToThisDay) ? scrollToRef : null
            }
            key={`${day.day}-${day.month}-${day.year}`}
          >
            <DayMobile dayData={day} workoutsToday={workoutsToday} />
          </div>
        )
      })}
      <div ref={endElementRef}></div>
    </div>
  )
}
