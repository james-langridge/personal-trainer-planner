import React from 'react'

import {Appointment} from '@/@types/apiResponseTypes'

import {Checkbox, Title} from '.'

export function AppointmentItem({
  appointment,
  isAdmin,
}: {
  appointment: Appointment
  isAdmin: boolean
}) {
  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      {isAdmin && <Checkbox appointment={appointment} />}
      <Title appointment={appointment} isAdmin={isAdmin} />
    </div>
  )
}
