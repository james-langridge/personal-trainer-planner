'use client'

import {useEffect, useRef, useState} from 'react'

import {Bootcamp} from '@/lib/calendar'
import {useToggleBootcampAttendance} from '@/app/hooks/bootcamps'
import {Id, toast} from 'react-toastify'

export function useToggleBootcamp(
  userBootcamps: {id: string}[],
  bootcamp: Bootcamp,
  userId: string,
) {
  const {mutate, status, data} = useToggleBootcampAttendance(
    userId,
    bootcamp.id,
  )
  const [isAttending, setIsAttending] = useState<boolean>(
    !!userBootcamps?.find(ub => ub.id === bootcamp.id),
  )
  const toastId = useRef<Id>(null)

  useEffect(() => {
    setIsAttending(!!userBootcamps.find(ub => ub.id === bootcamp.id))
  }, [bootcamp.id, userBootcamps])

  useEffect(() => {
    let toastMessage
    switch (status) {
      case 'pending':
        toastMessage = !isAttending ? 'Signing you up...' : 'Cancelling...'
        toastId.current = toast(toastMessage, {type: 'info'})
        setIsAttending(prev => !prev)
        break
      case 'success':
        if (!data.OK) {
          toastMessage = `No credits remaining! Please contact ${process.env.NEXT_PUBLIC_PT_FIRST_NAME}.`
          toastId.current &&
            toast.update(toastId.current, {render: toastMessage, type: 'error'})
          setIsAttending(false)
          return
        }

        toastMessage = isAttending
          ? `See you at the bootcamp! Credits remaining: ${data.credits}`
          : `Attendance cancelled. Credits remaining: ${data.credits}`
        toastId.current &&
          toast.update(toastId.current, {render: toastMessage, type: 'success'})
        break
      case 'error':
        toastId.current &&
          toast.update(toastId.current, {
            render: 'Something went wrong...',
            type: 'error',
          })
        setIsAttending(prev => !prev)
        break
    }
  }, [status])

  function toggle() {
    mutate({
      bootcampId: bootcamp.id,
      userId,
    })
  }

  return {isAttending, toggle, status}
}
