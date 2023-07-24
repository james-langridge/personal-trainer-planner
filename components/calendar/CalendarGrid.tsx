import clsx from 'clsx'

import {Appointment, Bootcamp, Workout} from '@/@types/apiResponseTypes'
import {Day} from '@/@types/types'
import {
  AppointmentItems,
  BootcampItems,
  CalendarDay,
  CalendarEmptyDays,
  WorkoutItems,
} from '@/components/calendar'
import {useBootcamps, usePollForUserUpdates} from '@/hooks'
import {getEventsToday} from '@/lib/calendar'

export function CalendarGrid({monthData}: {monthData: Day[]}) {
  const bootcamps = useBootcamps()
  const [workouts, appointments] = usePollForUserUpdates()
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDaysLength = firstDayOfMonth > 0 ? firstDayOfMonth - 1 : 6
  const emptyDays = Array(emptyDaysLength).fill(null)
  const calendarSquares = firstDayOfMonth + monthData.length

  return (
    <div
      className={clsx(
        {
          'grid-rows-calendar-6': calendarSquares > 35,
          'grid-rows-calendar-5': calendarSquares <= 35,
        },
        'grid h-full w-full grid-cols-calendar ring-offset-1',
      )}
    >
      <CalendarEmptyDays emptyDays={emptyDays} />
      {monthData.map((day, index) => {
        const appointmentsToday: Appointment[] | null = appointments
          ? getEventsToday(day, appointments)
          : null
        const bootcampsToday: Bootcamp[] | null = bootcamps
          ? getEventsToday(day, bootcamps)
          : null
        const workoutsToday: Workout[] | null = workouts
          ? getEventsToday(day, workouts)
          : null
        const isFirstWeek = index + emptyDaysLength < 7

        return (
          <CalendarDay day={day} isFirstWeek={isFirstWeek} key={index}>
            {appointmentsToday && (
              <AppointmentItems appointments={appointmentsToday} />
            )}
            {bootcampsToday && <BootcampItems bootcamps={bootcampsToday} />}
            {workoutsToday && <WorkoutItems workouts={workoutsToday} />}
          </CalendarDay>
        )
      })}
    </div>
  )
}
