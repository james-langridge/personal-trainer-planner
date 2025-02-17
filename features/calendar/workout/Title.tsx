'use client'

import Link from 'next/link'
import React, {useState} from 'react'

import {Workout} from '@/lib/calendar'
import {CalendarForm} from '@/features/calendar/form'
import Modal from 'react-modal'
import {useSession} from 'next-auth/react'
import {Day} from '@/@types/types'

export function Title({
  workout,
  day,
  userId,
}: {
  workout: Workout
  day: Day
  userId: string
}) {
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const [isModalOpen, setIsOpen] = useState(false)
  const [eventId, setEventId] = useState<string>()
  const closeModal = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    event.stopPropagation()
    if (!isAdmin) {
      return
    }

    const workoutId = (event.target as HTMLElement).id
    setEventId(workoutId)
    setIsOpen(true)
  }

  if (isAdmin) {
    return (
      <div
        role="button"
        tabIndex={0}
        onKeyDown={e => onClick(e)}
        onClick={e => onClick(e)}
        className="my-1 block w-full rounded bg-emerald-400 text-xs font-bold text-white lg:text-base"
        id={workout?.id}
      >
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
          className="w-3/4 rounded-xl bg-white p-8"
        >
          <CalendarForm
            day={day}
            closeModal={closeModal}
            userId={userId}
            eventId={eventId}
            eventType={'WORKOUT'}
          />
        </Modal>
        {workout?.name}
      </div>
    )
  }

  return (
    <Link
      href={`/workout/${workout?.id}`}
      className="my-1 block w-full rounded bg-emerald-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${workout?.id}`}
    >
      {workout?.name}
    </Link>
  )
}
