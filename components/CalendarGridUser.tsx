import {getServerSession} from 'next-auth/next'
import React from 'react'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {useUser} from '@/app/Providers'
import {CalendarDay} from '@/components/CalendarDay'
import {CalendarEmptyDays} from '@/components/CalendarEmptyDays'
import {WorkoutItem} from '@/components/WorkoutItem'
import {Day, getWorkoutsToday} from '@/lib/calendar'
import {db} from '@/lib/db'
import {classNames} from '@/lib/misc'
import {UserWithWorkouts} from '@/lib/users'

const getUserWithWorkouts = async (
  id?: string,
): Promise<{
  user: UserWithWorkouts | null | undefined
}> => {
  if (!id) {
    return {user: undefined}
  }

  const user: UserWithWorkouts | null = await db.user.findUnique({
    select: {
      id: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      name: true,
      workouts: {
        where: {
          deleted: false,
        },
      },
    },
    where: {
      id: id,
    },
  })

  return {user: user}
}

export default async function CalendarGridUser({
  monthData,
}: {
  monthData: Day[]
}) {
  // TODO: get session date here instead of context
  const session = await getServerSession(authOptions)
  const {user} = await getUserWithWorkouts(session?.user?.id)
  // const userState = useUser()
  const workouts = user?.workouts

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
