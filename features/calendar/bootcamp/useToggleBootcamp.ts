'use client'

import {useEffect, useState} from 'react'

import {Bootcamp} from '@/lib/calendar'
import {useToggleBootcampAttendance} from '@/app/hooks/bootcamps'

export function useToggleBootcamp(
  userBootcamps: {id: string}[],
  bootcamp: Bootcamp,
  userId: string,
) {
  const toggleBootcampAttendance = useToggleBootcampAttendance(
    userId,
    bootcamp.id,
  )
  const [isAttending, setIsAttending] = useState<boolean>(
    !!userBootcamps?.find(b => b.id === bootcamp.id),
  )

  useEffect(() => {
    setIsAttending(!!userBootcamps.find(b => b.id === bootcamp.id))
  }, [bootcamp.id, userBootcamps])

  function toggle() {
    toggleBootcampAttendance.mutate({
      bootcampId: bootcamp.id,
      isAttending,
      userId,
    })
  }

  return {isAttending, toggle, isPending: toggleBootcampAttendance.isPending}
}
