import React from 'react'

import {Appointment} from '@/@types/apiResponseTypes'
import {selectIsAdmin} from '@/redux/authSlice'
import {setEvent} from '@/redux/eventSlice'
import {useAppDispatch, useAppSelector} from '@/redux/store'

import {Checkbox, Title, useAppointmentStatus} from '.'

export function AppointmentItem({appointment}: {appointment: Appointment}) {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectIsAdmin)
  const {status, toggleStatus} = useAppointmentStatus(appointment)

  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    if (!isAdmin) {
      return
    }

    const id = (event.target as HTMLElement).id

    dispatch(
      setEvent({
        id,
        type: 'APPOINTMENT',
      }),
    )
  }

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      {isAdmin && <Checkbox onChange={toggleStatus} status={status} />}
      <Title appointment={appointment} isAdmin={isAdmin} onClick={onClick} />
    </div>
  )
}
