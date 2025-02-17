import {AppointmentItem} from '@/features/calendar/appointment'
import React from 'react'
import {Day} from '@/@types/types'
import {Appointment} from '@/lib/calendar'

export function AppointmentsToday({
  day,
  userId,
  appointments,
}: {
  day: Day
  userId: string
  appointments: Appointment[] | null
}) {
  if (!appointments) return null

  return (
    <div>
      {appointments.map(appointment => {
        return (
          <div key={appointment.id}>
            {appointment && (
              <AppointmentItem
                appointment={appointment}
                day={day}
                userId={userId}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
