import React from 'react'

import {Appointment} from '@/@types/apiResponseTypes'
import {AppointmentItem} from '@/features/calendar/appointment'

export function AppointmentList({appointments}: {appointments: Appointment[]}) {
  return (
    <>
      {appointments.map(appointment => {
        return (
          <div key={appointment.id}>
            {appointment && <AppointmentItem appointment={appointment} />}
          </div>
        )
      })}
    </>
  )
}
