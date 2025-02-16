import React from 'react'
import {Day} from '@/@types/types'
import {getEventsToday, Workout} from '@/lib/calendar'
import {WorkoutItem} from '@/features/calendar/workout'
import {useUserEvents} from '@/app/api/hooks/users'

export function WorkoutsToday({
  day,
  userId,
  // dateFilter,
  workouts,
}: {
  day: Day
  userId: string
  // dateFilter: {gte: Date; lt: Date}
  workouts: Workout[] | null
}) {
  // const {data, isLoading} = useUserEvents({
  //   id: userId,
  //   dateFilter,
  // })
  //
  // if (isLoading || !data) return null
  //
  // const {workouts} = data

  // const workoutsToday: Workout[] | null = workouts
  //   ? getEventsToday(day, workouts)
  //   : null

  if (!workouts) return null

  return (
    <div>
      {workouts.map(workout => {
        return (
          <div key={workout.id}>
            {workout && (
              <WorkoutItem workout={workout} day={day} userId={userId} />
            )}
          </div>
        )
      })}
    </div>
  )
}
