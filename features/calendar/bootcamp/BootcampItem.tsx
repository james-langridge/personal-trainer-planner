import React from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {selectIsAdmin} from '@/redux/authSlice'
import {setEvent} from '@/redux/eventSlice'
import {useAppDispatch, useAppSelector} from '@/redux/store'

import {Checkbox, Title, useToggleBootcamp} from '.'

export function BootcampItem({bootcamp}: {bootcamp: Bootcamp}) {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectIsAdmin)
  const {isAttending, isLoading, toggleAttendance} = useToggleBootcamp(bootcamp)
  function onClick(event: React.MouseEvent | React.KeyboardEvent) {
    if (!isAdmin) {
      return
    }

    const id = (event.target as HTMLElement).id

    dispatch(
      setEvent({
        id,
        type: 'BOOTCAMP',
      }),
    )
  }

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      <Checkbox
        onChange={toggleAttendance}
        status={isAttending}
        disabled={isLoading}
      />
      <Title bootcamp={bootcamp} isAdmin={isAdmin} onClick={onClick} />
    </div>
  )
}
