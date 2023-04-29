import React from 'react'
import {classNames} from '@/lib/misc'
import {CalendarEmptyDays} from '@/components/calendar/CalendarEmptyDays'
import {Day, getWorkoutsToday} from '@/lib/calendar'
import {CalendarDay} from '@/components/calendar/CalendarDay'
import {WorkoutItem} from '@/components/calendar/WorkoutItem'
import {useUser} from '@/app/Providers'

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
            {workoutsToday &&
              workoutsToday.map((workout, i) => {
                return (
                  <div key={day.day * day.year * day.month * i}>
                    {workout && <WorkoutItem workout={workout} />}
                  </div>
                )
              })}
          </CalendarDay>
        )
      })}
    </div>
  )
}
