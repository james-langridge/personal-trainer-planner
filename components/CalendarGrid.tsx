import {useUser} from '@/app/Providers'
import {CalendarDay} from '@/components/CalendarDay'
import {CalendarEmptyDays} from '@/components/CalendarEmptyDays'
import {WorkoutItems} from '@/components/WorkoutItems'
import {Day, getWorkoutsToday} from '@/lib/calendar'
import {classNames} from '@/lib/misc'

export function CalendarGrid({monthData}: {monthData: Day[]}) {
  const userState = useUser()
  const workouts = userState.user?.workouts
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDays = Array(firstDayOfMonth).fill(null)
  const calendarSquares = firstDayOfMonth + monthData.length

  return (
    <div
      className={classNames(
        calendarSquares > 35 ? 'grid-rows-calendar-6' : 'grid-rows-calendar-5',
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
