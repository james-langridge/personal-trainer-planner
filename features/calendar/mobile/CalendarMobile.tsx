'use client'

import React from 'react'
import {useInfiniteQuery} from '@tanstack/react-query'
import {useInView} from 'react-intersection-observer'
import {
  generateCalendarMonth,
  getEventsToday,
  getPrismaDateFilter,
  shouldScrollToThisDay,
} from '@/lib/calendar'
import {DayMobile} from '@/features/calendar/mobile/DayMobile'
import {AppointmentItemMobile} from '@/features/calendar/appointment'
import {BootcampItemMobile} from '@/features/calendar/bootcamp'
import {WorkoutItemMobile} from '@/features/calendar/workout'
import {getUserEvents} from '@/app/api/client/users'
import {getAllBootcamps} from '@/app/api/client/bootcamps'

function getMonthFilter(pageParam: {year: number; month: number}) {
  return getPrismaDateFilter(pageParam.year, pageParam.month)
}

function getNextMonth(current: {year: number; month: number}) {
  const nextMonth = current.month + 1
  return {
    year: nextMonth === 12 ? current.year + 1 : current.year,
    month: nextMonth === 12 ? 0 : nextMonth,
  }
}

function getPreviousMonth(current: {year: number; month: number}) {
  const prevMonth = current.month - 1
  return {
    year: prevMonth === -1 ? current.year - 1 : current.year,
    month: prevMonth === -1 ? 11 : prevMonth,
  }
}

export default function CalendarMobile({userId}: {userId: string}) {
  const {ref: topRef, inView: isTopVisible} = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
    delay: 500,
  })

  const {ref: bottomRef, inView: isBottomVisible} = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
  })

  const now = new Date()
  const initialPageParam = {
    year: now.getFullYear(),
    month: now.getMonth(),
  }

  const {
    data: userEventsData,
    fetchNextPage: fetchNextUserPage,
    fetchPreviousPage: fetchPreviousUserPage,
    hasNextPage: hasNextUserPage,
    hasPreviousPage: hasPreviousUserPage,
    isFetchingNextPage: isFetchingNextUserPage,
    isFetchingPreviousPage: isFetchingPreviousUserPage,
  } = useInfiniteQuery({
    queryKey: ['user-events', userId],
    queryFn: async ({pageParam}) => {
      const dateFilter = getMonthFilter(pageParam)
      const monthData = generateCalendarMonth(dateFilter)
      const userData = await getUserEvents({
        id: userId,
        dateFilter,
      })

      return {
        monthData,
        userData,
        pageParam,
      }
    },
    initialPageParam,
    getNextPageParam: lastPage => getNextMonth(lastPage.pageParam),
    getPreviousPageParam: firstPage => getPreviousMonth(firstPage.pageParam),
  })

  const {
    data: bootcampsData,
    fetchNextPage: fetchNextBootcampsPage,
    fetchPreviousPage: fetchPreviousBootcampsPage,
  } = useInfiniteQuery({
    queryKey: ['bootcamps'],
    queryFn: async ({pageParam}) => {
      const dateFilter = getMonthFilter(pageParam)
      const bootcamps = await getAllBootcamps({dateFilter})

      return {
        bootcamps,
        pageParam,
      }
    },
    initialPageParam,
    getNextPageParam: lastPage => getNextMonth(lastPage.pageParam),
    getPreviousPageParam: firstPage => getPreviousMonth(firstPage.pageParam),
  })

  React.useEffect(() => {
    if (isTopVisible && hasPreviousUserPage) {
      fetchPreviousUserPage()
      fetchPreviousBootcampsPage()
    }
  }, [
    isTopVisible,
    hasPreviousUserPage,
    fetchPreviousUserPage,
    fetchPreviousBootcampsPage,
  ])

  React.useEffect(() => {
    if (isBottomVisible && hasNextUserPage) {
      fetchNextUserPage()
      fetchNextBootcampsPage()
    }
  }, [
    isBottomVisible,
    hasNextUserPage,
    fetchNextUserPage,
    fetchNextBootcampsPage,
  ])

  const scrollToRef = React.useRef<HTMLDivElement>(null)
  const [hasScrolledToToday, setHasScrolledToToday] = React.useState(false)

  React.useEffect(() => {
    if (userEventsData?.pages && !hasScrolledToToday) {
      const today = new Date()
      scrollToRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      setHasScrolledToToday(true)
    }
  }, [userEventsData?.pages, hasScrolledToToday])

  if (!userEventsData || !bootcampsData) return null

  return (
    <div className="flex h-[90vh]">
      <div className="flex w-full flex-col px-5 sm:hidden">
        <div className="py-5">
          <div ref={topRef} className="h-4" aria-live="polite">
            {isFetchingPreviousUserPage && <LoadingIndicator position="top" />}
          </div>

          <div role="feed" aria-label="Calendar events">
            {userEventsData.pages.map((page, pageIndex) =>
              page.monthData.map(day => {
                const appointmentsToday = page.userData?.appointments
                  ? getEventsToday(day, page.userData.appointments)
                  : null
                const workoutsToday = page.userData?.workouts
                  ? getEventsToday(day, page.userData.workouts)
                  : null
                const bootcampsToday = bootcampsData.pages[pageIndex]?.bootcamps
                  ? getEventsToday(
                      day,
                      bootcampsData.pages[pageIndex].bootcamps,
                    )
                  : null

                const isToday = shouldScrollToThisDay(day, {
                  weekDay: now.getDay(),
                  year: now.getFullYear(),
                  month: now.getMonth(),
                  day: now.getDate(),
                })

                return (
                  <div
                    ref={isToday ? scrollToRef : null}
                    key={`${day.day}-${day.month}-${day.year}`}
                    className={isToday ? 'scroll-mt-4' : ''}
                  >
                    <DayMobile dayData={day}>
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
                            userBootcamps={page.userData?.bootcamps ?? []}
                          />
                        )}
                      />

                      <EventList
                        events={workoutsToday}
                        renderItem={workout => (
                          <WorkoutItemMobile workout={workout} />
                        )}
                      />
                    </DayMobile>
                  </div>
                )
              }),
            )}
          </div>

          <div ref={bottomRef} className="h-4" aria-live="polite">
            {isFetchingNextUserPage && <LoadingIndicator position="bottom" />}
          </div>
        </div>
      </div>
    </div>
  )
}

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
