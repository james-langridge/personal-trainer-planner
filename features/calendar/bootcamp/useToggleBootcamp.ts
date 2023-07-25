import {useCallback, useEffect, useState} from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {useUpdateBootcampMutation} from '@/redux/apiSlice'
import {useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'

export function useToggleBootcamp(bootcamp: Bootcamp) {
  const user = useAppSelector(selectUser)
  const userBootcamps = user?.bootcamps
  const [isAttending, setIsAttending] = useState<boolean>(
    !!userBootcamps?.find(b => b.id === bootcamp.id),
  )
  const [updateBootcamp] = useUpdateBootcampMutation()

  const updateAttendee = useCallback(
    async (isAttending: boolean) => {
      await updateBootcamp({
        query: isAttending ? 'disconnect' : 'connect',
        id: bootcamp.id,
        userId: user?.id || '',
      }).unwrap()
    },
    [updateBootcamp, bootcamp.id, user?.id],
  )

  useEffect(() => {
    setIsAttending(!!userBootcamps?.find(b => b.id === bootcamp.id))
  }, [bootcamp.id, userBootcamps])

  function toggleAttendance() {
    try {
      if (isAttending) {
        void updateAttendee(true)
        setIsAttending(!isAttending)
      } else {
        void updateAttendee(false)
        setIsAttending(!isAttending)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {isAttending, toggleAttendance}
}
