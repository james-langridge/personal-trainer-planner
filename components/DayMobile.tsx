import {
  Day,
  getMonthName,
  getLongWeekday,
  isDayToday,
  isDayTomorrow,
} from '@/lib/calendar'
import {WorkoutItemMobile} from '@/components/WorkoutItemMobile'
import {SerialisedWorkout} from '@/lib/workouts'

export function DayMobile({
  dayData,
  workoutsToday,
}: {
  dayData: Day
  workoutsToday: (SerialisedWorkout | undefined)[] | null | undefined
}) {
  const isToday = isDayToday(dayData)
  const isTomorrow = isDayTomorrow(dayData)
  const weekday = getLongWeekday(dayData)
  const monthName = getMonthName(dayData)

  return (
    <div className={isToday ? 'scroll-mt-16' : ''}>
      <hr className="my-6 h-px border-none bg-gray-900 dark:bg-gray-700" />
      <div className="mb-2 flex justify-between text-sm text-gray-500">
        <div className="font-bold">{weekday}</div>
        <div>
          {isToday
            ? 'Today'
            : isTomorrow
            ? 'Tomorrow'
            : dayData.day + ' ' + monthName}
        </div>
      </div>
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
    </div>
  )
}
