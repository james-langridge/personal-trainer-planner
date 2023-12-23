'use client'

import {useCallback, useEffect, useState} from 'react'
import {toast} from 'react-toastify'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {
  useGetUserQuery,
  useUpdateBootcampAttendanceMutation,
} from '@/redux/services/users'
import {useAppSelector} from '@/redux/store'
import {selectUser} from '@/redux/usersSlice'

export function useToggleBootcamp(bootcamp: Bootcamp) {
  const userData = useAppSelector(selectUser)
  const {data: user} = useGetUserQuery(userData?.id || '', {
    skip: !userData,
  })
  const userBootcamps = user?.bootcamps
  const [isAttending, setIsAttending] = useState<boolean>(
    !!userBootcamps?.find(b => b.id === bootcamp.id),
  )
  const [updateBootcampAttendance, {isLoading}] =
    useUpdateBootcampAttendanceMutation()

  const updateAttendee = useCallback(async () => {
    if (!user || isLoading) {
      return
    }

    await updateBootcampAttendance({
      bootcampId: bootcamp.id,
      isAttending,
      userId: user?.id,
    }).unwrap()
  }, [bootcamp.id, isAttending, isLoading, updateBootcampAttendance, user])

  useEffect(() => {
    setIsAttending(!!userBootcamps?.find(b => b.id === bootcamp.id))
  }, [bootcamp.id, userBootcamps])

  async function toggleAttendance() {
    if (!user?.credits && !isAttending) {
      toast(
        `No credits remaining! Please contact ${process.env.NEXT_PUBLIC_PT_FIRST_NAME}.`,
      )

      return
    }

    try {
      await updateAttendee()

      setIsAttending(prevState => !prevState)

      let toastMessage
      const credits = user?.credits

      if (isAttending) {
        toastMessage =
          credits !== undefined
            ? `Attendance cancelled. Credits remaining: ${credits + 1}`
            : 'Attendance cancelled.'
      }

      if (!isAttending) {
        toastMessage =
          credits !== undefined
            ? `See you at the bootcamp! Credits remaining: ${credits - 1}`
            : 'See you at the bootcamp!'
      }

      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong...')
      console.error(error)
    }
  }

  return {isAttending, isLoading, toggleAttendance}
}
