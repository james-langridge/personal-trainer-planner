import {Bootcamp} from '@/@types/apiResponseTypes'
import {useGetBootcampsQuery} from '@/redux/services/bootcamps'
import {useAppSelector} from '@/redux/store'
import {selectUser} from '@/redux/usersSlice'

export function useBootcamps(): Bootcamp[] | null {
  const user = useAppSelector(selectUser)
  const isBootcamper = user?.type === 'BOOTCAMP'
  const {data: bootcamps} = useGetBootcampsQuery('bootcamps', {
    pollingInterval: 60000,
    skip: !isBootcamper,
  })

  if (!isBootcamper) {
    return null
  }

  return bootcamps || []
}
