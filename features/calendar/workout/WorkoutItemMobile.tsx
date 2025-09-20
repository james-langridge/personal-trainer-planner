'use client'

import {WORKOUT_STATUS} from '@prisma/client'
import clsx from 'clsx'
import Link from 'next/link'
import React, {useState} from 'react'
import Modal from 'react-modal'
import {useQueryClient} from '@tanstack/react-query'

import {Workout} from '@/@types/apiResponseTypes'
import {useWorkoutStatus} from '.'
import {CalendarForm} from '@/features/calendar/form'
import {Day} from '@/@types/types'

export function WorkoutItemMobile({
  workout,
  isAdmin = false,
  clientName,
  day,
  userId,
}: {
  workout: Workout
  isAdmin?: boolean
  clientName?: string
  day?: Day
  userId?: string
}) {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsOpen] = useState(false)
  const [eventId, setEventId] = useState<string>()

  const closeModal = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    setEventId(undefined)
  }

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isAdmin || !day || !userId) {
      // For non-admin, navigate normally
      if (!isAdmin) {
        window.location.href = `/workout/${workout?.id}`
      }
      return
    }

    setEventId(workout.id)
    queryClient.invalidateQueries({queryKey: ['workout', workout.id]})
    queryClient.refetchQueries({queryKey: ['workout', workout.id]})
    setIsOpen(true)
  }
  const {status, workoutStatus, toggleStatus} = useWorkoutStatus(workout)

  if (isAdmin && day && userId) {
    return (
      <div className="flex items-center gap-2 text-lg">
        <input
          disabled={status === 'pending'}
          type="checkbox"
          checked={workoutStatus === WORKOUT_STATUS.COMPLETED}
          className="h-7 w-7 rounded"
          onChange={toggleStatus}
        />

        <div
          onClick={handleClick}
          className={clsx(
            'p my-1 block w-full cursor-pointer rounded bg-emerald-400 px-2 text-white',
            {
              'line-through': workoutStatus === WORKOUT_STATUS.COMPLETED,
            },
          )}
        >
          {workout?.name}
          {clientName && <span className="ml-2 text-sm">({clientName})</span>}
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center fixed inset-0 z-50"
          className="max-h-[90vh] w-11/12 max-w-lg overflow-y-auto rounded-xl bg-white p-6"
        >
          <CalendarForm
            day={day}
            closeModal={closeModal}
            userId={userId}
            eventId={eventId}
            eventType={'WORKOUT'}
          />
        </Modal>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-lg">
      <input
        disabled={status === 'pending'}
        type="checkbox"
        checked={workoutStatus === WORKOUT_STATUS.COMPLETED}
        className="h-7 w-7 rounded"
        onChange={toggleStatus}
      />

      <Link
        href={`/workout/${workout?.id}`}
        className={clsx(
          'p my-1 block w-full rounded bg-emerald-400 px-2 text-white',
          {
            'line-through': workoutStatus === WORKOUT_STATUS.COMPLETED,
          },
        )}
      >
        {workout?.name}
      </Link>
    </div>
  )
}
