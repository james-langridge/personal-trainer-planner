'use client'

import React from 'react'
import {useInView} from 'react-intersection-observer'
import {useCalendarData} from './useCalendarData'
import {Day} from './Day'
import {getEventsToday, shouldScrollToThisDay} from '@/lib/calendar'
import {AppointmentItemMobile} from '@/features/calendar/appointment'
import {BootcampItemMobile} from '@/features/calendar/bootcamp'
import {WorkoutItemMobile} from '@/features/calendar/workout'
import {
  UserEvents,
  Bootcamp,
} from '@/features/calendar/mobile/CalendarMobileContainer'

function LoadingIndicator({position}: {position: 'top' | 'bottom'}) {
  return (
    <div
      role="status"
      aria-label={`Loading ${position === 'top' ? 'previous' : 'next'} month`}
      className="flex items-center justify-center py-4"
    >
      <div className="text-center text-gray-500">
        Loading {position === 'top' ? 'previous' : 'next'} month...
      </div>
    </div>
  )
}

function EventList({
  events,
  renderItem,
}: {
  events: any[] | null
  renderItem: (event: any, index: number) => React.ReactNode
}) {
  if (!events || events.length === 0) return null

  return (
    <>
      {events.map((event, index) => (
        <div key={event?.id}>
          {event && renderItem(event, index)}
          {index < events.length - 1 && (
            <hr
              className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </>
  )
}

export function CalendarMobile({
  initialData,
  user,
  userId,
  allBootcamps,
}: {
  initialData?: any
  user: UserEvents
  userId: string
  allBootcamps: Bootcamp[]
}) {
  const {ref: topRef, inView: isTopVisible} = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
    delay: 500, // Add delay to prevent rapid scrolling issues
  })

  const {ref: bottomRef, inView: isBottomVisible} = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
  })

  const {data, scrollToThisDay, isLoading} = useCalendarData({
    initialData,
    onTopVisible: isTopVisible,
    onBottomVisible: isBottomVisible,
  })

  const scrollToRef = React.useRef<HTMLDivElement>(null)
  const previousScrollToDay = React.useRef(scrollToThisDay)

  React.useEffect(() => {
    if (scrollToThisDay !== previousScrollToDay.current) {
      scrollToRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      previousScrollToDay.current = scrollToThisDay
    }
  }, [scrollToThisDay])

  const {bootcamps, appointments, workouts} = user

  return (
    <div className="py-5">
      <div ref={topRef} className="h-4" aria-live="polite">
        {isLoading && <LoadingIndicator position="top" />}
      </div>

      <div role="feed" aria-label="Calendar events">
        {data.map(day => {
          const appointmentsToday = appointments
            ? getEventsToday(day, appointments)
            : null
          const bootcampsToday = allBootcamps
            ? getEventsToday(day, allBootcamps)
            : null
          const workoutsToday = workouts ? getEventsToday(day, workouts) : null

          return (
            <div
              ref={
                shouldScrollToThisDay(day, scrollToThisDay) ? scrollToRef : null
              }
              key={`${day.day}-${day.month}-${day.year}`}
              className={
                shouldScrollToThisDay(day, scrollToThisDay) ? 'scroll-mt-4' : ''
              }
            >
              <Day dayData={day}>
                <EventList
                  events={appointmentsToday}
                  renderItem={appointment => (
                    <AppointmentItemMobile appointment={appointment} />
                  )}
                />

                <EventList
                  events={bootcampsToday}
                  renderItem={bootcamp => (
                    <BootcampItemMobile
                      bootcamp={bootcamp}
                      userId={userId}
                      userBootcamps={bootcamps}
                    />
                  )}
                />

                <EventList
                  events={workoutsToday}
                  renderItem={workout => (
                    <WorkoutItemMobile workout={workout} />
                  )}
                />
              </Day>
            </div>
          )
        })}
      </div>

      <div ref={bottomRef} className="h-4" aria-live="polite">
        {isLoading && <LoadingIndicator position="bottom" />}
      </div>
    </div>
  )
}
