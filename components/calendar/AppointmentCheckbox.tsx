import {APPOINTMENT_STATUS} from '@prisma/client'
import React from 'react'

export function AppointmentCheckbox({
  onChange,
  status,
}: {
  onChange: () => void
  status: APPOINTMENT_STATUS
}) {
  return (
    <input
      type="checkbox"
      checked={status === APPOINTMENT_STATUS.ATTENDED}
      className="h-7 w-7 rounded"
      onChange={onChange}
      onClick={e => e.stopPropagation()}
    />
  )
}
