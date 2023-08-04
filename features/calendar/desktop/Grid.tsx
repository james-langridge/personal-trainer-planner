import clsx from 'clsx'

import {Appointment, Bootcamp, Workout} from '@/@types/apiResponseTypes'
import {Day} from '@/@types/types'
import {useBootcamps, usePollForUserUpdates} from '@/features/calendar'
import {AppointmentList} from '@/features/calendar/appointment'
import {BootcampList} from '@/features/calendar/bootcamp'
import {WorkoutList} from '@/features/calendar/workout'
import {getEventsToday} from '@/lib/calendar'

import {CalendarDay, EmptyDays} from '.'

export function Grid({monthData}: {monthData: Day[]}) {
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
      <EmptyDays emptyDays={emptyDays} />
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
              <AppointmentList appointments={appointmentsToday} />
            )}
            {bootcampsToday && <BootcampList bootcamps={bootcampsToday} />}
            {workoutsToday && <WorkoutList workouts={workoutsToday} />}
          </CalendarDay>
        )
      })}
    </div>
  )
}
