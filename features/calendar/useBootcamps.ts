import {Bootcamp} from '@/@types/apiResponseTypes'
import {useGetBootcampsQuery} from '@/redux/apiSlice'
import {useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'

export function useBootcamps(): Bootcamp[] | null {
  const user = useAppSelector(selectUser)
  const isBootcamper = user?.type === 'BOOTCAMP'
  const {data: bootcamps} = useGetBootcampsQuery('foo', {
    pollingInterval: 60000,
    skip: !isBootcamper,
  })

  if (!isBootcamper) {
    return null
  }

  return bootcamps || []
}
