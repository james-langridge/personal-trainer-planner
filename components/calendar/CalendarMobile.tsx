import React, {useEffect, useRef, useState} from 'react'

import {
  AppointmentItemMobile,
  BootcampItemMobile,
  DayMobile,
  WorkoutItemMobile,
} from '@/components/calendar'
import {
  useMobileCalendarData,
  useCalendarIntersectionObserver,
  usePollForUserUpdates,
  useBootcamps,
} from '@/hooks'
import {getEventsToday, shouldScrollToThisDay} from '@/lib/calendar'

export function CalendarMobile() {
  const [workouts, appointments] = usePollForUserUpdates()
  const bootcamps = useBootcamps()
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
        const appointmentsToday = appointments
          ? getEventsToday(day, appointments)
          : null
        const bootcampsToday = bootcamps ? getEventsToday(day, bootcamps) : null
        const workoutsToday = workouts ? getEventsToday(day, workouts) : null

        return (
          <div
            ref={
              shouldScrollToThisDay(day, scrollToThisDay) ? scrollToRef : null
            }
            key={`${day.day}-${day.month}-${day.year}`}
          >
            <DayMobile dayData={day}>
              {appointmentsToday &&
                appointmentsToday.map((appointment, i) => {
                  return (
                    <div key={appointment?.id}>
                      {appointment && (
                        <AppointmentItemMobile appointment={appointment} />
                      )}
                      {i < appointmentsToday.length - 1 && (
                        <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  )
                })}

              {bootcampsToday &&
                bootcampsToday.map((bootcamp, i) => {
                  return (
                    <div key={bootcamp?.id}>
                      {bootcamp && <BootcampItemMobile bootcamp={bootcamp} />}
                      {i < bootcampsToday.length - 1 && (
                        <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  )
                })}

              {workoutsToday &&
                workoutsToday.map((workout, i) => {
                  return (
                    <div key={workout?.id}>
                      {workout && <WorkoutItemMobile workout={workout} />}
                      {i < workoutsToday.length - 1 && (
                        <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  )
                })}
            </DayMobile>
          </div>
        )
      })}
      <div ref={endElementRef}></div>
    </div>
  )
}
