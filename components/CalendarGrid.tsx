import clsx from 'clsx'

import {CalendarDay} from '@/components/CalendarDay'
import {CalendarEmptyDays} from '@/components/CalendarEmptyDays'
import {WorkoutItems} from '@/components/WorkoutItems'
import {usePollForUserUpdates} from '@/hooks'
import {Day, getWorkoutsToday} from '@/lib/calendar'

export function CalendarGrid({monthData}: {monthData: Day[]}) {
  const workouts = usePollForUserUpdates()
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDays = Array(firstDayOfMonth).fill(null)
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
        const workoutsToday = workouts ? getWorkoutsToday(day, workouts) : null
        const isFirstWeek = index + firstDayOfMonth < 7

        return (
          <CalendarDay day={day} isFirstWeek={isFirstWeek} key={index}>
            {workoutsToday && (
              <WorkoutItems workouts={workoutsToday} day={day} />
            )}
          </CalendarDay>
        )
      })}
    </div>
  )
}
