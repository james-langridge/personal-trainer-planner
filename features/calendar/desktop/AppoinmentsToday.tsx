import {AppointmentItem} from '@/features/calendar/appointment'
import React from 'react'
import {Day} from '@/@types/types'
import {Appointment, DateFilter, getEventsToday} from '@/lib/calendar'
import {useUserEvents} from '@/app/api/hooks/users'

export function AppoinmentsToday({
  day,
  userId,
  // dateFilter,
  appointments,
}: {
  day: Day
  userId: string
  // dateFilter: DateFilter
  appointments: Appointment[] | null
}) {
  // const {data, isLoading} = useUserEvents({
  //   id: userId,
  //   dateFilter,
  // })
  //
  // console.log({dateFilter})
  //
  // if (isLoading || !data) return null
  //
  // const appointmentsToday: Appointment[] | null = appointments
  //   ? getEventsToday(day, appointments)
  //   : null

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
