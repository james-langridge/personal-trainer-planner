'use client'

import {Bootcamp} from '@/lib/calendar'

import {Checkbox, Title, useToggleBootcamp} from '.'
import {Day} from '@/@types/types'

export function BootcampItem({
  userBootcamps,
  bootcamp,
  day,
  userId,
}: {
  userBootcamps: {id: string}[]
  bootcamp: Bootcamp
  day: Day
  userId: string
}) {
  const {isAttending, toggle, status} = useToggleBootcamp(
    userBootcamps,
    bootcamp,
    userId,
  )

  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      <Checkbox
        onChange={toggle}
        status={isAttending}
        disabled={status === 'pending'}
      />
      <Title bootcamp={bootcamp} day={day} userId={userId} />
    </div>
  )
}
