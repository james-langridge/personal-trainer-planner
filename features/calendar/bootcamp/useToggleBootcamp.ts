'use client'

import {useCallback, useEffect, useState} from 'react'
import {toast} from 'react-toastify'

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
  const [isLoading, setIsLoading] = useState(false)

  const updateAttendee = useCallback(async () => {
    if (!userId || isLoading) {
      return
    }
    setIsLoading(true)

    toggleBootcampAttendance.mutate({
      bootcampId: bootcamp.id,
      isAttending,
      userId,
    })

    setIsLoading(false)

    return toggleBootcampAttendance.data
  }, [])

  useEffect(() => {
    setIsAttending(!!userBootcamps.find(b => b.id === bootcamp.id))
  }, [bootcamp.id, userBootcamps])

  async function toggleAttendance() {
    toast('Please try again later. We are fixing a bug.')
    return

    // try {
    //   const res = await updateAttendee()
    //
    //   if (!res?.OK) {
    //     toast(
    //       `No credits remaining! Please contact ${process.env.NEXT_PUBLIC_PT_FIRST_NAME}.`,
    //     )
    //
    //     return
    //   }
    //
    //   setIsAttending(prevState => !prevState)
    //
    //   let toastMessage
    //   // todo confirm correct credits calculation
    //   const credits = res.credits
    //
    //   if (isAttending) {
    //     toastMessage =
    //       credits !== undefined
    //         ? `Attendance cancelled. Credits remaining: ${credits + 1}`
    //         : 'Attendance cancelled.'
    //   }
    //
    //   if (!isAttending) {
    //     toastMessage =
    //       credits !== undefined
    //         ? `See you at the bootcamp! Credits remaining: ${credits - 1}`
    //         : 'See you at the bootcamp!'
    //   }
    //
    //   toast.success(toastMessage)
    // } catch (error) {
    //   toast.error('Something went wrong...')
    //   console.error(error)
    // }
  }

  return {isAttending, isLoading, toggleAttendance}
}
