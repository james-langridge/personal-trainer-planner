import {useSession} from 'next-auth/react'
import React, {useEffect, useRef, useState} from 'react'

import {useUser} from '@/app/Providers'
import {DayMobile} from '@/components/DayMobile'
import {
  useMobileCalendarData,
  useCalendarIntersectionObserver,
  useLockBodyScroll,
  useIsMobile,
} from '@/hooks'
import {getWorkoutsToday, shouldScrollToThisDay} from '@/lib/calendar'

export function CalendarMobile() {
  const userState = useUser()
  const workouts = userState.user?.workouts
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
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'

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

  // TODO: Admin view is not optimised for mobile
  if (!isMobile || isAdmin) {
    return null
  }

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
