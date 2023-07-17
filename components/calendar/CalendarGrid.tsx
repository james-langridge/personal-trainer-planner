import clsx from 'clsx'

import {Day} from '@/@types/types'
import {
  CalendarDay,
  CalendarEmptyDays,
  WorkoutItems,
} from '@/components/calendar'
import {useBootcamps, usePollForUserUpdates} from '@/hooks'
import {getWorkoutsToday} from '@/lib/calendar'
import {useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'

export function CalendarGrid({monthData}: {monthData: Day[]}) {
  const user = useAppSelector(selectUser)
  const userId = user?.id
  const userWorkouts = usePollForUserUpdates(userId)
  const bootcamps = useBootcamps(user?.type, userId)
  const workouts = [...userWorkouts, ...bootcamps]
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
        const workoutsToday = workouts ? getWorkoutsToday(day, workouts) : null
        const isFirstWeek = index + emptyDaysLength < 7

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
