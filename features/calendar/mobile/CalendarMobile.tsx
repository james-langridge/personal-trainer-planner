'use client'

import React from 'react'
import {
  DateFilter,
  generateCalendarMonth,
  getEventsToday,
  getPrismaDateFilter,
  shouldScrollToThisDay,
} from '@/lib/calendar'
import {DayMobile} from '@/features/calendar/mobile/DayMobile'
import {AppointmentItemMobile} from '@/features/calendar/appointment'
import {BootcampItemMobile} from '@/features/calendar/bootcamp'
import {WorkoutItemMobile} from '@/features/calendar/workout'
import {useUserEvents} from '@/app/hooks/users'
import {useAllBootcamps} from '@/app/hooks/bootcamps'

export default function CalendarMobile({
  userId,
  dateFilter: dateFilterProp,
  isAdmin = false,
}: {
  userId: string
  dateFilter?: DateFilter
  isAdmin?: boolean
}) {
  const scrollToRef = React.useRef<HTMLDivElement>(null)
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const dateFilter =
    dateFilterProp || getPrismaDateFilter(currentYear, currentMonth, 6)

  const {data: userData} = useUserEvents({
    id: userId,
    dateFilter,
  })

  const {data: allBootcamps} = useAllBootcamps({
    dateFilter,
  })

  const monthData = generateCalendarMonth(dateFilter)

  React.useEffect(() => {
    if (scrollToRef.current && userData && allBootcamps) {
      scrollToRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [userData, allBootcamps])

  if (!userData || !allBootcamps) return null

  return (
    <div className="flex h-[90vh]">
      <div className="flex w-full flex-col px-5 sm:hidden">
        <div className="py-5">
          <div role="feed" aria-label="Calendar events">
            {monthData.map(day => {
              const appointmentsToday = userData?.appointments
                ? getEventsToday(day, userData.appointments)
                : null
              const workoutsToday = userData?.workouts
                ? getEventsToday(day, userData.workouts)
                : null
              const bootcampsToday = allBootcamps
                ? getEventsToday(day, allBootcamps)
                : null

              const isToday = shouldScrollToThisDay(day, {
                year: currentYear,
                month: currentMonth,
                day: now.getDate(),
              })

              return (
                <div
                  ref={isToday ? scrollToRef : null}
                  key={`${day.day}-${day.month}-${day.year}`}
                  className={isToday ? 'scroll-mt-4' : ''}
                >
                  <DayMobile dayData={day} isAdmin={isAdmin} userId={userId}>
                    <EventList
                      events={appointmentsToday}
                      renderItem={appointment => (
                        <AppointmentItemMobile
                          appointment={appointment}
                          isAdmin={isAdmin}
                        />
                      )}
                    />

                    <EventList
                      events={bootcampsToday}
                      renderItem={bootcamp => (
                        <BootcampItemMobile
                          bootcamp={bootcamp}
                          userId={userId}
                          userBootcamps={userData?.bootcamps ?? []}
                          isAdmin={isAdmin}
                        />
                      )}
                    />

                    <EventList
                      events={workoutsToday}
                      renderItem={workout => (
                        <WorkoutItemMobile
                          workout={workout}
                          isAdmin={isAdmin}
                        />
                      )}
                    />
                  </DayMobile>
                </div>
              )
            })}
          </div>
        </div>
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
