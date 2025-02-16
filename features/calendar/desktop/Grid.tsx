import clsx from 'clsx'

import {
  Appointment,
  Bootcamp,
  DateFilter,
  generateCalendarMonth,
  getEventsToday,
  Workout,
} from '@/lib/calendar'

import {CalendarDay, EmptyDays} from '.'
import {AppoinmentsToday} from '@/features/calendar/desktop/AppoinmentsToday'
import {WorkoutsToday} from '@/features/calendar/desktop/WorkoutsToday'
import {BootcampsToday} from '@/features/calendar/desktop/BootcampsToday'
import {USER_TYPE} from '@prisma/client'
import {useUserEvents} from '@/app/api/hooks/users'
import {useAllBootcamps} from '@/app/api/hooks/bootcamps'

export function Grid({
  dateFilter,
  userId,
  isAdmin,
}: {
  dateFilter: DateFilter
  userId: string
  isAdmin: boolean
}) {
  const monthData = generateCalendarMonth(dateFilter)
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDaysLength = firstDayOfMonth > 0 ? firstDayOfMonth - 1 : 6
  const emptyDays = Array(emptyDaysLength).fill(null)
  const totalSpaces = emptyDaysLength + monthData.length
  const rows = Math.ceil(totalSpaces / 7)

  const {data} = useUserEvents({
    id: userId,
    dateFilter,
  })

  const {data: allBootcamps} = useAllBootcamps({
    dateFilter,
  })

  return (
    <div
      className={clsx(
        {
          'grid-rows-calendar-6': rows === 6,
          'grid-rows-calendar-5': rows === 5,
        },
        'grid h-full w-full grid-cols-calendar ring-offset-1',
      )}
    >
      <EmptyDays emptyDays={emptyDays} />
      {monthData.map((day, index) => {
        const isFirstWeek = index + emptyDaysLength < 7

        const appointmentsToday: Appointment[] | null = data?.appointments
          ? getEventsToday(day, data.appointments)
          : null
        const workoutsToday: Workout[] | null = data?.workouts
          ? getEventsToday(day, data.workouts)
          : null
        const bootcampsToday: Bootcamp[] | null = allBootcamps
          ? getEventsToday(day, allBootcamps)
          : null

        return (
          <CalendarDay
            day={day}
            isFirstWeek={isFirstWeek}
            key={index}
            isAdmin={isAdmin}
            userId={userId}
          >
            <AppoinmentsToday
              day={day}
              userId={userId}
              // dateFilter={dateFilter}
              appointments={appointmentsToday}
            />
            {data?.type === USER_TYPE.BOOTCAMP && (
              <BootcampsToday
                day={day}
                userId={userId}
                // dateFilter={dateFilter}
                allBootcamps={bootcampsToday}
                userBootcamps={data?.bootcamps}
              />
            )}
            <WorkoutsToday
              day={day}
              userId={userId}
              // dateFilter={dateFilter}
              workouts={workoutsToday}
            />
          </CalendarDay>
        )
      })}
    </div>
  )
}
