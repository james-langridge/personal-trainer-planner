import {APPOINTMENT_STATUS} from '@prisma/client'
import {useState, useEffect, useCallback} from 'react'

import {Appointment} from '@/@types/apiResponseTypes'
import {useUpdateAppointmentMutation} from '@/redux/services/appointments'

export function useAppointmentStatus(appointment: Appointment) {
  const [status, setStatus] = useState(appointment.status)
  const [updateAppointment] = useUpdateAppointmentMutation()

  const updateStatus = useCallback(
    async (status: APPOINTMENT_STATUS) => {
      await updateAppointment({
        ownerId: appointment.ownerId,
        status: status,
        id: appointment.id,
      }).unwrap()
    },
    [updateAppointment, appointment.id, appointment.ownerId],
  )

  useEffect(() => {
    setStatus(appointment.status)
  }, [appointment.status])

  function toggleStatus() {
    try {
      if (status === APPOINTMENT_STATUS.NOT_ATTENDED) {
        void updateStatus(APPOINTMENT_STATUS.ATTENDED)
        setStatus(APPOINTMENT_STATUS.ATTENDED)
      } else {
        void updateStatus(APPOINTMENT_STATUS.NOT_ATTENDED)
        setStatus(APPOINTMENT_STATUS.NOT_ATTENDED)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {status, toggleStatus}
}
