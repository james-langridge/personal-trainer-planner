import Link from 'next/link'
import React from 'react'

import {Appointment} from '@/@types/apiResponseTypes'

export function AppointmentLinkUser({appointment}: {appointment: Appointment}) {
  return (
    <Link
      href={`/workout/${appointment?.id}`}
      className="my-1 block w-full rounded bg-blue-400 text-xs font-bold text-white lg:text-base"
      data-testid={`${appointment?.id}`}
    >
      {appointment?.name}
    </Link>
  )
}
