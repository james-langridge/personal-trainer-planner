import Link from 'next/link'
import React from 'react'

import {Appointment} from '@/@types/apiResponseTypes'

export function Title({
  appointment,
  isAdmin,
  onClick,
}: {
  appointment: Appointment
  isAdmin: boolean
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
}) {
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
      href={`/appointment/${appointment?.id}`}
      className="my-1 block w-full rounded bg-blue-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${appointment?.id}`}
    >
      {appointment?.name}
    </Link>
  )
}
