import {useEffect, useRef, useState} from 'react'

import {Workout} from '@/@types/apiResponseTypes'
import {WorkoutKey} from '@/@types/types'
import {sortWorkouts} from '@/lib/workouts'
import {useGetUserQuery} from '@/redux/apiSlice'

export function useSortWorkouts(slug: string) {
  const [sortCol, setSortCol] = useState<Record<string, WorkoutKey>>({
    key: 'date',
  })
  const [sortedWorkouts, setSortedWorkouts] = useState<Workout[] | undefined>()
  const {data: user} = useGetUserQuery(slug)
  const prevSortColRef = useRef<Record<string, WorkoutKey>>()
  const sortOrder = useRef<'asc' | 'des'>('asc')

  useEffect(() => {
    if (!user) {
      return
    }

    if (prevSortColRef.current?.key === sortCol.key) {
      sortOrder.current = sortOrder.current === 'asc' ? 'des' : 'asc'
    } else {
      sortOrder.current = 'asc'
    }

    const sorted = sortWorkouts(
      sortCol.key,
      [...user.workouts],
      sortOrder.current === 'asc',
    )

    setSortedWorkouts(sorted)
    prevSortColRef.current = sortCol
  }, [sortCol, user])

  return {sortedWorkouts, user, setSortCol}
}
