'use client'

import Link from 'next/link'
import React from 'react'

import {Workout} from '@/@types/apiResponseTypes'
import {setEvent} from '@/redux/eventSlice'
import {useAppDispatch} from '@/redux/store'

export function Title({
  isAdmin,
  workout,
}: {
  isAdmin: boolean
  workout: Workout
}) {
  const dispatch = useAppDispatch()

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    if (!isAdmin) {
      return
    }

    const workoutId = (event.target as HTMLElement).id

    dispatch(
      setEvent({
        id: workoutId,
        type: 'WORKOUT',
      }),
    )
  }

  if (isAdmin) {
    return (
      <div
        role="button"
        tabIndex={0}
        onKeyDown={onClick}
        onClick={onClick}
        className="my-1 block w-full rounded bg-emerald-400 text-xs font-bold text-white lg:text-base"
        id={workout?.id}
      >
        {workout?.name}
      </div>
    )
  }

  return (
    <Link
      href={`/workouts/${workout?.id}`}
      className="my-1 block w-full rounded bg-emerald-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${workout?.id}`}
    >
      {workout?.name}
    </Link>
  )
}
