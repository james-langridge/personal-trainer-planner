import React from 'react'

import {Appointment} from '@/@types/apiResponseTypes'

export function AppointmentLinkAdmin({
  onClick,
  appointment,
}: {
  onClick: (event: React.MouseEvent | React.KeyboardEvent) => void
  appointment: Appointment
}) {
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
