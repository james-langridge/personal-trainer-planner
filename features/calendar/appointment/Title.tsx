'use client'

import Link from 'next/link'
import React from 'react'

import {Appointment} from '@/@types/apiResponseTypes'
import {setEvent} from '@/redux/eventSlice'
import {useAppDispatch} from '@/redux/store'

export function Title({
  appointment,
  isAdmin,
}: {
  appointment: Appointment
  isAdmin: boolean
}) {
  const dispatch = useAppDispatch()

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    if (!isAdmin) {
      return
    }

    const id = (event.target as HTMLElement).id

    // FIXME: this is supposed to open modal when clicked - now broken
    dispatch(
      setEvent({
        id,
        type: 'APPOINTMENT',
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
        className="my-1 block w-full rounded bg-blue-400 text-xs font-bold text-white lg:text-base"
        id={appointment?.id}
      >
        {appointment?.name}
      </div>
    )
  }

  return (
    <Link
      href={`/appointments/${appointment?.id}`}
      className="my-1 block w-full rounded bg-blue-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${appointment?.id}`}
    >
      {appointment?.name}
    </Link>
  )
}
