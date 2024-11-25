'use client'

import React from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {useToggleBootcamp} from '@/features/calendar/bootcamp/useToggleBootcamp'

export function Checkbox({bootcamp}: {bootcamp: Bootcamp}) {
  const {isAttending, isLoading, toggleAttendance} = useToggleBootcamp(bootcamp)

  return (
    <input
      disabled={isLoading}
      type="checkbox"
      checked={isAttending}
      className="h-7 w-7 rounded"
      onChange={toggleAttendance}
      onClick={e => e.stopPropagation()}
    />
  )
}
