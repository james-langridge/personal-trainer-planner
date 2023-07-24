import React from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {
  BootcampCheckbox,
  BootcampLinkAdmin,
  BootcampLinkUser,
} from '@/components/calendar'
import {useToggleBootcamp} from '@/hooks'
import {selectIsAdmin} from '@/redux/authSlice'
import {setEvent} from '@/redux/eventSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'

export function BootcampItem({bootcamp}: {bootcamp: Bootcamp}) {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectIsAdmin)
  const {isAttending, toggleAttendance} = useToggleBootcamp(bootcamp)

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
      <BootcampCheckbox onChange={toggleAttendance} status={isAttending} />

      {isAdmin && <BootcampLinkAdmin onClick={onClick} bootcamp={bootcamp} />}

      {!isAdmin && <BootcampLinkUser bootcamp={bootcamp} />}
    </div>
  )
}
