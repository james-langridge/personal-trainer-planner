'use client'

import {APPOINTMENT_STATUS} from '@prisma/client'
import React from 'react'

import {Appointment} from '@/@types/apiResponseTypes'
import {useAppointmentStatus} from '@/features/calendar/appointment/useAppointmentStatus'

export function Checkbox({appointment}: {appointment: Appointment}) {
  const {status, toggleStatus} = useAppointmentStatus(appointment)

  return (
    <input
      type="checkbox"
      checked={status === APPOINTMENT_STATUS.ATTENDED}
      className="h-7 w-7 rounded"
      onChange={toggleStatus}
      onClick={e => e.stopPropagation()}
    />
  )
}
