'use client'

import {Appointment} from '@/@types/apiResponseTypes'

import {Checkbox, Title, useAppointmentStatus} from '.'
import {Day} from '@/@types/types'
import {useSession} from 'next-auth/react'

export function AppointmentItem({
  appointment,
  day,
  userId,
}: {
  appointment: Appointment
  day: Day
  userId: string
}) {
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const {status, toggleStatus} = useAppointmentStatus(appointment)

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      {isAdmin && <Checkbox onChange={toggleStatus} status={status} />}
      <Title appointment={appointment} day={day} userId={userId} />
    </div>
  )
}
